<template>
  <div class="measurement-prediction">
    <!-- 头部 -->
    <div class="header">
      <h2>体尺预测</h2>
      <el-button type="success" plain @click="startVideoDetection">
        接入视频流检测
      </el-button>
    </div>

    <!-- 上传选择 -->
    <div class="upload-type-selector">
      <el-radio-group v-model="uploadType" @change="handleUploadTypeChange">
        <el-radio :label="'images'" :style="{ color: imageRadioColor }" ref="imageRadio">
          上传三张图片(深度、侧部、顶部)
        </el-radio>
        <el-radio :label="'zip'" :style="{ color: zipRadioColor }" ref="zipRadio">
          上传ZIP压缩包
        </el-radio>
      </el-radio-group>
    </div>

    <!-- 上传模板提示 -->
    <div class="template-info" v-if="uploadType === 'zip'">
      <div class="template-title">
        <i class="el-icon-info"></i>
        <span>ZIP模板下载</span>
      </div>
      <div class="template-description">
        <p>请按照以下结构准备ZIP文件：</p>
        <pre>
顶层目录：
├── 1_1_DepthCamera.png    # 深部视角
├── 1_1_SideViewCamera.png # 侧部视角
├── 1_2_TopViewCamera.png  # 顶部视角
├── 65_1_DepthCamera.png   # 深部视角
├── 65_3_SideViewCamera.png# 侧部视角
├── 65_7_TopViewCamera.png # 顶部视角
├── 71_1_DepthCamera.png   # 深部视角
├── 71_1_SideViewCamera.png# 侧部视角
├── 71_1_TopViewCamera.png # 顶部视角
<!-- 更多文件... -->
        </pre>
        <p>命名规则：</p>
        <ul>
          <li>文件名必须按照 "编号_序号_视角类型.png" 格式命名</li>
          <li>视角类型必须为 DepthCamera、SideViewCamera 或 TopViewCamera</li>
          <li>每个编号必须包含所有三种视角的图片</li>
          <li>ZIP文件大小不超过50MB</li>
        </ul>
        <el-button type="primary" plain size="small" @click="downloadTemplate">
          下载ZIP模板
        </el-button>
      </div>
    </div>

    <!-- 上传区域 - 图片模式 -->
    <div class="upload-container" v-if="uploadType === 'images'">
      <div class="upload-area">
        <el-upload
          ref="imageUpload"
          action=""
          :limit="3"
          :on-exceed="handleExceed"
          :on-change="handleImageChange"
          :on-remove="handleImageRemove"
          :on-preview="handlePreview"
          :auto-upload="false"
          :file-list="imageFileList"
          accept="image/*"
          multiple
          drag
        >
          <div class="upload-content">
            <h3 class="upload-title">上传测量图片</h3>
            <p class="upload-desc">请上传顶部视角、侧部视角和深部视角图片</p>
            <p class="upload-tip">点击或拖放到此处以上传图片，支持 JPG/PNG 文件</p>
          </div>
        </el-upload>

        <!-- 文件列表 -->
        <div class="file-list" v-if="imageFileList.length > 0">
          <div class="file-item" v-for="(file, index) in imageFileList" :key="index">
            <i class="el-icon-document"></i>
            <span class="file-name">{{ file.name }}</span>
          </div>
        </div>

        <!-- 上传进度 -->
        <div class="upload-progress" v-if="imageFileList.length > 0">
          <div class="progress-text">已上传 {{ imageFileList.length }}/3 张图片</div>
          <el-progress 
            :percentage="(imageFileList.length / 3) * 100" 
            :stroke-width="10" 
            status="success"
          ></el-progress>
        </div>

        <!-- 预测按钮 -->
        <el-button 
          v-if="imageFileList.length === 3" 
          type="success" 
          class="predict-btn"
          @click="startPrediction"
          :loading="loading"
        >
          开始预测
        </el-button>
      </div>
    </div>

    <!-- 上传区域 - ZIP模式 -->
    <div class="upload-container" v-if="uploadType === 'zip'">
      <div class="upload-area">
        <el-upload
          ref="zipUpload"
          action=""
          :limit="1"
          :on-change="handleZipChange"
          :on-remove="handleZipRemove"
          :auto-upload="false"
          :file-list="zipFileList"
          accept=".zip"
          drag
        >
          <div class="upload-content">
            <h3 class="upload-title">上传ZIP压缩包</h3>
            <p class="upload-desc">请上传包含顶部视角、侧部视角和深部视角图片的ZIP文件</p>
            <p class="upload-tip">点击或拖放到此处以上传ZIP文件，文件大小不超过50MB</p>
          </div>
        </el-upload>

        <!-- 文件列表 -->
        <div class="file-list" v-if="zipFileList.length > 0">
          <div class="file-item">
            <i class="el-icon-document"></i>
            <span class="file-name">{{ zipFileList[0].name }}</span>
          </div>
        </div>

        <!-- ZIP文件验证状态 -->
        <div class="zip-validation" v-if="zipFileList.length > 0">
          <div class="validation-status" :class="zipValidationStatus ? 'valid' : 'invalid'">
            <i :class="zipValidationStatus ? 'el-icon-success' : 'el-icon-error'"></i>
            <span>{{ zipValidationMessage }}</span>
          </div>
        </div>

        <!-- 预测按钮 -->
        <el-button 
          v-if="zipFileList.length > 0 && zipValidationStatus" 
          type="success" 
          class="predict-btn"
          @click="startPrediction"
          :loading="loading"
        >
          开始预测
        </el-button>
      </div>
    </div>

    <!-- 预测结果 -->
    <div class="result-container" v-if="showResults">
      <div class="result-header">
        <h3>预测结果</h3>
        <div class="score-display">
          <div class="score-circle" :class="getScoreClass(analysisScore)">
            <span class="score-value">{{ analysisScore }}</span>
          </div>
          <div class="score-text">
            <div class="score-label">综合评分</div>
            <div class="score-desc">{{ scoreReasons.join('，') }}</div>
          </div>
        </div>
      </div>

      <!-- 测量结果图表 -->
      
      <!-- 综合评估部分 -->
      <div class="evaluation-section">
        <h3>综合评估</h3>
        <div class="evaluation-score">
          <div class="score-label">总体评分: {{ analysisScore }}分</div>
          <div class="score-reasons">
            <div v-for="(reason, index) in scoreReasons" :key="index" class="score-reason">
              <i class="el-icon-warning-outline"></i>
              <span>{{ reason }}</span>
            </div>
          </div>
        </div>

        <!-- 异常指标 -->
        <div class="abnormal-metrics">
          <h4>异常指标</h4>
          <div class="abnormal-metrics-list">
            <div v-for="(abnormal, index) in abnormalDucks" :key="index" class="abnormal-item">
              <div class="abnormal-icon">
                <i class="el-icon-warning"></i>
              </div>
              <div class="abnormal-content">
                <div class="abnormal-title">鸭子 #{{ abnormal.duckId }} {{ abnormal.metric }}</div>
                <div class="abnormal-detail">
                  当前值: <span class="abnormal-value">{{ abnormal.value }}{{ abnormal.unit }}</span> 
                  (标准范围: {{ abnormal.standardRange[0] }}-{{ abnormal.standardRange[1] }}{{ abnormal.unit }})
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 建议部分 -->
        <div class="suggestions-section">
          <h4>改进建议</h4>
          <div class="suggestions-container">
            <div class="suggestion-category" v-if="suggestions.nutrition && suggestions.nutrition.length">
              <div class="suggestion-category-title">
                <i class="el-icon-food"></i>
                <span>营养建议</span>
              </div>
              <ul class="suggestion-list">
                <li v-for="(item, index) in suggestions.nutrition" :key="index">{{ item }}</li>
              </ul>
            </div>
            <div class="suggestion-category" v-if="suggestions.environment && suggestions.environment.length">
              <div class="suggestion-category-title">
                <i class="el-icon-house"></i>
                <span>环境建议</span>
              </div>
              <ul class="suggestion-list">
                <li v-for="(item, index) in suggestions.environment" :key="index">{{ item }}</li>
              </ul>
            </div>
            <div class="suggestion-category" v-if="suggestions.disease && suggestions.disease.length">
              <div class="suggestion-category-title">
                <i class="el-icon-first-aid-kit"></i>
                <span>疾病预防</span>
              </div>
              <ul class="suggestion-list">
                <li v-for="(item, index) in suggestions.disease" :key="index">{{ item }}</li>
              </ul>
            </div>
            <div class="suggestion-category" v-if="suggestions.monitoring && suggestions.monitoring.length">
              <div class="suggestion-category-title">
                <i class="el-icon-monitor"></i>
                <span>监测建议</span>
              </div>
              <ul class="suggestion-list">
                <li v-for="(item, index) in suggestions.monitoring" :key="index">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 优势与风险 -->
        <div class="strengths-risks-section">
          <div class="strengths-container">
            <h4><i class="el-icon-star-on"></i> 优势</h4>
            <ul class="strengths-list">
              <li v-for="(strength, index) in summary.strengths" :key="index">{{ strength }}</li>
            </ul>
          </div>
          <div class="risks-container">
            <h4><i class="el-icon-warning"></i> 风险</h4>
            <ul class="risks-list">
              <li v-for="(risk, index) in summary.risks" :key="index">{{ risk }}</li>
            </ul>
          </div>
        </div>

        <!-- 优先行动 -->
        <div class="priority-actions">
          <h4>优先行动</h4>
          <div class="priority-actions-list">
            <div v-for="(action, index) in summary.priorityActions" :key="index" class="priority-action-item">
              <div class="priority-number">{{ index + 1 }}</div>
              <div class="priority-content">{{ action }}</div>
            </div>
          </div>
        </div>
      </div>
        <div class="measurement-charts">
        <h4>测量指标</h4>
        <div class="chart-container" v-for="(duck, duckIndex) in duckData" :key="duckIndex">
          <div class="duck-header">
            <div class="duck-title">鸭子 #{{ duck.id }} ({{ duck.displayAge }})</div>
            <div class="duck-weight">体重: {{ duck.weight }}kg</div>
          </div>
          <div class="bar-charts">
            <div class="bar-chart-item" v-for="(metric, metricIndex) in duckMetrics" :key="metricIndex">
              <div class="metric-name">{{ metric.label }}</div>
              <div class="metric-chart">
                <div class="metric-range-bar">
                  <div class="range-segment low" :style="{ width: getRangeSegmentWidth(metric, 'low') + '%' }"></div>
                  <div class="range-segment normal" :style="{ width: getRangeSegmentWidth(metric, 'normal') + '%' }"></div>
                  <div class="range-segment high" :style="{ width: getRangeSegmentWidth(metric, 'high') + '%' }"></div>
                  <div class="current-value-marker" 
                       :style="{ left: getValuePosition(duck, metric) + '%' }"
                       :class="getValueClass(duck, metric)">
                    <div class="marker-line"></div>
                    <div class="marker-value">{{ getMetricValue(duck, metric) }}{{ metric.unit }}</div>
                  </div>
                </div>
                <div class="range-labels">
                  <span class="range-min">{{ metric.minRange }}{{ metric.unit }}</span>
                  <span class="range-standard">标准: {{ metric.min }}-{{ metric.max }}{{ metric.unit }}</span>
                  <span class="range-max">{{ metric.maxRange }}{{ metric.unit }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览对话框 -->
    <el-dialog 
      v-model="dialogVisible"
      title="图片预览" 
      width="50%" 
      center
      class="preview-dialog">
      <img :src="previewImage" alt="Preview" class="preview-image" />
    </el-dialog>
  </div>
</template>

<script>
import JSZip from 'jszip';
import { predition } from '@/api/startpredition';

// 鸭子测量指标配置
const duckMetrics = [
  { 
    label: '体重',
    key: 'weight',
    min: 0.9, max: 1.2,
    minRange: 0, maxRange: 1.5, 
    unit: 'kg',
    colors: ['#f56c6c', '#67c23a', '#e6a23c'] 
  },
  {
    label: '体斜长',
    key: 'bodyLength',
    min: 25, max: 30,
    minRange: 20, maxRange: 35,
    unit: 'cm',
    colors: ['#f56c6c', '#67c23a', '#e6a23c']
  },
  {
    label: '颈长',
    key: 'neckLength',
    min: 4.5, max: 6.0,
    minRange: 3, maxRange: 7,
    unit: 'cm',
    colors: ['#f56c6c', '#67c23a', '#e6a23c']
  },
  {
    label: '半潜水长',
    key: 'divingLength',
    min: 30, max: 40,
    minRange: 25, maxRange: 45,
    unit: 'cm',
    colors: ['#f56c6c', '#67c23a', '#e6a23c']
  },
  {
    label: '龙骨长',
    key: 'keelLength',
    min: 6.5, max: 7.5,
    unit: 'cm',
    minRange: 3, maxRange: 10,
    colors: ['#f56c6c', '#67c23a', '#e6a23c']
  },
  {
    label: '胸宽',
    key: 'chestWidth',
    min: 9.5, max: 11.0,
    unit: 'cm',
    minRange: 7, maxRange: 13,
    colors: ['#f56c6c', '#67c23a', '#e6a23c']
  },
  {
    label: '胸深',
    key: 'chestDepth',
    min: 10.0, max: 12.0,
    unit: 'cm',
    minRange: 8, maxRange: 14,
    colors: ['#f56c6c', '#67c23a', '#e6a23c']
  },
  {
    label: '胫长',
    key: 'tibiaLength',
    min: 5.0, max: 6.0,
    unit: 'cm',
    minRange: 3, maxRange: 8,
    colors: ['#f56c6c', '#67c23a', '#e6a23c']
  }
];

export default {
  name: 'MeasurementPrediction',
  
  data() {
    return {
      imageRadioColor: '',
      zipRadioColor: '',
      uploadType: 'images', // 默认上传类型：'images' 或 'zip'
      imageFileList: [], // 图片文件列表
      zipFileList: [], // ZIP文件列表
      zipValidationStatus: false, // ZIP验证状态
      zipValidationMessage: '', // ZIP验证消息
      extractedImages: [], // 从ZIP中提取的图片
      dialogVisible: false,
      previewImage: '',
      loading: false,
      showResults: false,
      duckMetrics: duckMetrics,
      
      // 分析结果数据
      analysisScore: 0,
      scoreReasons: [],
      abnormalDucks: [],
      suggestions: {
        nutrition: [],
        environment: [],
        disease: [],
        monitoring: []
      },
      summary: {
        strengths: [],
        risks: [],
        priorityActions: []
      },
      duckData: []
    };
  },
  
  methods: {
    // 处理上传类型变更
    handleUploadTypeChange() {
      // 重置文件列表和验证状态
      this.imageFileList = [];
      this.zipFileList = [];
      this.zipValidationStatus = false;
      this.zipValidationMessage = '';
      this.extractedImages = [];
      
      // 重置上传组件
      if (this.uploadType === 'images' && this.$refs.imageUpload) {
        this.$refs.imageUpload.clearFiles();
      } else if (this.uploadType === 'zip' && this.$refs.zipUpload) {
        this.$refs.zipUpload.clearFiles();
      }
    },
    
    // 处理图片文件超出限制
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制最多上传 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    
    // 处理图片文件变化
    handleImageChange(file, fileList) {
      // 验证文件类型
      const isImage = file.raw.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('只能上传图片文件!');
        const index = fileList.indexOf(file);
        if (index !== -1) {
          fileList.splice(index, 1);
        }
        return;
      }
      
      // 验证文件大小
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error('图片大小不能超过 5MB!');
        const index = fileList.indexOf(file);
        if (index !== -1) {
          fileList.splice(index, 1);
        }
        return;
      }
      
      this.imageFileList = fileList;
      if (this.imageFileList.length === 3) {
        this.$message.success('三张图片已全部上传');
      }
    },
    
    // 处理图片文件移除
    handleImageRemove(file, fileList) {
      this.imageFileList = fileList;
    },
    
    // 处理ZIP文件变化
    handleZipChange(file, fileList) {
      // 验证文件类型
      const isZip = file.raw.type === 'application/zip' || file.raw.name.endsWith('.zip');
      if (!isZip) {
        this.$message.error('只能上传ZIP文件!');
        this.zipFileList = [];
        this.zipValidationStatus = false;
        this.zipValidationMessage = '';
        return;
      }
      
      // 验证文件大小
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        this.$message.error('ZIP文件大小不能超过 50MB!');
        this.zipFileList = [];
        this.zipValidationStatus = false;
        this.zipValidationMessage = '';
        return;
      }
      
      this.zipFileList = fileList;
      
      // 验证ZIP内容
      this.validateZipFile(file.raw);
    },
    
    // 处理ZIP文件移除
    handleZipRemove() {
      this.zipFileList = [];
      this.zipValidationStatus = false;
      this.zipValidationMessage = '';
      this.extractedImages = [];
    },
    
    // 验证ZIP文件内容
    async validateZipFile(file) {
      this.loading = true;
      this.zipValidationStatus = false;
      this.zipValidationMessage = '正在验证ZIP文件内容...';
      
      try {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);
        
        // 提取所有图片文件
        const imageFiles = [];
        
        // 遍历ZIP中的所有文件
        const promises = [];
        zipContent.forEach((relativePath, zipEntry) => {
          if (!zipEntry.dir) {
            const fileExtension = relativePath.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
              const promise = zipEntry.async('blob').then(blob => {
                // 创建带有名称的文件对象
                const file = new File([blob], zipEntry.name, { 
                  type: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}` 
                });
                imageFiles.push(file);
              });
              promises.push(promise);
            }
          }
        });
        
        await Promise.all(promises);
        
        // 验证提取的图片数量
        if (imageFiles.length < 3) {
          this.zipValidationStatus = false;
          this.zipValidationMessage = `ZIP文件中只包含 ${imageFiles.length} 张图片，需要至少3张图片`;
        } else {
          this.zipValidationStatus = true;
          this.zipValidationMessage = `验证成功，ZIP文件包含 ${imageFiles.length} 张图片`;
          this.extractedImages = imageFiles;
        }
      } catch (error) {
        console.error('ZIP文件验证失败:', error);
        this.zipValidationStatus = false;
        this.zipValidationMessage = '无法读取ZIP文件内容，请确保文件未损坏';
      } finally {
        this.loading = false;
      }
    },
    
    // 处理文件预览
    handlePreview(file) {
      this.previewImage = URL.createObjectURL(file.raw);
      this.dialogVisible = true;
    },
    
    // 开始视频检测
    startVideoDetection() {
      this.$message({
        message: '视频流检测功能即将开启',
        type: 'info'
      });
    },
    
    // 开始预测
    startPrediction() {
      if (this.uploadType === 'images') {
        if (this.imageFileList.length !== 3) {
          this.$message.warning('请上传三张图片后开始预测');
          return;
        }
      } else if (this.uploadType === 'zip') {
        if (this.zipFileList.length === 0 || !this.zipValidationStatus) {
          this.$message.warning('请上传有效的ZIP文件后开始预测');
          return;
        }
      }
      
      this.loading = true;
      this.showResults = false;
      
      // 计算鸭子数量 - 图片数量除以3
      let duckCount = 0;
      
      if (this.uploadType === 'images') {
        duckCount = Math.floor(this.imageFileList.length / 3);
      } else {
        duckCount = Math.floor(this.extractedImages.length / 3);
      }
      
      // 确保至少有1只鸭子
      duckCount = Math.max(1, duckCount);
      
      // 固定年龄代码为4
      const ageCode = 4;
      
      // 调用API发送预测请求
      predition(duckCount, ageCode)
        .then(response => {
          console.log('API返回数据:', response);
          
          // 处理API返回的数据
          this.handlePredictionResponse(response);
          
          // 显示结果
          this.showResults = true;
          this.$message.success('预测完成');
        })
        .catch(error => {
          this.$message.error(`预测失败: ${error.message}`);
          console.error('完整错误日志:', {
            error,
            responseData: error.response?.data
          });
          
          // 使用模拟数据进行测试
          const mockData = {
            analysis: {
              score: 6.0,
              scoreReason: ["体重普遍低于参考标准0.90-1.20kg", "龙骨长度普遍低于参考标准6.5-7.5cm"],
              abnormalDucks: [
                { duckId: 1, metric: "体重", value: 0.79, unit: "kg", standardRange: [0.9, 1.2] },
                { duckId: 2, metric: "胫长", value: 4.3, unit: "cm", standardRange: [5.0, 6.0] },
                { duckId: 3, metric: "体重", value: 0.85, unit: "kg", standardRange: [0.9, 1.2] },
                { duckId: 4, metric: "龙骨长度", value: 4.8, unit: "cm", standardRange: [6.5, 7.5] },
                { duckId: 5, metric: "龙骨长度", value: 5.0, unit: "cm", standardRange: [6.5, 7.5] },
                { duckId: 6, metric: "胫长", value: 4.5, unit: "cm", standardRange: [5.0, 6.0] },
                { duckId: 7, metric: "胫长", value: 3.3, unit: "cm", standardRange: [5.0, 6.0] },
              ],
              suggestions: {
                nutrition: ["增加蛋白质和能量饲料比例，确保日粮中氨基酸平衡", "补充维生素和矿物质，特别是钙磷比例优化"],
                environment: ["保持适宜的温度（20-25°C），避免过高或过低", "增加通风量以减少氨气浓度，改善空气质量"],
                disease: ["加强疫苗接种计划，预防呼吸道疾病和肠道感染"],
                monitoring: ["定期测量体重和骨骼发育情况，及时调整饲养方案", "监控鸡舍环境参数，如湿度、光照强度等"],
              },
              summary: {
                strengths: ["胸深和胸宽接近参考标准范围，胸部发育较好"],
                risks: ["整体体重偏低，影响后期生长潜力", "龙骨长度显著不足，可能影响骨骼发育及行走能力"],
                priorityActions: [
                  "优化饲料配方，提高营养密度",
                  "加强日常巡检，发现异常及时处理",
                  "改善鸡舍环境条件，提供舒适的生活空间",
                ],
              },
            },
            ducks: [
              {
                id: 1,
                ageStageCode: 4,
                displayAge: "1个月",
                ageMonth: 1.034921683731035,
                weight: 0.79,
                bodyLength: 27.3,
                neckLength: 4.4,
                divingLength: 35.0,
                keelLength: 3.1,
                chestWidth: 10.1,
                chestDepth: 10.8,
                tibiaLength: 3.6,
                createTime: "2025-03-27T21:32:45.7411576",
              },
              {
                id: 2,
                ageStageCode: 4,
                displayAge: "1个月",
                ageMonth: 1.045575238404296,
                weight: 0.77,
                bodyLength: 27.8,
                neckLength: 5.3,
                divingLength: 35.0,
                keelLength: 4.3,
                chestWidth: 10.1,
                chestDepth: 10.5,
                tibiaLength: 4.3,
                createTime: "2025-03-27T21:32:45.7411576",
              },
              {
                id: 3,
                ageStageCode: 4,
                displayAge: "1个月",
                ageMonth: 1.0027571892447305,
                weight: 0.85,
                bodyLength: 27.7,
                neckLength: 4.6,
                divingLength: 35.0,
                keelLength: 3.8,
                chestWidth: 10.0,
                chestDepth: 11.2,
                tibiaLength: 3.8,
                createTime: "2025-03-27T21:32:45.7411576",
              },
              {
                id: 4,
                ageStageCode: 4,
                displayAge: "1个月",
                ageMonth: 1.086825823128327,
                weight: 0.79,
                bodyLength: 28.7,
                neckLength: 5.9,
                divingLength: 35.0,
                keelLength: 4.8,
                chestWidth: 10.2,
                chestDepth: 11.1,
                tibiaLength: 3.8,
                createTime: "2025-03-27T21:32:45.7411576",
              },
              {
                id: 5,
                ageStageCode: 4,
                displayAge: "1个月",
                ageMonth: 1.0391478777356458,
                weight: 0.8,
                bodyLength: 28.7,
                neckLength: 5.3,
                divingLength: 35.0,
                keelLength: 5.0,
                chestWidth: 10.1,
                chestDepth: 11.5,
                tibiaLength: 3.6,
                createTime: "2025-03-27T21:32:45.7421561",
              },
              {
                id: 6,
                ageStageCode: 4,
                displayAge: "1个月",
                ageMonth: 1.050428414345838,
                weight: 0.77,
                bodyLength: 27.3,
                neckLength: 4.4,
                divingLength: 35.0,
                keelLength: 3.6,
                chestWidth: 10.1,
                chestDepth: 11.4,
                tibiaLength: 4.5,
                createTime: "2025-03-27T21:32:45.7421561",
              },
              {
                id: 7,
                ageStageCode: 4,
                displayAge: "1个月",
                ageMonth: 1.05229069972371,
                weight: 0.8,
                bodyLength: 29.4,
                neckLength: 5.5,
                divingLength: 35.0,
                keelLength: 5.1,
                chestWidth: 10.1,
                chestDepth: 11.1,
                tibiaLength: 3.3,
                createTime: "2025-03-27T21:32:45.7421561",
              },
            ],
          };
          
          this.handlePredictionResponse(mockData);
          this.showResults = true;
          this.$message.success('预测完成（使用模拟数据）');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    // 处理预测响应
    handlePredictionResponse(data) {
      if (!data) {
        console.error('没有返回数据');
        return;
      }
      
      // 解析分析数据
      const analysis = data.analysis || {};
      
      // 更新评分和原因
      this.analysisScore = analysis.score || 0;
      this.scoreReasons = analysis.scoreReason || [];
      
      // 更新异常鸭子信息
      this.abnormalDucks = analysis.abnormalDucks || [];
      
      // 更新建议
      this.suggestions = analysis.suggestions || {
        nutrition: [],
        environment: [],
        disease: [],
        monitoring: []
      };
      
      // 更新总结
      this.summary = analysis.summary || {
        strengths: [],
        risks: [],
        priorityActions: []
      };
      
      // 更新鸭子数据
      this.duckData = data.ducks || [];
    },
    
    // 获取指标值
    getMetricValue(duck, metric) {
      if (!duck) return '0';
      
      let value = 0;
      switch(metric.key) {
        case 'weight': value = duck.weight; break;
        case 'bodyLength': value = duck.bodyLength; break;
        case 'neckLength': value = duck.neckLength; break;
        case 'divingLength': value = duck.divingLength; break;
        case 'keelLength': value = duck.keelLength; break;
        case 'chestWidth': value = duck.chestWidth; break;
        case 'chestDepth': value = duck.chestDepth; break;
        case 'tibiaLength': value = duck.tibiaLength; break;
        default: value = 0;
      }
      
      return value.toFixed(1);
    },
    
    // 获取指标数值
    getMetricValueNumber(duck, metric) {
      if (!duck) return 0;
      
      let value = 0;
      switch(metric.key) {
        case 'weight': value = duck.weight; break;
        case 'bodyLength': value = duck.bodyLength; break;
        case 'neckLength': value = duck.neckLength; break;
        case 'divingLength': value = duck.divingLength; break;
        case 'keelLength': value = duck.keelLength; break;
        case 'chestWidth': value = duck.chestWidth; break;
        case 'chestDepth': value = duck.chestDepth; break;
        case 'tibiaLength': value = duck.tibiaLength; break;
        default: value = 0;
      }
      
      return value;
    },
    
    // 获取区间段宽度百分比
    getRangeSegmentWidth(metric, segment) {
      const totalRange = metric.maxRange - metric.minRange;
      
      switch(segment) {
        case 'low':
          return ((metric.min - metric.minRange) / totalRange) * 100;
        case 'normal':
          return ((metric.max - metric.min) / totalRange) * 100;
        case 'high':
          return ((metric.maxRange - metric.max) / totalRange) * 100;
        default:
          return 0;
      }
    },
    
    // 获取当前值位置百分比
    getValuePosition(duck, metric) {
      const value = this.getMetricValueNumber(duck, metric);
      const totalRange = metric.maxRange - metric.minRange;
      const position = ((value - metric.minRange) / totalRange) * 100;
      
      // 确保位置在0-100之间
      return Math.max(0, Math.min(100, position));
    },
    
    // 获取当前值状态类名
    getValueClass(duck, metric) {
      const value = this.getMetricValueNumber(duck, metric);
      
      if (value < metric.min) {
        return 'value-low';
      } else if (value > metric.max) {
        return 'value-high';
      } else {
        return 'value-normal';
      }
    },
    
    // 获取评分等级类名
    getScoreClass(score) {
      if (score >= 8) {
        return 'score-high';
      } else if (score >= 6) {
        return 'score-medium';
      } else {
        return 'score-low';
      }
    },
    
    // 下载模板
    downloadTemplate() {
      // 创建一个新的JSZip实例
      const zip = new JSZip();
      
      // 添加示例图片到ZIP
      const sampleImages = [
        { name: '1_1_DepthCamera.png', data: this.createSampleImage() },
        { name: '1_1_SideViewCamera.png', data: this.createSampleImage() },
        { name: '1_2_TopViewCamera.png', data: this.createSampleImage() },
        { name: '65_1_DepthCamera.png', data: this.createSampleImage() },
        { name: '65_3_SideViewCamera.png', data: this.createSampleImage() },
        { name: '65_7_TopViewCamera.png', data: this.createSampleImage() },
        { name: '71_1_DepthCamera.png', data: this.createSampleImage() },
        { name: '71_1_SideViewCamera.png', data: this.createSampleImage() },
        { name: '71_1_TopViewCamera.png', data: this.createSampleImage() }
      ];
      
      sampleImages.forEach(img => {
        zip.file(img.name, img.data, { binary: true });
      });
      
      // 生成ZIP文件并下载
      zip.generateAsync({ type: 'blob' })
        .then(content => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = 'measurement_template.zip';
          link.click();
        });
    },
    
    // 创建示例图片
    createSampleImage() {
      // 创建一个简单的1x1像素图片数据
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    }
  }
};
</script>

<style scoped>
.measurement-prediction {
  padding: 20px;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2e7d32;
  padding: 15px 20px;
  color: white;
  border-radius: 4px;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
}

/* 上传类型选择器 */
.upload-type-selector {
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

.template-info {
  background-color: #f0f9eb;
  border: 1px solid #e1f3d8;
  border-radius: 4px;
  padding: 15px 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.template-title {
  display: flex;
  align-items: center;
  color: #67c23a;
  font-weight: bold;
  margin-bottom: 10px;
}

.template-title i {
  margin-right: 8px;
}

.template-description {
  font-size: 14px;
  line-height: 1.6;
}

.template-description pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  margin: 10px 0;
}

.template-description ul {
  padding-left: 20px;
  margin: 10px 0;
}

.upload-container {
  margin-bottom: 30px;
}

.upload-area {
  border: 2px dashed #4caf50;
  border-radius: 4px;
  padding: 30px;
  background-color: #fff;
  position: relative;
}

.upload-content {
  text-align: center;
  padding: 20px 0;
}

.upload-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.upload-desc {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

.upload-tip {
  font-size: 14px;
  color: #888;
}

.file-list {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.file-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #666;
}

.file-item i {
  margin-right: 8px;
  color: #4caf50;
}

.upload-progress {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.progress-text {
  margin-bottom: 10px;
  color: #333;
  font-weight: 500;
}

.predict-btn {
  display: block;
  width: 100%;
  margin-top: 20px;
  height: 45px;
  font-size: 16px;
  background-color: #2e7d32;
  border-color: #2e7d32;
}

/* ZIP验证状态 */
.zip-validation {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.validation-status {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}

.validation-status.valid {
  background-color: #f0f9eb;
  color: #67c23a;
}

.validation-status.invalid {
  background-color: #fef0f0;
  color: #f56c6c;
}

.validation-status i {
  margin-right: 8px;
  font-size: 16px;
}

/* 结果容器 */
.result-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-top: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.result-header h3 {
  font-size: 22px;
  color: #333;
  margin: 0;
}

.score-display {
  display: flex;
  align-items: center;
}

.score-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.score-circle.score-high {
  background-color: #67c23a;
}

.score-circle.score-medium {
  background-color: #e6a23c;
}

.score-circle.score-low {
  background-color: #f56c6c;
}

.score-value {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.score-text {
  display: flex;
  flex-direction: column;
}

.score-label {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.score-desc {
  font-size: 14px;
  color: #666;
}

/* 测量图表 */
.measurement-charts {
  margin-bottom: 30px;
}

.measurement-charts h4 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.chart-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.duck-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.duck-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.duck-weight {
  font-size: 14px;
  color: #666;
  background-color: #e1f3d8;
  padding: 4px 8px;
  border-radius: 4px;
}

.bar-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.bar-chart-item {
  background-color: white;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.metric-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.metric-chart {
  position: relative;
}

.metric-range-bar {
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  position: relative;
  margin-bottom: 20px;
}

.range-segment {
  height: 100%;
}

.range-segment.low {
  background-color: #ffecec;
}

.range-segment.normal {
  background-color: #f0f9eb;
}

.range-segment.high {
  background-color: #fdf6ec;
}

.current-value-marker {
  position: absolute;
  top: -10px;
  transform: translateX(-50%);
  z-index: 2;
}

.marker-line {
  width: 2px;
  height: 32px;
  background-color: #409EFF;
}

.marker-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #409EFF;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.current-value-marker.value-low .marker-line,
.current-value-marker.value-low .marker-value {
  background-color: #f56c6c;
}

.current-value-marker.value-normal .marker-line,
.current-value-marker.value-normal .marker-value {
  background-color: #67c23a;
}

.current-value-marker.value-high .marker-line,
.current-value-marker.value-high .marker-value {
  background-color: #e6a23c;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.range-standard {
  text-align: center;
  color: #67c23a;
  font-weight: bold;
}

/* 评估部分 */
.evaluation-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
}

.evaluation-section h3 {
  color: #2e7d32;
  font-size: 20px;
  margin-bottom: 15px;
}

.evaluation-score {
  margin-bottom: 20px;
}

.score-label {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.score-reasons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-reason {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.score-reason i {
  color: #e6a23c;
  margin-right: 8px;
}

/* 异常指标 */
.abnormal-metrics {
  margin-bottom: 30px;
}

.abnormal-metrics h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
}

.abnormal-metrics-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.abnormal-item {
  display: flex;
  background-color: #fef0f0;
  border-radius: 6px;
  padding: 12px;
}

.abnormal-icon {
  margin-right: 10px;
  color: #f56c6c;
  font-size: 18px;
}

.abnormal-content {
  flex: 1;
}

.abnormal-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.abnormal-detail {
  font-size: 12px;
  color: #666;
}

.abnormal-value {
  color: #f56c6c;
  font-weight: bold;
}

/* 建议部分 */
.suggestions-section {
  margin-bottom: 30px;
}

.suggestions-section h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
}

.suggestions-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.suggestion-category {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.suggestion-category-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.suggestion-category-title i {
  margin-right: 8px;
  color: #2e7d32;
}

.suggestion-list {
  padding-left: 20px;
  margin: 0;
}

.suggestion-list li {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.5;
}

/* 优势与风险 */
.strengths-risks-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.strengths-container, .risks-container {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.strengths-container h4, .risks-container h4 {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.strengths-container h4 i {
  color: #67c23a;
  margin-right: 8px;
}

.risks-container h4 i {
  color: #f56c6c;
  margin-right: 8px;
}

.strengths-list, .risks-list {
  padding-left: 20px;
  margin: 0;
}

.strengths-list li, .risks-list li {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.5;
}

/* 优先行动 */
.priority-actions {
  margin-bottom: 20px;
}

.priority-actions h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
}

.priority-actions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.priority-action-item {
  display: flex;
  align-items: flex-start;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.priority-number {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #2e7d32;
  color: white;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

.priority-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

/* 预览图片样式 */
.preview-dialog .preview-image {
  max-width: 100%;
  max-height: 70vh;
  display: block;
  margin: 0 auto;
}

/* 响应式布局 */
@media (max-width: 992px) {
  .bar-charts {
    grid-template-columns: 1fr;
  }
  
  .abnormal-metrics-list {
    grid-template-columns: 1fr;
  }
  
  .suggestions-container {
    grid-template-columns: 1fr;
  }
  
  .strengths-risks-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header h2 {
    margin-bottom: 10px;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .score-display {
    margin-top: 15px;
  }
}
</style>