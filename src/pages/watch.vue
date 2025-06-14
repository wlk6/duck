<template>
  <div class="duck-monitoring-system">
    <!-- 头部 -->
    <header class="header">
      <!-- 添加返回按钮 -->
      <button class="back-button" @click="goBack">
        <i class="icon-back"></i>
        返回
      </button>
      <div class="logo">
        <div class="logo-icon">通</div>
        <h1>通禽达理 - 监控系统</h1>
      </div>
      <div class="date-time">
        <i class="icon-clock"/>
        {{ currentDateTime }}
      </div>
    </header>

    <div class="container">
      <!-- 主监控区域 -->
      <section class="main-section">
        <div class="section-header">
          <h2>主监控区域</h2>
          <div class="action-buttons">
            <button class="btn btn-monitor" @click="startMainMonitoring">
              <span v-if="isScanning" class="loading-spinner"></span>
              <span v-else>实时监测</span>
            </button>
            <button class="btn btn-fullscreen" @click="toggleMainVideoFullscreen">
              <i class="icon-maximize"></i>
              全屏
            </button>
          </div>
        </div>
        
        <div class="monitor-container">
          <div class="video-display" ref="videoContainer">
            <!-- 标准视频显示 -->
            <video 
              v-if="!showDetectionImage"
              ref="mainVideo"
              class="background-video" 
              autoplay 
              loop 
              muted 
              playsinline
              @click="selectZone"
            >
              <source src="@/assets/images/duck2.mp4" type="video/mp4">
            </video>
            
            <!-- 检测图片展示 -->
            <img 
              v-if="showDetectionImage" 
              src="@/assets/images/jc.jpg" 
              class="background-video" 
              alt="鸭群检测图片"
            />
            
            <!-- 扫描动画 -->
            <div class="scanning-overlay" v-if="isScanning && !isFullscreen">
              <div class="scan-line"></div>
              <div class="scan-target" v-if="selectedZone !== null" :style="scanTargetStyle"></div>
              
              <!-- 加载动画 -->
              <div class="loading-container">
                <div class="loading-spinner-large"></div>
                <div class="loading-text">正在分析鸭群数据...</div>
                <div class="loading-progress">
                  <div class="loading-progress-bar" :style="{ width: loadingProgress + '%' }"></div>
                </div>
                <div class="loading-status">{{ loadingStatus }}</div>
              </div>
            </div>
            
            <!-- 点击效果 -->
            <div 
              v-for="(effect, index) in activeEffects" 
              :key="index"
              class="click-effect"
              :style="effect.style"
            ></div>
          </div>
        </div>
        
        <div class="monitor-info">
          <div class="info-item">养殖区域: A-1</div>
          <div class="info-item">鸭群数量: {{ detectedDuckCount || '未检测' }}</div>
          <div class="info-item">鸭群年龄: {{ duckAgeDisplay || '未检测' }}</div>
        </div>
      </section>

      <!-- 其他监控区域 -->
      <section class="other-section">
        <div class="section-header">
          <h2>其他监控区域</h2>
          <button class="btn btn-refresh" @click="refreshAreas">
            <i class="icon-refresh"></i>
            刷新
          </button>
        </div>
        
        <div class="areas-grid">
          <div class="area-card" v-for="(area, index) in monitoringAreas" :key="index">
            <div class="area-header">
              <div class="area-title">{{ area.title }}</div>
              <div class="area-status" :class="area.status">{{ area.statusText }}</div>
            </div>
            
            <div class="area-video-container">
              <video 
                :ref="`areaVideo${index}`"
                class="area-video" 
                autoplay 
                loop 
                muted 
                playsinline
              >
                <source :src="area.videoSrc" type="video/mp4">
              </video>
            </div>
            
            <div class="area-footer">
              <div class="area-buttons">
                <!-- <button class="btn btn-monitor-sm disabled" @click="showDisabledMonitoringMessage">
                  实时监测
                </button> -->
                <button class="btn btn-fullscreen-sm" @click="toggleAreaFullscreen(index)">全屏</button>
              </div>
              
              <div class="area-stats">
                <div class="stat-row">
                  <div class="stat-label">位置:</div>
                  <div class="stat-value">{{ area.location }}</div>
                </div>
                <div class="stat-row">
                  <div class="stat-label">鸭群数量:</div>
                  <div class="stat-value">{{ area.duckCount }}</div>
                </div>
                <div class="stat-row">
                  <div class="stat-label">最后更新:</div>
                  <div class="stat-value">{{ area.lastUpdate }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 分析结果模态框 -->
    <div class="modal-overlay" v-if="showResultsModal" @click.self="closeResultsModal">
      <div class="modal-container results-modal">
        <div class="modal-header">
          <h3>鸭群健康分析报告</h3>
          <button class="close-btn" @click="closeResultsModal">×</button>
        </div>
        
        <div class="modal-body results-body">
          <!-- 检测图像 -->
          <div class="detection-image-container" 
               :class="{ 'zoomed': isZoomed }"
               @wheel.prevent="handleZoom"
               @mousedown="startPan"
               @mousemove="pan"
               @mouseup="endPan"
               @mouseleave="endPan">
            <img 
              ref="detectionImage"
              src="@/assets/images/jc.jpg" 
              class="detection-image" 
              :style="imageStyle"
              alt="标注后的鸭群图像"
            />
            <div class="zoom-controls">
              <button class="zoom-btn" @click="zoomIn">+</button>
              <button class="zoom-btn" @click="zoomOut">-</button>
              <button class="zoom-btn" @click="resetZoom">重置</button>
            </div>
          </div>
          
          <!-- 检测结果 -->
          <div class="detection-results">
            <div class="result-card">
              <div class="result-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div class="result-value">{{ detectedDuckCount }}</div>
              <div class="result-label">检测到的鸭子数量</div>
            </div>
            
            <div class="result-card">
              <div class="result-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div class="result-value">{{ duckAgeDisplay || '未知' }}</div>
              <div class="result-label">鸭群平均年龄</div>
            </div>
            
            <div class="result-card">
              <div class="result-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div class="result-value">{{ analysisData?.analysis?.score || '-' }}/10</div>
              <div class="result-label">健康评分</div>
            </div>
          </div>
          
          <!-- 病鸭检测结果 -->
          <div class="abnormal-ducks" v-if="sickDucks.length > 0">
            <h4>病鸭检测结果 ({{ sickDucks.length }}例)</h4>
            <div class="abnormal-grid">
              <div 
                v-for="duck in sickDucks" 
                :key="duck.duckId" 
                class="abnormal-card"
                :class="getSeverityClass(duck)"
              >
                <div class="duck-id">#{{ duck.duckId }}</div>
                <div class="metric-info">
                  <span class="metric-name">{{ duck.diseaseType }}</span>
                  <span class="metric-value">{{ duck.confidence }}%</span>
                </div>
                <div class="metric-range">
                  症状: {{ duck.symptoms }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- 健康评分原因 -->
          <div class="score-reasons" v-if="analysisData?.analysis?.scoreReason?.length">
            <h4>健康评分原因</h4>
            <ul>
              <li v-for="(reason, index) in analysisData.analysis.scoreReason" :key="index">
                {{ reason }}
              </li>
            </ul>
          </div>
          
          <!-- 建议 -->
          <div class="suggestions-section" v-if="diseaseSuggestions.length > 0">
            <h4>疾病防治建议</h4>
            <div class="suggestion-category">
              <div class="category-header">
                <span class="category-icon disease"></span>
                疾病防治措施
              </div>
              <ul>
                <li v-for="(suggestion, index) in diseaseSuggestions" :key="index">{{ suggestion }}</li>
              </ul>
            </div>
          </div>
          
          <!-- 总结 -->
          <div class="summary-section">
            <h4>总结</h4>
            <div class="summary-card">
              <div class="summary-part" v-if="healthySummary.length > 0">
                <h5>健康状况</h5>
                <ul>
                  <li v-for="(item, index) in healthySummary" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
              
              <div class="summary-part" v-if="riskSummary.length > 0">
                <h5>风险提示</h5>
                <ul>
                  <li v-for="(item, index) in riskSummary" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
              
              <div class="summary-part" v-if="actionSummary.length > 0">
                <h5>建议行动</h5>
                <ul>
                  <li v-for="(item, index) in actionSummary" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer results-footer">
          <button class="btn btn-report" @click="exportReport">导出报告</button>
          <button class="btn btn-confirm" @click="closeResultsModal">确定</button>
        </div>
      </div>
    </div>

    <!-- 导出成功提示 -->
    <div class="export-notification" v-if="showExportNotification">
      <div class="export-notification-content">
        <div class="export-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="export-message">报告导出成功</div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
  data() {
    return {
      currentDateTime: '',
      activeEffects: [],
      isScanning: false,
      selectedZone: null,
      scanTargetStyle: {},
      loadingProgress: 0,
      loadingStatus: '初始化分析...',
      loadingMessages: [
        '初始化分析...',
        '收集鸭群数据...',
        '分析鸭群数量...',
        '检测病鸭...',
        '生成检测报告...'
      ],
      monitoringAreas: [
        {
          title: '育雏区 B-1',
          status: 'normal',
          statusText: '正常',
          location: '育雏舍 - 东区',
          duckCount: '156',
          lastUpdate: '2分钟前',
          videoSrc: '/videos/duck.mp4'
        },
        {
          title: '育成区',
          status: 'normal',
          statusText: '正常',
          location: '育成舍 - 南区',
          duckCount: '8',
          lastUpdate: '5分钟前',
          videoSrc: '/videos/duck5.mp4'
        },
        {
          title: '产蛋区',
          status: 'normal',
          statusText: '正常',
          location: '产蛋舍 - 西区',
          duckCount: '175',
          lastUpdate: '刚刚',
          videoSrc: '/videos/duck3.mp4'
        },
        {
          title: '户外活动区',
          status: 'optimal',
          statusText: '优秀',
          location: '户外场地 - 北区',
          duckCount: '308',
          lastUpdate: '15分钟前',
          videoSrc: '/videos/duck4.mp4'
        }
      ],
      showResultsModal: false,
      detectedDuckCount: 11, // 固定为11只鸭子
      duckAgeDisplay: "9个月",
      showDetectionImage: false,
      loadingInterval: null,
      analysisData: null,
      // 病鸭检测相关数据
      sickDucks: [
        {
          duckId: 1,
          diseaseType: '异常',
          symptoms: '针状抗体异常升高、食欲减退、精神萎靡',
          severity: 'High',
          confidence: 94,
        },
        {
          duckId: 2,
          diseaseType: '营养不良',
          symptoms: '体重减轻、发育迟缓、羽毛粗糙',
          severity: 'Medium',
          confidence: 89,
        }
      ],
      // 疾病建议
      diseaseSuggestions: [
        '加强饲养环境的卫生管理，定期消毒养殖场所',
        '提高饲料质量，确保营养均衡，添加适量维生素和矿物质',
        '建立完善的免疫程序，定期进行健康检查',
        '隔离观察异常鸭只，防止疾病传播',
        '改善饲养环境，增加活动空间，促进鸭群运动'
      ],
      healthySummary: [
        '鸭群整体健康率约为81.8%',
        '检测到2只疑似病鸭，需要进一步观察'
      ],
      riskSummary: [
        '检测到1只高风险病鸭，存在疾病传播风险',
        '检测到针状抗体异常和营养不良，需密切关注疾病发展趋势',
        '部分鸭只出现长期不动、不进食现象，需要特别关注'
      ],
      actionSummary: [
        '对检测到异常的鸭只进行隔离观察，防止疾病传播',
        '针对营养不良鸭只，调整饲料配方，增加优质蛋白质和微量元素',
        '改善饲养环境，定期消毒，降低疾病传播风险',
        '增加鸭群活动空间，促进运动，防止行动迟缓',
        '定期监测鸭群健康状况，及时发现异常'
      ],
      // 图片缩放相关
      zoomLevel: 1,
      isZoomed: false,
      isPanning: false,
      lastX: 0,
      lastY: 0,
      translateX: 0,
      translateY: 0,
      // 全屏状态
      isFullscreen: false,
      // 导出报告相关
      showExportNotification: false,
      isExporting: false
    }
  },
  computed: {
    // 计算图片样式
    imageStyle() {
      return {
        transform: `scale(${this.zoomLevel}) translate(${this.translateX}px, ${this.translateY}px)`,
        cursor: this.isPanning ? 'grabbing' : (this.zoomLevel > 1 ? 'grab' : 'default')
      }
    }
  },
  methods: {
    // 返回上一页方法
    goBack() {
      window.history.back();
    },
    
    async getVideoFile() {
      // 这里模拟从视频元素获取视频流并转换为文件
      // 实际应用中，您可能需要使用MediaRecorder API或其他方式获取视频流
      
      // 模拟创建一个视频文件
      const response = await fetch('@/assets/images/duck2.mp4');
      const blob = await response.blob();
      return new File([blob], 'video.mp4', { type: 'video/mp4' });
    },
    
    // 更新日期时间
    updateDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      this.currentDateTime = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    },
    
    // 点击视频选择区域
    selectZone(event) {
      // 计算相对于视频的位置
      const x = event.clientX;
      const y = event.clientY;
      
      // 添加涟漪效果
      this.addRippleEffect(x, y);
      
      // 根据点击位置设置扫描目标位置
      // 在点击点周围创建一个区域
      const zoneWidth = 150;
      const zoneHeight = 80;
      
      this.scanTargetStyle = {
        left: `${x - (zoneWidth/2)}px`,
        top: `${y - (zoneHeight/2)}px`,
        width: `${zoneWidth}px`,
        height: `${zoneHeight}px`,
        position: 'absolute'
      };
      
      this.selectedZone = 1; // 只是一个占位值
      this.startScanningAnimation();
    },
    
    // 添加点击效果
    addRippleEffect(x, y) {
      const effect = {
        style: {
          left: `${x}px`,
          top: `${y}px`,
        }
      };
      
      this.activeEffects.push(effect);
      
      setTimeout(() => {
        this.activeEffects = this.activeEffects.filter(e => e !== effect);
      }, 1000);
    },
    
    // 开始主监控区域的监测
    startMainMonitoring() {
      this.selectedZone = null;
      this.scanTargetStyle = {};
      this.startScanningAnimation();
    },

    // 显示其他监控区域禁用消息
    showDisabledMonitoringMessage() {
      alert('该监控区域的实时监测功能暂时不可用');
    },
    
    // 开始扫描动画
    async startScanningAnimation() {
      // 重置加载进度
      this.loadingProgress = 0;
      this.loadingStatus = this.loadingMessages[0];
      
      this.isScanning = true;
      
      // 清除之前的间隔（如果存在）
      if (this.loadingInterval) {
        clearInterval(this.loadingInterval);
      }
      
      try {
        const videoFile = await this.getVideoFile();

        // 获取 token
        const token = localStorage.getItem('authToken');

        // 创建 FormData 对象并添加文件
        const formData = new FormData();
        formData.append('file', videoFile);

        // 设置请求头
        const headers = new Headers();
        headers.append('token', `${token || ''}`);

        // 发送请求
        const response = await fetch('http://118.178.172.251:8080/analysis/return', {
          method: 'POST',
          headers: headers,
          body: formData
        });

        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        
        // 开始进度动画
        let progressStep = 0;
        this.loadingInterval = setInterval(() => {
          progressStep++;
          
          // 更新进度
          this.loadingProgress = Math.min(progressStep * 5, 100);
          
          // 更新状态消息
          const messageIndex = Math.floor(progressStep / 4) % this.loadingMessages.length;
          this.loadingStatus = this.loadingMessages[messageIndex];
          
          // 完成时
          if (this.loadingProgress >= 100) {
            clearInterval(this.loadingInterval);
            
            // 短暂延迟后显示结果模态框
            setTimeout(() => {
              this.isScanning = false;
              this.showDetectionImage = true; // 显示检测图片
              
              // 生成分析数据
              this.generateAnalysisData();
              this.showResultsModal = true;
            }, 500);
          }
        }, 300);
      } catch (error) {
        console.error('分析请求失败:', error);
        this.isScanning = false;
        alert('分析请求失败，请稍后重试');
      }
    },
    
    // 生成分析数据
    generateAnalysisData() {
      // 模拟分析数据
      this.analysisData = {
        "analysis": {
          "score": 7.0,
          "scoreReason": [
            "检测到疑似病鸭，需要进一步观察", 
            "部分鸭只体征异常", 
            "发现针状抗体异常升高",
            "部分鸭只出现长期不动、不进食现象"
          ]
        }
      };
    },
    
    closeResultsModal() {
      this.showResultsModal = false;
      this.showDetectionImage = false; // 关闭结果时隐藏检测图片
      this.resetZoom(); // 重置缩放
    },
    
    // 导出报告功能
 async exportReport() {
    if (this.isExporting) return;
    
    this.isExporting = true;
    
    try {
      const reportData = this.generateReportData();
      
      // Create PDF document with UTF-8 support
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      
      // Load Chinese font
      try {
        // Load a Chinese font - you need to have this font file in your public folder
        const fontResponse = await fetch('/fonts/mysh.ttf');
        if (!fontResponse.ok) throw new Error('Font loading failed');
        
        const fontArrayBuffer = await fontResponse.arrayBuffer();
        
        // Add font to PDF
        pdf.addFileToVFS('msyh.ttf', this.arrayBufferToBase64(fontArrayBuffer));
        pdf.addFont('msyh.ttf', 'msyh', 'normal');
        pdf.setFont('msyh');
      } catch (fontError) {
        console.error('Font loading error:', fontError);
        // Fallback to a standard font if custom font fails
      }
      
      // Page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Set font size
      pdf.setFontSize(18);
      pdf.setTextColor(0, 149, 94);
      
      // Add title - using proper encoding
      pdf.text('鸭群健康分析报告', pageWidth / 2, 20, { align: 'center' });
      
      // Add date
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`生成日期: ${this.currentDateTime}`, pageWidth / 2, 28, { align: 'center' });
      
      // Basic information section
      const baseInfo = [
        `养殖区域: A-1`,
        `鸭群数量: ${this.detectedDuckCount}`,
        `鸭群年龄: ${this.duckAgeDisplay}`,
        `健康评分: ${reportData.score}/10`
      ];
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      baseInfo.forEach((text, index) => {
        pdf.text(text, 20, 40 + index * 8);
      });
      
      // Divider line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 70, pageWidth - 20, 70);
      
      // Sick ducks detection results
      let yPos = 80;
      pdf.setFontSize(14);
      pdf.text('病鸭检测结果', 20, yPos);
      
      yPos += 10;
      reportData.sickDucks.forEach((duck, index) => {
        const mainText = `#${duck.duckId} - ${duck.diseaseType} (${duck.confidence}%)`;
        const subText = `症状: ${duck.symptoms}`;
        
        pdf.setFontSize(12);
        pdf.text(mainText, 25, yPos);
        
        pdf.setFontSize(10);
        pdf.text(subText, 30, yPos + 6);
        
        yPos += 15;
      });
      
      // Health score reasons (with pagination)
      yPos = this.addSectionWithPagination(pdf, yPos, {
        title: '健康评分原因',
        content: reportData.scoreReasons,
        pageHeight
      });
      
      // Disease prevention suggestions
      yPos = this.addSectionWithPagination(pdf, yPos, {
        title: '疾病防治建议',
        content: reportData.suggestions,
        pageHeight
      });
      
      // Summary section
      yPos = this.addSectionWithPagination(pdf, yPos, {
        title: '总结',
        content: [
          ...reportData.healthySummary.map(t => `健康状况: ${t}`),
          ...reportData.riskSummary.map(t => `风险提示: ${t}`),
          ...reportData.actionSummary.map(t => `建议行动: ${t}`)
        ],
        pageHeight
      });
      
      // Add footer
      this.addFooter(pdf, pageWidth, pageHeight);
      
      // Add detection image
      if (this.$refs.detectionImage) {
        try {
          const canvas = await html2canvas(this.$refs.detectionImage, {
            scale: 2,
            fontFamily: 'msyh, Microsoft YaHei, sans-serif'
          });
          
          const imgData = canvas.toDataURL('image/jpeg', 0.9);
          const imgWidth = 160;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Ensure image height doesn't exceed remaining space
          const remainingHeight = pageHeight - yPos - 20;
          if (imgHeight > remainingHeight) {
            pdf.addPage();
            yPos = 20;
          }
          
          pdf.addImage(imgData, 'JPEG', 20, yPos + 10, imgWidth, imgHeight);
        } catch (error) {
          console.error('Image addition failed:', error);
        }
      }
      
      // Save file
      const fileName = `鸭群健康报告_${new Date().toISOString().slice(0,10)}.pdf`;
      pdf.save(fileName);
      
      // Show success notification
      this.showExportNotification = true;
      setTimeout(() => {
        this.showExportNotification = false;
      }, 3000);
      
    } catch (error) {
      console.error('Report generation failed:', error);
      alert('报告生成失败，请稍后重试');
    } finally {
      this.isExporting = false;
    }
  },
  
  // Helper methods for PDF generation
  addSectionWithPagination(pdf, yPos, { title, content, pageHeight }) {
    pdf.setFontSize(14);
    pdf.text(title, 20, yPos);
    
    yPos += 10;
    pdf.setFontSize(12);
    
    content.forEach((text) => {
      // Check if we need a new page
      if (yPos > pageHeight - 20) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(`• ${text}`, 25, yPos);
      yPos += 8;
    });
    
    return yPos + 15;
  },
  
  addFooter(pdf, pageWidth, pageHeight) {
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      
      const footerText = `第 ${i} 页 / 共 ${totalPages} 页`;
      const copyrightText = '通禽达理 - 鸭群监控系统';
      
      pdf.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text(copyrightText, pageWidth - 20, pageHeight - 10, { align: 'right' });
    }
  },
  
  // Helper method to convert ArrayBuffer to Base64
  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },
    
    // 生成报告数据
    generateReportData() {
      return {
        date: this.currentDateTime,
        duckCount: this.detectedDuckCount,
        duckAge: this.duckAgeDisplay,
        score: this.analysisData?.analysis?.score || '-',
        sickDucks: this.sickDucks,
        scoreReasons: this.analysisData?.analysis?.scoreReason || [],
        suggestions: this.diseaseSuggestions,
        healthySummary: this.healthySummary,
        riskSummary: this.riskSummary,
        actionSummary: this.actionSummary
      };
    },
    
    refreshAreas() {
      // 创建新的数组以更新所有区域
      const updatedAreas = this.monitoringAreas.map(area => ({
        ...area,
        lastUpdate: '刚刚'
      }));
      
      // 更新状态
      this.monitoringAreas = updatedAreas;
      
      alert('监控区域数据已更新');
    },
    
    toggleMainVideoFullscreen() {
      const videoElement = this.$refs.mainVideo;
      
      if (!document.fullscreenElement) {
        this.isFullscreen = true;
        if (videoElement && videoElement.requestFullscreen) {
          videoElement.requestFullscreen();
        } else if (videoElement && videoElement.webkitRequestFullscreen) {
          videoElement.webkitRequestFullscreen();
        } else if (videoElement && videoElement.msRequestFullscreen) {
          videoElement.msRequestFullscreen();
        }
      } else {
        this.isFullscreen = false;
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },
    
    toggleAreaFullscreen(index) {
      const videoRef = `areaVideo${index}`;
      const videos = this.$refs[videoRef];
      
      if (!videos || !videos.length) return;
      
      const video = videos[0];
      
      if (!document.fullscreenElement) {
        this.isFullscreen = true;
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
          video.msRequestFullscreen();
        }
      } else {
        this.isFullscreen = false;
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },
    
    // 获取异常严重程度类名
    getSeverityClass(duck) {
      if (duck.severity === 'High') return 'severe';
      if (duck.severity === 'Medium') return 'moderate';
      return 'mild';
    },

    // 图片缩放相关方法
    zoomIn() {
      if (this.zoomLevel < 3) {
        this.zoomLevel += 0.2;
        this.isZoomed = this.zoomLevel > 1;
      }
    },
    
    zoomOut() {
      if (this.zoomLevel > 0.5) {
        this.zoomLevel -= 0.2;
        this.isZoomed = this.zoomLevel > 1;
        
        // 如果缩小到原始大小，重置位移
        if (this.zoomLevel <= 1) {
          this.translateX = 0;
          this.translateY = 0;
        }
      }
    },
    
    resetZoom() {
      this.zoomLevel = 1;
      this.translateX = 0;
      this.translateY = 0;
      this.isZoomed = false;
    },
    
    // 鼠标滚轮缩放
    handleZoom(event) {
      if (event.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    },
    
    // 拖动图片相关方法
    startPan(event) {
      if (this.zoomLevel > 1) {
        this.isPanning = true;
        this.lastX = event.clientX;
        this.lastY = event.clientY;
      }
    },
    
    pan(event) {
      if (!this.isPanning) return;
      
      const deltaX = event.clientX - this.lastX;
      const deltaY = event.clientY - this.lastY;
      
      this.translateX += deltaX / this.zoomLevel;
      this.translateY += deltaY / this.zoomLevel;
      
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    },
    
    endPan() {
      this.isPanning = false;
    },

    // 监听全屏变化
    handleFullscreenChange() {
      if (!document.fullscreenElement) {
        this.isFullscreen = false;
      }
    }
  },
  mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
    
    // 确保视频自动播放
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.play().catch(error => {
        console.log('自动播放被阻止:', error);
        // 如果自动播放被阻止，添加播放按钮
        const playButton = document.createElement('button');
        playButton.className = 'video-play-button';
        playButton.innerHTML = '▶';
        playButton.onclick = () => video.play();
        video.parentNode.appendChild(playButton);
      });
    });

    // 监听全屏变化
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange);
  },
  beforeDestroy() {
    // 清除任何运行中的间隔
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
    }

    // 移除全屏事件监听
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange);
  }
}
</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

.duck-monitoring-system {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  color: #333;
}

/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 返回按钮样式 */
.back-button {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  margin-right: 16px;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.icon-back {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cline x1='19' y1='12' x2='5' y2='12'%3E%3C/line%3E%3Cpolyline points='12 19 5 12 12 5'%3E%3C/polyline%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  height: 36px;
  width: 36px;
  background-color: #00955e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  margin-right: 12px;
  font-weight: bold;
  font-size: 18px;
}

.logo h1 {
  font-size: 18px;
  color: #00955e;
  font-weight: 600;
}

.date-time {
  font-size: 14px;
  color: #666;
  background-color: #f9f9f9;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
}

.icon-clock {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolyline points='12 6 12 12 16 14'%3E%3C/polyline%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.icon-maximize {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='15 3 21 3 21 9'%3E%3C/polyline%3E%3Cpolyline points='9 21 3 21 3 15'%3E%3C/polyline%3E%3Cline x1='21' y1='3' x2='14' y2='10'%3E%3C/line%3E%3Cline x1='3' y1='21' x2='10' y2='14'%3E%3C/line%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.icon-refresh {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='1 4 1 10 7 10'%3E%3C/polyline%3E%3Cpolyline points='23 20 23 14 17 14'%3E%3C/polyline%3E%3Cpath d='M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'%3E%3C/path%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* 区域样式 */
.main-section, .other-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 20px;
  color: #00955e;
  position: relative;
  padding-left: 12px;
}

.section-header h2:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background-color: #00955e;
  border-radius: 2px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

/* 监控容器 */
.monitor-container {
  width: 100%;
  height: 550px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.video-display {
  width: 100%;
  height: 180%;
  position: relative;
  background-color: #000;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 扫描动画 */
.scanning-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
  overflow: hidden;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, 
    rgba(0, 255, 0, 0) 0%,
    rgba(0, 255, 0, 1) 50%,
    rgba(0, 255, 0, 0) 100%
  );
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
  animation: scan 3s ease-in-out infinite;
  z-index: 6;
}

.scan-target {
  border: 2px solid rgba(0, 255, 0, 0.8);
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
  animation: pulse 1.5s ease-in-out infinite;
  z-index: 5;
}

/* 加载动画 */
.loading-container {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 0, 0.3);
  min-width: 280px;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #00ff00;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

.loading-spinner-large {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #00ff00;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: white;
  font-size: 16px;
  font-weight: 500;
}

.loading-status {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.loading-progress {
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.loading-progress-bar {
  height: 100%;
  background-color: #00ff00;
  border-radius: 3px;
  transition: width 0.3s ease;
}

@keyframes scan {
  0% { top: 0; }
  50% { top: 100%; }
  100% { top: 0; }
}

@keyframes pulse {
  0% { box-shadow: 0 0 15px rgba(0, 255, 0, 0.5); }
  50% { box-shadow: 0 0 25px rgba(0, 255, 0, 0.8); }
  100% { box-shadow: 0 0 15px rgba(0, 255, 0, 0.5); }
}

/* 点击效果 */
.click-effect {
  position: absolute;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 255, 0, 0.8);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: ripple 0.8s ease-out forwards;
  z-index: 10;
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

/* 监控信息 */
.monitor-info {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 14px;
  color: #555;
  background-color: #fff;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item:before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #00955e;
  border-radius: 50%;
  margin-right: 8px;
}

/* 其他监控区域 */
.areas-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.area-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.area-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
}

.area-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.area-title {
  font-weight: 600;
  color: #333;
}

.area-status {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.area-status.normal {
  background-color: #e6f7e6;
  color: #00955e;
}

.area-status.optimal {
  background-color: #e6f0ff;
  color: #0066cc;
}

.area-video-container {
  height: 200px;
  position: relative;
}

.area-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.area-footer {
  padding: 16px;
}

.area-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
}

.area-stats {
  font-size: 13px;
  color: #666;
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.stat-row:last-child {
  margin-bottom: 0;
}

/* 按钮 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.btn-monitor {
  background-color: #00955e;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 149, 94, 0.3);
}

.btn-monitor:hover {
  background-color: #007a4d;
  box-shadow: 0 3px 6px rgba(0, 149, 94, 0.4);
}

.btn-fullscreen {
  background-color: #f0f0f0;
  color: #333;
}

.btn-fullscreen:hover {
  background-color: #e0e0e0;
}

.btn-refresh {
  background-color: #f0f0f0;
  color: #333;
  display: flex;
  align-items: center;
}

.btn-refresh:hover {
  background-color: #e0e0e0;
}

.btn-monitor-sm, .btn-fullscreen-sm {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 3px;
}

.btn-monitor-sm {
  background-color: #00955e;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 149, 94, 0.2);
}

.btn-monitor-sm:hover {
  background-color: #007a4d;
}

.btn-monitor-sm.disabled {
  background-color: #cccccc;
  color: #666;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-fullscreen-sm {
  background-color: #f0f0f0;
  color: #333;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(3px);
}

.modal-container {
  background-color: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  padding: 16px 20px;
  background-color: #00955e;
  color: #fff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 20px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top: 1px solid #eee;
}

/* 检测结果模态框 */
.detection-image-container {
  width: 100%;
  height: 300px;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.detection-image-container.zoomed {
  cursor: grab;
  overflow: hidden;
}

.detection-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease;
}

/* 缩放控制 */
.zoom-controls {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  z-index: 10;
}

.zoom-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.zoom-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.detection-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #666;
}

.detection-results {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.result-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: transform 0.2s;
}

.result-card:hover {
  transform: translateY(-3px);
}

.result-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  color: #00955e;
}

.result-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.result-label {
  font-size: 14px;
  color: #666;
}

/* 健康评分原因 */
.score-reasons {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.score-reasons h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.score-reasons ul {
  padding-left: 20px;
}

.score-reasons li {
  margin-bottom: 8px;
  color: #555;
}

/* 异常鸭子列表 */
.abnormal-ducks {
  margin-bottom: 24px;
}

.abnormal-ducks h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.abnormal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.abnormal-card {
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid;
}

.abnormal-card.severe {
  border-color: #ff4d4f;
  background-color: #fff1f0;
}

.abnormal-card.moderate {
  border-color: #faad14;
  background-color: #fffbe6;
}

.abnormal-card.mild {
  border-color: #52c41a;
  background-color: #f6ffed;
}

.duck-id {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.metric-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.metric-name {
  font-weight: 500;
  color: #333;
}

.metric-value {
  font-weight: 700;
  color: #333;
}

.metric-range {
  font-size: 12px;
  color: #666;
}

/* 建议部分 */
.suggestions-section {
  margin-bottom: 24px;
}

.suggestions-section h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.suggestion-category {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.category-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.category-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.category-icon.disease {
  background-color: #9933cc;
}

.suggestion-category ul {
  padding-left: 20px;
}

.suggestion-category li {
  margin-bottom: 8px;
  color: #555;
}

/* 总结部分 */
.summary-section {
  margin-bottom: 24px;
}

.summary-section h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.summary-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

.summary-part {
  margin-bottom: 16px;
}

.summary-part:last-child {
  margin-bottom: 0;
}

.summary-part h5 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  display: flex;
  align-items: center;
}

.summary-part h5:before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #00955e;
  border-radius: 50%;
  margin-right: 8px;
}

.summary-part ul {
  padding-left: 20px;
}

.summary-part li {
  margin-bottom: 8px;
  color: #555;
}

.btn-report {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.btn-report:hover {
  background-color: #e0e0e0;
}

.btn-confirm {
  background-color: #00955e;
  color: #fff;
}

.btn-confirm:hover {
  background-color: #007a4d;
}

/* 导出成功提示 */
.export-notification {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
  padding: 12px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.export-notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.export-icon {
  color: #52c41a;
  width: 24px;
  height: 24px;
}

.export-message {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 视频播放按钮（自动播放被阻止时的后备方案） */
.video-play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 5;
  transition: all 0.3s;
}

.video-play-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
  transform: translate(-50%, -50%) scale(1.1);
}

/* 响应式样式 */
@media (max-width: 1200px) {
  .areas-grid {
    grid-template-columns: repeat(2, 1fr); /* 在中等屏幕上显示两列 */
  }
  
  .abnormal-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .detection-results {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* 调整头部布局 */
  .header {
    flex-wrap: wrap;
  }
  
  .back-button {
    margin-bottom: 8px;
  }
}

@media (max-width: 768px) {
  .areas-grid {
    grid-template-columns: 1fr; /* 在小屏幕上显示一列 */
  }
  
  .monitor-container {
    height: 350px;
  }
  
  .modal-container {
    width: 95%;
  }
  
  .detection-results {
    grid-template-columns: 1fr;
  }
  
  .abnormal-grid {
    grid-template-columns: 1fr;
  }
  
  /* 调整头部布局 */
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .date-time {
    align-self: stretch;
  }
}

video::-webkit-media-controls-enclosure {
  display: none !important;
}
</style>

