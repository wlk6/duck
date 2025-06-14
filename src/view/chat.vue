<template>
  <main style="width: 100%;">
    <div class="container">
      <div class="row gx-0">
        <!-- 左侧聊天列表 -->
        <div class="col-lg-4 col-xxl-3" id="chatTabs" role="tablist">
          <div class="card card-body border-end-0 border-bottom-0 rounded-bottom-0" style="background-color: #fff!important">
            <div class="d-flex justify-content-between align-items-center">
              <h1 class="h5 mb-0">Active chats <span class="badge bg-success bg-opacity-10 text-success">{{ chatList.length }}</span></h1>
            </div>
          </div>

          <nav class="navbar navbar-light navbar-expand-lg mx-0">
            
            <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar">
              <div class="offcanvas-body p-0">
                <div class="card card-chat-list rounded-end-lg-0 card-body border-end-lg-0 rounded-top-0 ">
                  <form class="position-relative">
                  <input class="form-control py-2" type="search" placeholder="Search for chats" aria-label="Search">
                  <button class="btn bg-transparent text-secondary px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="submit">
                    <i class="bi bi-search fs-5"></i>
                  </button>
                </form>
                <div class="mt-4 h-100">
                  <div class="chat-tab-list custom-scrollbar os-host os-theme-dark os-host-overflow os-host-overflow-y os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-transition friends">
                                      <ul class="nav flex-column nav-pills nav-pills-soft ">
                    <li v-for="user in chatList" :key="user.id" data-bs-dismiss="offcanvas">
                      <a href="javascript:void(0)" 
                         class="nav-link text-start parder" 
                         :class="{ active: currentChat === user.id }"
                         @click="switchChat(user.id)">
                        <div class="d-flex">
                          <div class="flex-shrink-0 avatar me-2">
                            <img class="avatar-img rounded-circle" :src="user.avatar" alt="">
                          </div>
                          <div class="flex-grow-1 d-block">
                            <h6 class="mb-0 mt-1">{{ user.name }}
                              <span v-if="user.unread > 0" class="badge bg-danger">{{ user.unread }}</span>
                            </h6>
                            <div class="small text-secondary notice">{{ getLastMessage(user.id) }}</div>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                  </div>
                </div>

                </div>
              </div>
            </div>
          </nav>
        </div>

        <!-- 右侧聊天框 -->
        <div class="col-lg-8 col-xxl-9">
          <div class="card card-chat rounded-start-lg-0 border-start-lg-0">
            <div class="card-body h-100">
              <div class="d-sm-flex justify-content-between align-items-center marging" >
                  <div class="d-flex mb-2 mb-sm-0">
                    <div class="flex-shrink-0 avatar me-2">
                      <img class="avatar-img rounded-circle" :src="currentUser?.avatar" alt="">
                    </div>
                    <div class="d-block flex-grow-1">
                      <h6 class="mb-0 mt-1">{{ currentUser?.name }}</h6>
                      <div class="small text-secondary"><i class="fa-solid fa-circle text-success me-1"></i>Online</div>
                    </div>
                  </div>
                  <div class="d-flex align-items-center">
                    <!-- Call button -->
                    <a href="#!" class="icon-md rounded-circle btn btn-primary-soft me-2 px-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Audio call"><i class="bi bi-telephone-fill"></i></a>
                    <a href="#!" class="icon-md rounded-circle btn btn-primary-soft me-2 px-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Video call"><i class="bi bi-camera-video-fill"></i></a>
                    <!-- Card action START -->
                    <div class="dropdown">
                      <a class="icon-md rounded-circle btn btn-primary-soft me-2 px-2" href="#" id="chatcoversationDropdown" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"><i class="bi bi-three-dots-vertical"></i></a>               
                      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="chatcoversationDropdown">
                        <li><a class="dropdown-item" href="#"><i class="bi bi-check-lg me-2 fw-icon"></i>Mark as read</a></li>
                        <li><a class="dropdown-item" href="#"><i class="bi bi-mic-mute me-2 fw-icon"></i>Mute conversation</a></li>
                        <li><a class="dropdown-item" href="#"><i class="bi bi-person-check me-2 fw-icon"></i>View profile</a></li>
                        <li><a class="dropdown-item" href="#"><i class="bi bi-trash me-2 fw-icon"></i>Delete chat</a></li>
                        <li class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#"><i class="bi bi-archive me-2 fw-icon"></i>Archive chat</a></li>
                      </ul>
                    </div>
                    <!-- Card action END -->
                  </div>
                </div>
                <!-- Top avatar and status END -->
                <hr>
              <div class="chat-conversation-content custom-scrollbar">
                <!-- 消息列表 -->
                <div v-for="(msg, index) in messages[currentChat]" :key="index">
                  <!-- 对方消息 -->
                  <div v-if="!msg.isSelf" class="d-flex mb-1">
                    <div class="flex-shrink-0 avatar avatar-xs me-2">
                      <img class="avatar-img rounded-circle" src="@/assets/images/my-notion-face-transparent.png" alt="">
                    </div>
                    <div class="flex-grow-1">
                      <div class="w-100">
                        <div class="d-flex flex-column align-items-start">
                          <div class="bg-light text-secondary p-2 px-3 rounded-2" style="text-align: left;max-width: 60%;">{{ msg.content }}</div>
                          <div class="small my-2">{{ msg.timestamp }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 自己消息 -->
                  <div v-else class="d-flex justify-content-end text-end mb-1">
                    <div class="w-100">
                      <div class="d-flex flex-column align-items-end">
                        <div class="bg-primary text-white p-2 px-3 rounded-2" style="text-align: left;max-width: 60%;">{{ msg.content }}</div>
                        <div class="d-flex my-2">
                          <div class="small text-secondary">{{ msg.timestamp }}</div>
                          <div class="small ms-2"><i class="fa-solid fa-check-double text-info"></i></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 输入框 -->
            <div class="card-footer">
              <div class="d-sm-flex align-items-end">
                <div class="position-relative" style="flex-grow: 1;">  
                  <div v-show="showEmojiPicker" class="emoji-picker">
        <div class="emoji-grid">
          <button
            v-for="(emoji, index) in emojis"
            :key="index"
            @click="insertEmoji(emoji)"
            class="emoji-button"
          >
            {{ emoji }}
          </button>
        </div>
      </div>              
                <input 
                ref="messageInputRef"
                v-model="messageInput" 
                          @keyup.enter="sendMessage"
                          class="form-control mb-sm-0 mb-3" 
                          placeholder="Type a message" 
                rows="1">
                </div>

                <button @click.stop="toggleEmojiPicker" class="btn btn-sm btn-danger-soft ms-sm-2"><i class="fa-solid fa-face-smile fs-6"></i></button>
                <button class="btn btn-sm btn-secondary-soft ms-2"><i class="fa-solid fa-paperclip fs-6"></i></button>
                <button @click="sendMessage" 
                        class="btn btn-sm btn-primary ms-2">
                  <i class="fa-solid fa-paper-plane fs-6"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import '../js/functions.js'
import { ref, onMounted, onBeforeUnmount, watch, nextTick ,computed} from 'vue'
import { useChatStore } from '../stores/chat.js'
import { useRoute } from 'vue-router'
const route = useRoute()
// 表情
const showEmojiPicker = ref(false)
const messageInputRef = ref(null)
const emojis = ref([
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😇', '😉',
  '😊', '🙂', '🙃', '😋', '😌', '😍', '🥰', '😘', '😗', '😙',
  '😚', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '😐',
  '😑', '😶', '😏', '😒', '🙄', '😬', '🤤', '😪', '😴', '😷',
  '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯'
])
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const insertEmoji = (emoji) => {
  const input = messageInputRef.value
  const start = input.selectionStart
  const end = input.selectionEnd
  
  messageInput.value = 
    messageInput.value.slice(0, start) + 
    emoji + 
    messageInput.value.slice(end)
  
  // 更新光标位置
  nextTick(() => {
    input.setSelectionRange(start + emoji.length, start + emoji.length)
    input.focus()
    showEmojiPicker.value = false
  })
}

// 添加点击外部关闭逻辑
const handleClickOutside = (event) => {
  if (!event.target.closest('.emoji-picker') && 
      !event.target.closest('.btn-danger-soft')) {
    showEmojiPicker.value = false
  }
}
// 表情
const chatStore = useChatStore()
const ws = ref(null)
const messageInput = ref('')
const currentChat = ref('4')
const chatList = ref([
  { id: '4', name: '张三', unread: 0 ,avatar: '/img/my-notion-face-transparent.png'},
  { id: '8', name: '李四', unread: 0 ,avatar: '/img/my-notion-face-transparent.png'},
  { id: '3', name: '王五', unread: 0 ,avatar: '/img/my-notion-face-transparent.png'},
  { id: '5', name: '赵六', unread: 0 ,avatar: '/img/my-notion-face-transparent.png'},
  { id: '7', name: '孙七', unread: 0 ,avatar: '/img/my-notion-face-transparent.png'},
])
const currentUser = computed(() => 
  chatList.value.find(user => user.id === currentChat.value)
)

const totalUnread = computed(() => {
  const count = chatList.value.reduce((sum, user) => sum + user.unread, 0)
  chatStore.updateUnread(count)
  return count
})
const messages = ref({
  '4': [],
  '8': [],
  '3': [],
  '4': [],
  '7': [],
})
const initWebSocket = () => {
  const token = localStorage.getItem('authToken')
  ws.value = new WebSocket(`ws://118.178.172.251:8080/chat?token=${token}`)

  ws.value.onmessage = (event) => {
    const message = JSON.parse(event.data)
    handleReceivedMessage(message)
  }

  ws.value.onerror = (error) => {
    console.error('WebSocket error:', error)
    setTimeout(() => initWebSocket(), 3000)
  }
}
const handleReceivedMessage = (message) => {
  const sender = message.sender
  if (!messages.value[sender]) {
    messages.value[sender] = []
  }
  messages.value[sender].push({
    content: message.content,
    isSelf: false,
    timestamp: new Date().toLocaleTimeString()
  })

  if (sender !== currentChat.value) {
    const user = chatList.value.find(c => c.id === sender)
    if (user){ 
      user.unread++;
  chatStore.updateUnread(totalUnread.value);

    }
  }
}
const sendMessage = () => {
  if (!messageInput.value.trim()) return
  if (!messages.value[currentChat.value]) {
    messages.value[currentChat.value] = []
  }
  const message = {
    type: "message",
    content: messageInput.value,
    toReceiver: currentChat.value
  }

  ws.value.send(JSON.stringify(message))

  messages.value[currentChat.value].push({
    content: messageInput.value,
    isSelf: true,
    timestamp: new Date().toLocaleTimeString()
  })

  messageInput.value = ''
}

// 切换聊天对象
const switchChat = (userId) => {
  currentChat.value = userId
  if (!messages.value[userId]) {
    messages.value[userId] = []
  }
  const user = chatList.value.find(c => c.id === userId)
  if (user) {
    user.unread = 0;
  chatStore.updateUnread(totalUnread.value);

  }
}

// 获取最后一条消息
const getLastMessage = (userId) => {
  const msgList = messages.value[userId]||[]
  return msgList.length > 0 ? msgList[msgList.length - 1].content : ''
}

// 自动滚动到底部
watch(messages, () => {
  nextTick(() => {
    const container = document.querySelector('.chat-conversation-content')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}, { deep: true })
const addNewChat = (userId, username, avatar) => {
  // 检查是否已存在
  const existingChatIndex = chatList.value.findIndex(chat => chat.id === userId)
  
  if (existingChatIndex === -1) {
    // 如果不存在，添加新聊天
    chatList.value.unshift({
      id: userId,
      name: username,
      unread: 0,
      avatar: avatar || '/public/img/my-notion-face-transparent.png'
    })
    
    if (!messages.value[userId]) {
      messages.value[userId] = []
    }
  } else {
    // 如果已存在
    chatList.value[existingChatIndex] = {
      ...chatList.value[existingChatIndex],
      name: username,
      avatar: avatar || '/public/img/my-notion-face-transparent.png'
    }
  }
  
  // 切换到该聊天
  currentChat.value = userId
}
// 生命周期钩子
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  const saved = localStorage.getItem('chatHistory')//本地实现聊天记录存储，后续有了后端功能再修改（此时这行代码删掉）
  if(saved) messages.value = JSON.parse(saved)//本地实现聊天记录存储，后续有了后端功能再修改（此时这行代码删掉）
  initWebSocket()
  if (route.query.userId) {
    const { userId, username, avatar } = route.query
    addNewChat(userId, username, avatar)
  }
})
watch(messages, (newVal) => {//本地实现聊天记录存储，后续有了后端功能再修改（此时这行代码删掉）
  localStorage.setItem('chatHistory', JSON.stringify(newVal))//本地实现聊天记录存储，后续有了后端功能再修改（此时这行代码删掉）
}, { deep: true })//本地实现聊天记录存储，后续有了后端功能再修改（此时这行代码删掉）

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)

  if (ws.value) {
    ws.value.close()
  }
})
</script>
<style scoped>
@import url('../assets/css/choices.min.css');
@import url('../assets/css/style.css');
@import '../assets/css/libs.min.css';
@import '../assets/css/remain.css';
@import '../assets/css/all.min.css';
@import '/node_modules/overlayscrollbars/styles/overlayscrollbars.min.css';
@import url('/node_modules/bootstrap-icons/font/bootstrap-icons.css');

.bg-light {
  --bs-bg-opacity: 1;
  background-color: #eef0f2 !important;
}

/* 滚动条 */
.chat-conversation-content {
  height: calc(78.5vh - 195px);
  overflow-y: overlay;
  scrollbar-width: none;
}
.friends {
  height: calc(78.5vh - 200px);
  overflow-y: overlay;
  scrollbar-width: none;
}
.chat-conversation-content:hover,
.friends:hover {
  scrollbar-width: thin;
}

.chat-conversation-content::-webkit-scrollbar,
.friends::-webkit-scrollbar {
  width: 6px;
  background: transparent;
}

.chat-conversation-content::-webkit-scrollbar-thumb,
.friends::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
}

.chat-conversation-content:hover::-webkit-scrollbar-thumb,
.friends:hover::-webkit-scrollbar-thumb {
  background: rgba(204, 204, 204, 0.7);
}

@supports (scrollbar-width: thin) {
  .chat-conversation-content,
  .friends {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }

  .chat-conversation-content:hover,
  .friends:hover {
    scrollbar-color: rgba(204, 204, 204, 0.7) transparent; /* 悬停时滑块颜色加深 */
  }
}
.parder{
  width: 220px!important;
}
.card-chat-list {
  display: flex;
  flex-direction: column;
  height: 100%;

}

.card-chat {
  display: flex;
  flex-direction: column;
  height: 96%;
}

.card-body.h-100 {
  flex: 1;
  min-height: 0;
}
/* 省略 */
.notice {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 表情 */
.emoji-picker {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 5px;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
}

.emoji-button {
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.2s;
}

.emoji-button:hover {
  transform: scale(1.2);
  background: #f0f0f0;
  border-radius: 4px;
}
</style>