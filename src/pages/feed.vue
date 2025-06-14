<template>
  <div class="feed-analysis-container">
    <div class="card main-card">
      <h2 class="title">饲料配比分析系统</h2>
      
      <div class="form-container">
        <div class="form-grid">
          <div class="form-group" v-for="(field, index) in formFields" :key="index">
            <label :for="field.name">{{ field.label }}</label>
            <input 
              type="number" 
              :id="field.name" 
              v-model.number="formData[field.name]" 
              step="0.01"
              class="form-input"
              :placeholder="`请输入${field.label}`"
            />
          </div>
        </div>
        
        <div class="button-container">
          <button @click="calculateFeedRatio" class="submit-button" :disabled="loading">
            {{ loading ? '分析中...' : '饲料配比分析' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 分析结果展示 -->
    <div v-if="hasResults" class="results-container">
      <!-- 使用报告组件并添加key以确保组件重新渲染 -->
      <feed-analysis-report 
        :reportData="results" 
        :key="resultsKey">
      </feed-analysis-report>
    </div>
    
    <div class="notification" v-if="notification.show" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
// 使用完整引入方式
import * as echarts from 'echarts';
import FeedAnalysisReport from './FeedAnalysisReport.vue';

export default {
  name: 'FeedRatioAnalysis',
  components: {
    FeedAnalysisReport
  },
  data() {
    return {
      formData: {
        weight: null,
        bodyLength: null,
        neckLength: null,
        semiDiveLength: null,
        keelLength: null,
        chestWidth: null,
        chestDepth: null,
        tibiaLength: null
      },
      formFields: [
        { name: 'weight', label: '体重（单位：kg）' },
        { name: 'bodyLength', label: '体斜长（单位：cm）' },
        { name: 'neckLength', label: '颈长（单位：cm）' },
        { name: 'semiDiveLength', label: '半潜水（单位：cm）' },
        { name: 'keelLength', label: '龙骨长（单位：mm）' },
        { name: 'chestWidth', label: '胸宽（单位：mm）' },
        { name: 'chestDepth', label: '胸深（单位：mm）' },
        { name: 'tibiaLength', label: '胫长（单位：mm）' }
      ],
      loading: false,
      results: null,
      resultsKey: 0, // 添加一个key来强制重新渲染组件
      notification: {
        show: false,
        message: '',
        type: 'success'
      }
    }
  },
  computed: {
    hasResults() {
      return this.results !== null;
    }
  },
  methods: {
    validateForm() {
      for (const field of this.formFields) {
        if (this.formData[field.name] === null || this.formData[field.name] === '') {
          this.showNotification(`请输入${field.label}`, 'error');
          return false;
        }
      }
      return true;
    },
    
    async calculateFeedRatio() {
      if (!this.validateForm()) return;
      
      this.loading = true;
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.showNotification('身份验证失败，请重新登录', 'error');
        this.loading = false;
        return;
      }
      
      try {
        // 替换为实际的API端点
        const response = await fetch('http://118.178.172.251:8080/analysis/FeedRatio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': `${token}`
          },
          body: JSON.stringify(this.formData)
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
          // 更新结果并增加key值以强制重新渲染
          this.results = result;
          this.resultsKey++; // 增加key值
          this.showNotification('分析成功', 'success');
          
          // 滚动到结果区域
          this.$nextTick(() => {
            const resultsElement = document.querySelector('.results-container');
            if (resultsElement) {
              resultsElement.scrollIntoView({ behavior: 'smooth' });
            }
          });
        } else {
          this.showNotification(result.message || '分析失败', 'error');
        }
      } catch (error) {
        console.error('API请求失败:', error);
        this.showNotification('网络请求失败，请稍后重试', 'error');
      } finally {
        this.loading = false;
      }
    },
    
    showNotification(message, type = 'success') {
      this.notification = {
        show: true,
        message,
        type
      };
      
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    }
  }
}
</script>

<style scoped>
.feed-analysis-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.main-card {
  border-top: 5px solid #2e7d32;
}
.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.title {
  color: #2e7d32;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 1px;
}

.form-container {
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #4b4b4b;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #388E3C;
}

.submit-button:disabled {
  background-color: #A5D6A7;
  cursor: not-allowed;
}

.results-container {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px dashed #ddd;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 4px;
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: opacity 0.3s;
}

.notification.success {
  background-color: #4CAF50;
}

.notification.error {
  background-color: #F44336;
}
</style>