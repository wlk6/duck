<template>
  <div class="chat-ai-container">
    <div class="chat-container">
      <div class="chat-messages" ref="messagesContainer">
        <!-- Welcome screen -->
        <div v-if="showWelcome" class="welcome-container">
          <div class="welcome-title">嘎嘎~你好呀！我是专门解答鸭子养殖问题的鸭鸭~</div>
          <div class="welcome-message">
            不管是小鸭子生病了、饲料怎么配、鸭舍怎么搭，还是防疫方面的问题，我都会用最简单易懂的话告诉你~<br>
            请把你的任务交给我吧~
          </div>
          <div class="welcome-features">
            <div v-for="feature in features" :key="feature.text" class="feature-item">
              <div class="feature-icon">{{ feature.icon }}</div>
              <div class="feature-text">{{ feature.text }}</div>
            </div>
          </div>
        </div>

        <!-- Chat messages -->
        <div v-for="(message, index) in messages" :key="index" 
             :class="['message-container', message.type === 'bot' ? 'bot-message-container' : '']">
          <img v-if="message.type === 'bot'" class="bot-avatar" 
               src="@/assets/images/my-notion-face-transparent.png" alt="Bot Avatar">
          
          <div class="message-content">
              <div v-if="message.imageUrl" class="uploaded-file">
                <div class="image-preview-thumbnail" @click="showFullImagePreview = true; uploadedImageUrl = message.imageUrl;">
                  <img src="https://medical-image111.oss-cn-beijing.aliyuncs.com/d1756e9f-6873-4a07-a234-3110ff2dad99.png" alt="Uploaded image">
                </div>
                <div class="upload-status success" style="overflow: hidden;">
                  ✓ {{ message.fileName }}
                </div>
            </div>
            <div :class="['message', message.type === 'bot' ? 'bot-message' : 'user-message']"
                 v-html="formatMessage(message.content)"></div>
            <div class="action-buttons">
              <button class="copy-btn" @click="copyToClipboard(message.content, index)">
                <img :src="copiedIndex === index ? '/img/copied.png' : '/img/copy.png'" alt="复制">
                <span class="tooltip">{{ copiedIndex === index ? '已复制' : '复制到剪贴板' }}</span>
              </button>
              
              <button v-if="message.type === 'bot'" class="speak-btn" @click="toggleSpeech(message, index)">
                <div v-if="speakingIndex === index && !isSpeechPaused" class="sound-wave">
                  <span></span><span></span><span></span>
                </div>
                <img v-else src="@/assets/images/read.png" alt="朗读">
                <span class="tooltip">
                  {{ speakingIndex === index ? (isSpeechPaused ? '继续朗读' : '暂停朗读') : '语音朗读' }}
                </span>
              </button>
            </div>
            
            <!-- 追问提示词 -->
            <div v-if="message.suggestions && message.suggestions.length > 0" class="suggestions-container">    
              <div class="suggestions-title">你可以这样问：</div>
              <div class="suggestions-list">
                <button 
                  v-for="(suggestion, sIndex) in message.suggestions" 
                  :key="sIndex" 
                  class="suggestion-item"
                  @click="sendSuggestion(suggestion)"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading indicators -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-animation">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        </div>
        
        <div v-if="showTyping" class="typing-indicator">
          <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
          鸭鸭正在思考...
        </div>
      </div>

      <!-- Input area -->
      <div v-if="uploadStatus" class="upload-file">
            <div v-if="uploadedImageUrl" class="image-preview-thumbnail" @click="showFullImagePreview = true">
              <img src="https://medical-image111.oss-cn-beijing.aliyuncs.com/d1756e9f-6873-4a07-a234-3110ff2dad99.png">
            </div>
            <div v-if="uploadStatus" class="upload-status">
              <span v-if="uploadStatus === 'uploading'" class="uploading">
                <span class="uploading-spinner"></span> 上传中...
              </span>
              <span v-else-if="uploadStatus === 'success'" class="success">
                ✓ {{ uploadedFileName }}
              </span>
              <span v-else-if="uploadStatus === 'error'" class="error">
                ✗ 上传失败，请重试
              </span>
            </div>
          </div>
      <div class="chat-input">
        
        <div class="input-container">
          <input type="text" v-model="messageInput" placeholder="输入您的问题..." 
                autocomplete="off" @keypress.enter="sendMessage">
          <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileUpload">
          <button class="file-button" @click="triggerFileInput">
            <img src="/public/img/file-button.png" style="width: 100%;height: 100%;">
            <span class="tooltip">仅支持图片</span>
          </button>

        </div>
        
        <div class="button-group">
          <button id="send-button" @click="sendMessage" :disabled="isStreaming && !isPaused">发送</button>
          <button id="pause-button" v-if="isStreaming" @click="togglePause" 
                  :class="{ active: isPaused }">
            {{ isPaused ? '继续' : '暂停' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showFullImagePreview" class="full-image-preview" @click="showFullImagePreview = false">
    <div class="preview-content">
      <img :src="uploadedImageUrl" alt="预览图">
      <div class="file-info">{{ uploadedFileName }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';

interface Message {
  type: 'user' | 'bot';
  content: string;
  isStreaming?: boolean;
  suggestions?: string[];
  imageUrl?: string;
  question?: string;
  fileName?: string;
}

interface Feature {
  icon: string;
  text: string;
}

interface ExtendedWindow extends Window {
  webkitSpeechSynthesis?: SpeechSynthesis;
}

export default defineComponent({
  name: 'CommunityAI',
  setup() {
    const ANSWER_TIMEOUT = 5000;
    const botID = "7483499782846152739";
    const wsUrl = "ws://118.178.172.251:8080/ws/chat";
    const baseURL = "http://118.178.172.251:8080";
    
    // Refs
    const hasSentInitialMessage = ref(false);
    const messageInput = ref('');
    const messages = ref<Message[]>([]);
    const showWelcome = ref(true);
    const isLoading = ref(false);
    const showTyping = ref(false);
    const isStreaming = ref(false);
    const isPaused = ref(false);
    const isProcessing = ref(true);
    const accumulatedMessage = ref('');
    const messagesContainer = ref<HTMLElement | null>(null);
    const copiedIndex = ref<number | null>(null);
    const speakingIndex = ref<number | null>(null);
    const isSpeechPaused = ref(false);
    const fileInput = ref<HTMLInputElement | null>(null);
    const uploadedFileName = ref('');
    const uploadedImageUrl = ref('');
    const showFullImagePreview = ref(false);
    const uploadStatus = ref<'uploading' | 'success' | 'error' | ''>('');
    const isUploading = ref(false);
    
    // WebSocket
    let socket: WebSocket | null = null;
    let lastMessageTime = 0;
    let loadingTimeout: number | null = null;
    
    // Speech Synthesis
    const speechSynthesis = window.speechSynthesis || (window as ExtendedWindow).webkitSpeechSynthesis;
    let speechUtterance: SpeechSynthesisUtterance | null = null;
    let pausedCharIndex = 0;
    
    // Features list
    const features = ref<Feature[]>([
      { icon: '🐤', text: '雏鸭护理' },
      { icon: '🥣', text: '饲料配方' },
      { icon: '🏠', text: '鸭舍搭建' },
      { icon: '💉', text: '疾病防疫' }
    ]);

    // 用户ID
    const userID = ref('');
    if (!localStorage.getItem('userID')) {
      userID.value = Math.floor(Math.random() * 1000000).toString();
      localStorage.setItem('userID', userID.value);
    } else {
      userID.value = localStorage.getItem('userID') || '';
    }

    const initWebSocket = () => {
      socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log("WebSocket连接已建立");
      };
      
      socket.onmessage = (event) => {
        if (isPaused.value) {
          accumulatedMessage.value += event.data;
          return;
        }
        
        const data = event.data;
        lastMessageTime = Date.now();
        hideLoadingAnimation();
        
        if (!data || data.trim() === "") {
          return;
        }
        
        // 尝试解析为JSON
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.message && jsonData.message.trim() !== "") {
            processCompleteMessage(data);
            return;
          }
        } catch (e) {
          console.log('Non-JSON message received, processing as streaming text');
        }
        
        // 处理流式文本
        if (data.trim() !== "") {
          processStreamingMessage(data);
        }
      };
      
      socket.onclose = (event) => {
        handleAnswerComplete();
        if (event.wasClean) {
          console.log(`连接关闭，代码=${event.code} 原因=${event.reason}`);
        } else {
          console.log('连接中断');
          setTimeout(initWebSocket, 5000);
        }
      };
      
      socket.onerror = (error) => {
        handleAnswerComplete();
        console.log(`WebSocket错误: ${error}`);
      };
    };

    const handleAnswerComplete = () => {
      hideLoadingAnimation();
      isStreaming.value = false;
      isProcessing.value = false;
      accumulatedMessage.value = '';
      console.log("机器人回答完成");
    };

    const processCompleteMessage = (message: string) => {
      hideLoadingAnimation();
      isStreaming.value = false;
      
      let suggestions: string[] = [];
      let content = message;
      
      const suggestionsMatch = message.match(/\{"suggestions":\[.*?\]\}$/);
      if (suggestionsMatch) {
        try {
          const jsonStr = suggestionsMatch[0];
          const jsonData = JSON.parse(jsonStr);
          suggestions = jsonData.suggestions || [];
          content = message.replace(/\{"suggestions":\[.*?\]\}$/, '').trim();
        } catch (e) {
          console.error('解析suggestions错误:', e);
        }
      }
      
      addBotMessage(content, false, suggestions);
    };

    const processStreamingMessage = (data: string) => {
      if (!isStreaming.value) {
        isStreaming.value = true;
        addBotMessage('', true);
      }
      
      const lastMessage = messages.value[messages.value.length - 1];
      if (lastMessage && lastMessage.type === 'bot' && lastMessage.isStreaming) {
        const suggestionsMatch = data.match(/\{"suggestions":\[.*?\]\}$/);
        if (suggestionsMatch) {
          try {
            const jsonData = JSON.parse(suggestionsMatch[0]);
            const newContent = data.replace(/\{"suggestions":\[.*?\]\}$/, '').trim();
            if (newContent) {
              lastMessage.content += newContent;
            }
            lastMessage.suggestions = jsonData.suggestions || [];
            isStreaming.value = false;
            scrollToBottom();
            return;
          } catch (e) {
            console.log('JSON解析失败，作为普通文本处理');
          }
        }
        
        lastMessage.content += data;
        scrollToBottom();
      }
    };

    const sendInitialMessage = () => {
      if (hasSentInitialMessage.value) return;
      hasSentInitialMessage.value = true;
      const data = {
        botID: botID,
        userID: userID.value,
        userMessage: "你好，请介绍一下你自己。"
      };
      
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
      } else {
        console.log('WebSocket未连接，尝试重新连接...');
        initWebSocket();
        setTimeout(() => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
          }
        }, 1000);
      }
    };

    const formatMessage = (text: string): string => {
      let formattedText = text
        .replace(/\n\n+/g, '</p><p>')
        .replace(/\n(?!\n)/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>')
        .replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)+/g, '<ol>$&</ol>')
        .replace(/^&gt;\s+(.+)$/gm, '<blockquote>$1</blockquote>');
      
      if (!formattedText.startsWith('<p>') && 
          !formattedText.startsWith('<ul>') && 
          !formattedText.startsWith('<ol>') && 
          !formattedText.startsWith('<pre>') && 
          !formattedText.startsWith('<blockquote>')) {
        formattedText = '<p style="margin:0px!important">' + formattedText + '</p>';
      }
      
      return formattedText;
    };

    const addUserMessage = (message: string) => {
      if (showWelcome.value) {
        showWelcome.value = false;
      }
      
      messages.value.push({
        type: 'user',
        content: message
      });
      
      scrollToBottom();
    };

    const addBotMessage = (message: string, isStreaming = false, suggestions: string[] = []) => {
      if (isStreaming) {
        const lastMessage = messages.value[messages.value.length - 1];
        if (lastMessage && lastMessage.type === 'bot' && lastMessage.isStreaming) {
          if (message) {
            lastMessage.content += message;
          }
          if (suggestions.length > 0) {
            lastMessage.suggestions = suggestions;
          }
          return;
        }
        
        messages.value.push({
          type: 'bot',
          content: message,
          isStreaming: true,
          suggestions: []
        });
      } else {
        messages.value.push({
          type: 'bot',
          content: message,
          suggestions: suggestions
        });
      }
      
      scrollToBottom();
    };

    const sendSuggestion = (suggestion: string) => {
      messageInput.value = suggestion;
      sendMessage();
    };

    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    };

    const showLoadingAnimation = () => {
      isLoading.value = true;
      
      loadingTimeout = window.setTimeout(() => {
        showTyping.value = true;
      }, 3000);
    };

    const hideLoadingAnimation = () => {
      isLoading.value = false;
      showTyping.value = false;
      
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
      }
    };

    const togglePause = () => {
      if(!isStreaming.value) return;
      if (!isPaused.value) {
        lastMessageTime = Date.now();
      }
      isPaused.value = !isPaused.value;
      
      if (isPaused.value) {
        if (speechSynthesis.speaking && speakingIndex.value !== null) {
          speechSynthesis.pause();
          isSpeechPaused.value = true;
        }
      } else {
        if (speechSynthesis.paused && speakingIndex.value !== null) {
          speechSynthesis.resume();
          isSpeechPaused.value = false;
        }
        
        if (accumulatedMessage.value) {
          processStreamingMessage(accumulatedMessage.value);
          accumulatedMessage.value = '';
        }
      }
    };

   // Fixed copy functionality for deployment
// Fixed copy functionality for deployment
// 修改后的复制功能
const copyToClipboard = (text: string, index: number | string) => {
  const cleanText = text.replace(/<[^>]*>?/gm, ''); // 移除HTML标签获取纯文本
  
  // 优先使用现代Clipboard API
  const tryModernClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cleanText);
      return true;
    } catch (error) {
      console.log('Modern Clipboard API 失败:', error);
      return false;
    }
  };

  // 传统方法兼容
  const tryFallbackClipboard = () => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = cleanText;
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';  // 移出可视区域代替透明
      document.body.appendChild(textarea);
      textarea.select();
      
      // 兼容移动端选择
      if (textarea.setSelectionRange) {
        const length = textarea.value.length;
        textarea.setSelectionRange(0, length);
      }
      
      const result = document.execCommand('copy');
      document.body.removeChild(textarea);
      return result;
    } catch (error) {
      console.log('传统复制方法失败:', error);
      return false;
    }
  };

  // 执行复制流程
  const executeCopy = async () => {
    if (navigator.clipboard) {
      const modernSuccess = await tryModernClipboard();
      if (modernSuccess) return true;
    }
    return tryFallbackClipboard();
  };

  // 处理复制结果
  executeCopy().then(success => {
    if (success) {
      copiedIndex.value = index;
      setTimeout(() => {
        copiedIndex.value = null;
      }, 2000);
    } else {
      // 终极回退方案：显示可复制的文本区域
      const fallbackTextarea = document.createElement('textarea');
      fallbackTextarea.value = cleanText;
      fallbackTextarea.style.position = 'fixed';
      fallbackTextarea.style.top = '10%';
      fallbackTextarea.style.left = '10%';
      fallbackTextarea.style.zIndex = '99999';
      document.body.appendChild(fallbackTextarea);
      
      alert('自动复制失败，请手动选择并复制文本框内容');
      fallbackTextarea.select();
    }
  }).catch(error => {
    console.error('复制流程异常:', error);
    alert('复制失败，请手动选择文本后按Ctrl+C');
  });
};

    const toggleSpeech = (message: Message, index: number) => {
      if (speakingIndex.value === index) {
        if (speechSynthesis.paused) {
          speechSynthesis.resume();
          isSpeechPaused.value = false;
        } else {
          speechSynthesis.pause();
          isSpeechPaused.value = true;
        }
        return;
      }
      
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      
      speakMessage(message.content, index);
    };

    const speakMessage = (text: string, index: number) => {
      speakingIndex.value = index;
      isSpeechPaused.value = false;
      
      speechUtterance = new SpeechSynthesisUtterance(text);
      
      const voices = speechSynthesis.getVoices();
      const chineseVoice = voices.find(voice => 
        voice.lang.includes('zh') || 
        voice.lang.includes('cmn') || 
        voice.lang.includes('zh-CN') || 
        voice.lang.includes('zh-TW')
      );
      
      if (chineseVoice) {
        speechUtterance.voice = chineseVoice;
      }
      
      speechUtterance.rate = 1;
      speechUtterance.pitch = 1;
      
      speechUtterance.onend = () => {
        if (speakingIndex.value === index) {
          speakingIndex.value = null;
        }
      };
      
      speechUtterance.onerror = (event) => {
        console.error('朗读错误:', event.error);
        speakingIndex.value = null;
      };
      
      speechSynthesis.speak(speechUtterance);
    };

    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };
    const handleFileUpload = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      if (!file.type.match('image.*')) {
        alert('请上传图片文件');
        return;
      }

      // Reset status
      uploadedFileName.value = file.name;
      uploadedImageUrl.value = '';
      uploadStatus.value = 'uploading';
      isUploading.value = true;

      try {
        // Create local preview URL
        uploadedImageUrl.value = URL.createObjectURL(file);
        uploadStatus.value = 'success';
        
        // Simulate successful upload without actually sending to backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error('Upload failed:', error);
        uploadStatus.value = 'error';
        uploadedImageUrl.value = '';
        setTimeout(() => {
          if (uploadStatus.value === 'error') {
            uploadStatus.value = '';
          }
        }, 3000);
      } finally {
        isUploading.value = false;
        if (fileInput.value) {
          fileInput.value.value = '';
        }
      }
    };
    const sendMessage = () => {
  const message = messageInput.value.trim();
  if (message === '' && !uploadedImageUrl.value) return;
  
  if(isPaused.value && accumulatedMessage.value){
    processStreamingMessage(accumulatedMessage.value);
    accumulatedMessage.value = '';
    isPaused.value = false;
    isStreaming.value = false;
  }
  
  // Add user message
  addUserMessage(message);
  
  // If there's an image, add to message and simulate analysis
  if (uploadedImageUrl.value) {
    messages.value[messages.value.length - 1].imageUrl = uploadedImageUrl.value;
    messages.value[messages.value.length - 1].fileName = uploadedFileName.value;
    
    // Clear input immediately
    messageInput.value = '';
    
    // Simulate image analysis response
    setTimeout(() => {
      const analysisResponse = `嘎嘎~老乡发来的图片我仔细看啦！从图片上能看出几个重要情况：\n\n1. **鸭群密度**：\n   看起来鸭舍有点拥挤呢！建议每平方米养3-4只成年鸭，太密容易打架生病哦~\n\n2. **健康状况**：\n   - 羽毛蓬松有光泽，说明营养不错\n   - 但有几只鸭子缩脖子站着（图片右侧），要特别注意是不是生病了\n\n3. **环境卫生**：\n   地面有点湿，建议：\n   - 每天清理鸭粪\n   - 铺层干稻草\n   - 保持通风\n\n4. **饮水情况**：\n   没看到水盆，提醒老乡：\n   - 一定要准备干净饮水\n   - 水盆高度要跟鸭背平齐\n\n老乡要特别注意观察：\n✓ 有没有拉稀的鸭子\n✓ 吃食量有没有减少\n✓ 有没有咳嗽打喷嚏的\n\n发现异常要马上告诉我哦！嘎嘎~需要教您怎么配消毒水或者常见病的用药方法吗？`;
      
      addBotMessage(analysisResponse, false);
      hideLoadingAnimation();
    }, 1500);
    
    // Reset upload status
    uploadedImageUrl.value = '';
    uploadedFileName.value = '';
    uploadStatus.value = '';
    return;
  }
  
  showLoadingAnimation();
  lastMessageTime = Date.now();
  
  const data = {
    botID: botID,
    userID: userID.value,
    userMessage: message
  };
  
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.log('WebSocket未连接，尝试重新连接...');
    initWebSocket();
    setTimeout(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
      } else {
        addBotMessage('抱歉，鸭鸭出了点问题，请稍后再试哦。');
        hideLoadingAnimation();
      }
    }, 1000);
  }
  
  messageInput.value = '';
};

    const checkAnswerTimeout = () => {
      if (isStreaming.value && !isPaused.value && Date.now() - lastMessageTime > ANSWER_TIMEOUT) {
        console.log("回答超时，自动结束");
        handleAnswerComplete();
      }
    };

    // 启动定时检查
    let timeoutCheckInterval: number;
    onMounted(() => {
      initWebSocket();
      sendInitialMessage();
      if (!speechSynthesis) {
        console.warn('当前浏览器不支持Web Speech API');
      } else {
        speechSynthesis.onvoiceschanged = () => {
          console.log('语音列表已加载');
        };
        
        if (speechSynthesis.getVoices().length === 0) {
          speechSynthesis.getVoices();
        }
      }
    });

    onBeforeUnmount(() => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      
      if (socket) {
        socket.close();
      }
      
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    });

    return {
      messageInput,
      messages,
      showWelcome,
      isLoading,
      showTyping,
      isStreaming,
      isPaused,
      features,
      messagesContainer,
      copiedIndex,
      speakingIndex,
      isSpeechPaused,
      fileInput,
      uploadedFileName,
      formatMessage,
      sendMessage,
      togglePause,
      copyToClipboard,
      toggleSpeech,
      sendSuggestion,
      sendInitialMessage,
      triggerFileInput,
      handleFileUpload,
      uploadedImageUrl,
      uploadStatus,
      showFullImagePreview
    };
  }
});
</script>

<style scoped>
.chat-ai-container {
  padding: 20px;
  height: 100%;
}

.chat-container {
  font-family: 'Arial', sans-serif;
  margin: 0 auto;
  background-color: #f5f5f5;
  line-height: 1.6;
  height: 100%;
  display: flex;
  border-radius: 10px 10px 0 0;
  flex-direction: column;
}

.chat-messages {
  height: 500px;
  overflow-y: auto;
  padding: 15px;
  background-color: white;
  flex-grow: 1;
}

.message-container {
  position: relative;
  margin-bottom: 30px;
}

.message-container.bot-message-container {
  display: flex;
  align-items: flex-start;
}

.message {
  padding: 12px 16px;
  border-radius: 8px;
  word-wrap: break-word;
  position: relative;
}

.message.user-message {
  background-color: #e3f2fd;
  margin-left: auto;
  border-bottom-right-radius: 2px;
  width: fit-content;
  height: fit-content;
  padding: 6px 10px;
  max-width: 85%;
}

.message.bot-message {
  background-color: #f8f9fa;
  border-bottom-left-radius: 2px;
  max-width: 90%;
  margin-left: 0;
  margin-right: auto;
}

.chat-input {
  display: flex;
  padding: 15px;
  border-top: 1px solid #eee;
  background-color: #f8f9fa;
  border-radius: 0 0 10px 10px;
  align-items: center;
}

.input-container {
  position: relative;
  flex: 1;
}

input[type="text"] {
  width: 100%;
  padding: 12px 0; 
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 16px;
}

.file-button {
  position: absolute;
  right: 10px;
  top: 15%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.filename-preview {
  position: absolute;
  bottom: -25px;
  left: 0;
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
}

.button-group {
  display: flex;
  margin-left: 10px;
  border-radius: 20px;
  background-color: #f0f0f0;
}

#send-button {
  background-color: #155b0d;
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

#send-button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
  opacity: 0.7;
}

#send-button:hover {
  background-color: #124b0c;
}

#pause-button {
  background-color: transparent;
  border: none;
  color: #ff5454;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  border-left: none;
}

#pause-button.active {
  background-color: transparent;
  color: #0095ff;
}

.typing-indicator {
  color: #888;
  font-style: italic;
  padding: 8px 16px;
  display: flex;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
  align-items: center;
}

.typing-dots {
  display: inline-flex;
  margin-right: 8px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background-color: #888;
  border-radius: 50%;
  margin: 0 2px;
  opacity: 0.3;
}

.loading-container {
  display: flex;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
  width: fit-content;
}

.loading-animation {
  display: inline-flex;
  align-items: center;
}

.loading-dot {
  width: 10px;
  height: 10px;
  background-color: #ffd700;
  border-radius: 50%;
  margin: 0 3px;
  animation: bounce 1.4s infinite ease-in-out;
}

.loading-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { 
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
}

.bot-message p {
  margin: 8px 0;
}

.bot-message strong {
  font-weight: bold;
  color: #333;
}

.bot-message em {
  font-style: italic;
}

.bot-message code {
  font-family: monospace;
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.9em;
}

.bot-message pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
  margin: 10px 0;
}

.bot-message ul, .bot-message ol {
  padding-left: 20px;
  margin: 8px 0;
}

.bot-message li {
  margin-bottom: 4px;
}

.bot-message blockquote {
  border-left: 3px solid #ddd;
  padding-left: 12px;
  margin: 10px 0;
  color: #666;
}

.action-buttons {
  position: absolute;
  display: flex;
  gap: 5px;
  transition: opacity 0.2s;
  margin-bottom: 10px;
}

.copy-btn, .speak-btn {
  position: relative;
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-btn:hover, .speak-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.copy-btn.copied {
  color: white;
}

.speak-btn.speaking {
  color: white;
}

.speak-btn.continued {
  background-color: #4CAF50;
  color: white;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 100;
  pointer-events: none;
  margin-bottom: 5px;
}

.tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

.copy-btn:hover .tooltip,
.speak-btn:hover .tooltip,
.file-button:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

.message-container:not(.bot-message-container) .action-buttons {
  right: 20px;
  bottom: -35px;
}

.message-container.bot-message-container .action-buttons {
  left: 50px !important;
  bottom: -35px !important;
}

.message-container:hover .action-buttons {
  opacity: 1;
}

.bot-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.message-content {
  flex: 1;
  height: fit-content;
}

.welcome-container {
  text-align: center;
  padding: 30px 20px;
}

.welcome-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.welcome-message {
  font-size: 16px;
  color: #555;
  margin-bottom: 30px;
  line-height: 1.6;
}

.welcome-features {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
}

.feature-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  width: 120px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.feature-icon {
  font-size: 24px;
  margin-bottom: 10px;
  color: #ffd700;
}

.feature-text {
  font-size: 14px;
  color: #666;
}

.copy-btn img, .speak-btn img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.sound-wave {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.sound-wave span {
  display: inline-block;
  width: 2px;
  height: 8px;
  background-color: #2d84c2;
  margin: 0 1px;
  animation: sound-wave 1.5s infinite ease-in-out;
}

.sound-wave span:nth-child(1) {
  animation-delay: 0.1s;
}

.sound-wave span:nth-child(2) {
  animation-delay: 0.3s;
}

.sound-wave span:nth-child(3) {
  animation-delay: 0.5s;
}

@keyframes sound-wave {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(2);
  }
}

.suggestions-container {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  width: calc(40%);
}

.suggestions-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion-item {
  background-color: #e3f2fd;
  border: none;
  border-radius: 15px;
  padding: 6px 12px;
  font-size: 13px;
  color: #155b0d;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
  width: 100%;
}

.suggestion-item:hover {
  background-color: #bbdefb;
}
.upload-file{
  width: 200px;
  height: 40px;
  display: flex;
  margin-left: 50px;
  border-radius: 15px;
  justify-content: space-between;
  background-color: #e2e2e2;
  padding: 0 5px;
}
.uploaded-file{
  width: 200px;
  height: 40px;
  display: flex;
  border-radius: 15px;
  margin-left: auto;
  justify-content: space-between;
  background-color: #e2e2e2;
  padding: 0 5px;
  margin-bottom: 10px;
}
.uploaded-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: block;
}
.upload-status {
  bottom: -25px;
  left: 0;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.upload-status .uploading {
  color: #666;
}

.upload-status .success {
  color: #155b0d;
}

.upload-status .error {
  color: #ff3333;
}

.uploading-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(0,0,0,0.2);
  border-radius: 50%;
  border-top-color: #666;
  animation: spin 1s ease-in-out infinite;
  margin-right: 5px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.image-preview-thumbnail {
  bottom: -60px;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  /* overflow: hidden; */
  cursor: pointer;
}

.image-preview-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-preview-thumbnail .file-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.5);
  color: white;
  font-size: 10px;
  padding: 2px 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.full-image-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
}

.full-image-preview .preview-content {
  max-width: 90%;
  max-height: 90%;
  position: relative;
}

.full-image-preview .preview-content img {
  max-width: 100%;
  max-height: calc(100vh - 100px);
  object-fit: contain;
}

.full-image-preview .file-info {
  color: white;
  text-align: center;
  margin-top: 10px;
  padding: 5px 10px;
  background: rgba(0,0,0,0.5);
  border-radius: 4px;
}
</style>