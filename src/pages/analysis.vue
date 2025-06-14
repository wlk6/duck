<template>
  <div class="breeding-analysis-container">
    <div class="card main-card">
      <h1 class="title">育种分析系统</h1>
      
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
          <button @click="analyzeBreeding" class="submit-button" :disabled="loading">
            {{ loading ? '分析中...' : '育种分析' }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="card results-card" v-if="hasResults">
      <h2 class="subtitle">育种分析结果</h2>
      
      <div class="results-container">
        <!-- 指标评估部分 -->
        <div class="metrics-summary">
          <div class="metric-item" v-for="(metric, index) in metricsData" :key="index">
            <div class="metric-circle" :class="getStatusClass(metric.value, metric.normalMin, metric.normalMax)">
              <span class="metric-value">{{ metric.value }}</span>
            </div>
            <div class="metric-info">
              <h4>{{ metric.name }}</h4>
              <p>理想值: {{ metric.normalMin }}-{{ metric.normalMax }}{{ metric.unit }}</p>
              <div class="progress-container">
                <div class="range-marker low-marker" :style="{ left: getMarkerPosition(metric.lowMin, metric.highMax, metric.lowMax) }"></div>
                <div class="range-marker normal-marker-start" :style="{ left: getMarkerPosition(metric.lowMin, metric.highMax, metric.normalMin) }"></div>
                <div class="range-marker normal-marker-end" :style="{ left: getMarkerPosition(metric.lowMin, metric.highMax, metric.normalMax) }"></div>
                <div class="range-marker high-marker" :style="{ left: getMarkerPosition(metric.lowMin, metric.highMax, metric.highMin) }"></div>
                
                <div class="progress-bar">
                  <div class="progress-track"></div>
                  <div class="progress-value" :style="{ left: getProgressPosition(metric.value, metric.lowMin, metric.highMax) }"></div>
                </div>
                
                <div class="range-labels">
                  <span class="range-label low">低于正常</span>
                  <span class="range-label normal">正常范围</span>
                  <span class="range-label high">高于正常</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 育种建议部分 -->
        <div class="recommendations-section">
          <h3 class="section-title">育种建议</h3>
          
          <div class="recommendations-container">
            <div class="recommendation-card" v-for="(rec, index) in recommendations" :key="index">
              <div class="recommendation-header">
                <div class="check-icon">
                  <i class="el-icon-check"></i>
                </div>
                <h4>建议 {{ index + 1 }}：【{{ rec.type }}】</h4>
              </div>
              <div class="recommendation-content">
                <p v-html="formatText(rec.content)"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="notification" v-if="notification.show" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BreedingAnalysis',
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
      recommendations: [],
      metricsData: [],
      standardRanges: {
        weight: { lowMin: 0, lowMax: 100, normalMin: 100, normalMax: 500, highMin: 500, highMax: 648, unit: '克' },
        bodyLength: { lowMin: 0, lowMax: 10, normalMin: 10, normalMax: 14, highMin: 14, highMax: 14.5, unit: '厘米' },
        neckLength: { lowMin: 0, lowMax: 30, normalMin: 30, normalMax: 45, highMin: 45, highMax: 47.5, unit: '厘米' },
        semiDiveLength: { lowMin: 0, lowMax: 15, normalMin: 15, normalMax: 20, highMin: 20, highMax: 20.5, unit: '厘米' },
        keelLength: { lowMin: 0, lowMax: 60, normalMin: 60, normalMax: 70, highMin: 70, highMax: 71.5, unit: '毫米' },
        chestWidth: { lowMin: 0, lowMax: 60, normalMin: 60, normalMax: 70, highMin: 70, highMax: 71.1, unit: '毫米' },
        chestDepth: { lowMin: 0, lowMax: 65, normalMin: 65, normalMax: 75, highMin: 75, highMax: 78, unit: '毫米' },
        tibiaLength: { lowMin: 0, lowMax: 75, normalMin: 75, normalMax: 85, highMin: 85, highMax: 86.3, unit: '毫米' }
      },
      notification: {
        show: false,
        message: '',
        type: 'success'
      }
    }
  },
  computed: {
    hasResults() {
      return this.results !== null && this.recommendations.length > 0;
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
    
    async analyzeBreeding() {
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
        const response = await fetch('http://118.178.172.251:8080/analysis/Breeding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': `${token}`
          },
          body: JSON.stringify(this.formData)
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
          this.results = result;
          this.parseResults(result.data);
          this.generateMetricsData();
          this.showNotification('分析成功', 'success');
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
    
    parseResults(data) {
      // 解析返回的数据字符串
      const recommendations = [];
      const lines = data.split('\n\n');
      
      for (const line of lines) {
        if (line.includes('建议')) {
          const cleanLine = line.trim();
          
          // 提取建议类型和内容
          const typeMatch = cleanLine.match(/【(.*?)】/);
          const type = typeMatch ? typeMatch[1] : '一般建议';
          
          // 移除前缀，保留主要内容
          const content = cleanLine.replace(/✓\s*建议\d+:\s*【.*?】\s*/, '');
          
          recommendations.push({
            type,
            content
          });
        }
      }
      
      this.recommendations = recommendations;
    },
    
    generateMetricsData() {
      // 根据输入数据和标准范围生成指标数据
      this.metricsData = this.formFields.map(field => {
        const value = this.formData[field.name];
        const range = this.standardRanges[field.name];
        
        return {
          name: field.label,
          value: value.toFixed(1),
          ...range
        };
      });
    },
    
    getStatusClass(value, normalMin, normalMax) {
      const val = parseFloat(value);
      if (val < normalMin) {
        return 'status-low';
      } else if (val > normalMax) {
        return 'status-high';
      } else {
        return 'status-normal';
      }
    },
    
    getMarkerPosition(min, max, value) {
      const percentage = ((value - min) / (max - min)) * 100;
      return `${percentage}%`;
    },
    
    getProgressPosition(value, min, max) {
      const val = parseFloat(value);
      const percentage = ((val - min) / (max - min)) * 100;
      return `${Math.min(Math.max(percentage, 0), 100)}%`;
    },
    
    formatText(text) {
      // 将文本中的换行符转换为HTML换行
      return text.replace(/\\n/g, '<br>');
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
.breeding-analysis-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #333;
}

.card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-bottom: 30px;
}

.main-card {
  border-top: 5px solid #2e7d32;
}

.title {
  color: #2e7d32;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 1px;
}

.subtitle {
  color: #2e7d32;
  margin-bottom: 24px;
  font-size: 22px;
  font-weight: 500;
}

.section-title {
  color: #2e7d32;
  margin: 30px 0 20px;
  font-size: 20px;
  font-weight: 500;
  border-left: 4px solid #2e7d32;
  padding-left: 10px;
}

.form-container {
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
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
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
  background-color: #f9f9f9;
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.submit-button {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(46, 125, 50, 0.2);
}

.submit-button:hover {
  background-color: #1b5e20;
  box-shadow: 0 4px 15px rgba(46, 125, 50, 0.3);
  transform: translateY(-1px);
}

.submit-button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.results-container {
  margin-top: 20px;
}

.metrics-summary {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.metric-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s;
}

.metric-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
}

.metric-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.status-normal {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
}

.status-low {
  background: linear-gradient(135deg, #FFC107 0%, #FFE082 100%);
}

.status-high {
  background: linear-gradient(135deg, #FF9800 0%, #FFCC80 100%);
}

.metric-value {
  color: white;
  font-size: 22px;
  font-weight: 600;
}

.metric-info {
  flex: 1;
}

.metric-info h4 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #333;
}

.metric-info p {
  margin: 0 0 12px;
  font-size: 14px;
  color: #666;
}

.progress-container {
  position: relative;
  margin-top: 15px;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  position: relative;
  margin: 15px 0;
}

.progress-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
  background-color: #e0e0e0;
}

.progress-value {
  position: absolute;
  top: -6px;
  width: 20px;
  height: 20px;
  background-color: #2e7d32;
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.range-marker {
  position: absolute;
  top: -5px;
  width: 2px;
  height: 18px;
  background-color: #999;
  transform: translateX(-50%);
  z-index: 1;
}

.low-marker {
  background-color: #FFC107;
}

.normal-marker-start, .normal-marker-end {
  background-color: #4CAF50;
}

.high-marker {
  background-color: #FF9800;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.range-label.low {
  color: #FFC107;
}

.range-label.normal {
  color: #4CAF50;
}

.range-label.high {
  color: #FF9800;
}

.recommendations-section {
  margin-top: 40px;
}

.recommendations-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recommendation-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.recommendation-header {
  background-color: #f0f7f0;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.check-icon {
  width: 30px;
  height: 30px;
  background-color: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  font-size: 18px;
}

.recommendation-header h4 {
  margin: 0;
  font-size: 16px;
  color: #2e7d32;
  font-weight: 500;
}

.recommendation-content {
  padding: 20px;
}

.recommendation-content p {
  margin: 0;
  line-height: 1.7;
  color: #555;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 6px;
  color: white;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.notification.success {
  background-color: #2e7d32;
}

.notification.error {
  background-color: #d32f2f;
}

@media (max-width: 768px) {
  .card {
    padding: 20px;
  }
  
  .metric-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .metric-circle {
    margin-bottom: 15px;
    margin-right: 0;
  }
  
  .metric-info {
    width: 100%;
  }
}
</style>