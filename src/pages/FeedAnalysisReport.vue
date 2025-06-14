<template>
  <div class="feed-analysis-report">
    <!-- 报告头部 -->
    <div class="report-header">
      <h2>{{ parsedReport.title }}</h2>
      <div class="report-meta">
        <span class="report-date">{{ formatDate(new Date()) }}</span>
        <span class="report-status">{{ reportData.message || '分析成功' }}</span>
      </div>
    </div>

    <!-- 体征分析部分 -->
    <div class="report-section" v-if="parsedReport.physicalAnalysis.length > 0">
      <div class="section-header">
        <h3>个体体征分析</h3>
        <div class="section-icon">
          <i class="el-icon-data-analysis"></i>
        </div>
      </div>
      <div class="section-content">
        <p class="section-intro">根据实测数据和行业标准：</p>
        <div class="metrics-grid">
          <div class="metric-item" v-for="(metric, index) in parsedReport.physicalAnalysis" :key="index">
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-note" v-if="metric.note">{{ metric.note }}</div>
            <div class="metric-conclusion" v-if="metric.conclusion">{{ metric.conclusion }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 配方设计原则 -->
    <div class="report-section" v-if="parsedReport.designPrinciples">
      <div class="section-header">
        <h3>配方设计原则</h3>
        <div class="section-icon">
          <i class="el-icon-set-up"></i>
        </div>
      </div>
      <div class="section-content">
        <p>{{ parsedReport.designPrinciples }}</p>
      </div>
    </div>

    <!-- 饲料方案对比 -->
    <div class="report-section" v-if="parsedReport.plans.length > 0">
      <div class="section-header">
        <h3>饲料方案对比</h3>
        <div class="section-icon">
          <i class="el-icon-pie-chart"></i>
        </div>
      </div>
      <div class="section-content">
        <div class="plans-comparison">
          <div class="comparison-charts">
            <div class="chart-container">
              <h4>方案对比</h4>
              <div ref="planComparisonChart" class="chart"></div>
            </div>
            <div class="chart-container">
              <h4>成本效益分析</h4>
              <div ref="costBenefitChart" class="chart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 饲料方案详情 -->
    <div class="plans-container" v-if="parsedReport.plans.length > 0">
      <!-- 动态渲染每个方案 -->
      <div class="plan-card" v-for="(plan, index) in parsedReport.plans" :key="index">
        <div class="plan-header">
          <div class="plan-badge">方案{{ index + 1 }}</div>
          <h3>{{ plan.title.split('：')[1] || plan.title }}</h3>
        </div>
        <div class="plan-content">
          <div class="plan-section" v-if="plan.designIdeas.length > 0">
            <h4>设计思路</h4>
            <ul>
              <li v-for="(idea, ideaIndex) in plan.designIdeas" :key="ideaIndex">{{ idea }}</li>
            </ul>
          </div>
          <div class="plan-section" v-if="plan.indicators.length > 0">
            <h4>具体指标</h4>
            <div class="indicators-grid">
              <div class="indicator-item" v-for="(indicator, indIndex) in formatIndicators(plan.indicators)" :key="indIndex">
                <div class="indicator-label">{{ indicator.label }}</div>
                <div class="indicator-value">{{ indicator.value }}</div>
                <div class="indicator-note" v-if="indicator.note">{{ indicator.note }}</div>
              </div>
            </div>
          </div>
          <div class="plan-section" v-if="plan.economicAnalysis.length > 0">
            <h4>经济性分析</h4>
            <ul>
              <li v-for="(analysis, anaIndex) in plan.economicAnalysis" :key="anaIndex">{{ analysis }}</li>
            </ul>
          </div>
          <div class="plan-section" v-if="plan.materialAnalysis.length > 0">
            <h4>原料可行性分析</h4>
            <ul>
              <li v-for="(analysis, matIndex) in plan.materialAnalysis" :key="matIndex">{{ analysis }}</li>
            </ul>
          </div>
          <div class="plan-section" v-if="plan.seasonalAdjustment.length > 0">
            <h4>季节调整建议</h4>
            <ul>
              <li v-for="(adjustment, adjIndex) in plan.seasonalAdjustment" :key="adjIndex">{{ adjustment }}</li>
            </ul>
          </div>
          <div class="plan-section" v-if="plan.matchAnalysis">
            <h4>匹配度分析</h4>
            <p>{{ plan.matchAnalysis }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 执行建议 -->
    <div class="report-section" v-if="parsedReport.recommendations.length > 0">
      <div class="section-header">
        <h3>执行建议</h3>
        <div class="section-icon">
          <i class="el-icon-s-operation"></i>
        </div>
      </div>
      <div class="section-content">
        <div class="advice-container">
          <div class="advice-item" v-for="(recommendation, recIndex) in parsedReport.recommendations" :key="recIndex">
            <div class="advice-number">{{ recIndex + 1 }}</div>
            <div class="advice-content">
              <h4>{{ recommendation.title }}</h4>
              <ul>
                <li v-for="(item, itemIndex) in recommendation.items" :key="itemIndex">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 总结 -->
    <div class="report-section summary-section" v-if="parsedReport.summary">
      <div class="section-header">
        <h3>总结</h3>
        <div class="section-icon">
          <i class="el-icon-document-checked"></i>
        </div>
      </div>
      <div class="section-content">
        <p>{{ parsedReport.summary }}</p>
      </div>
    </div>

    <!-- 报告底部 -->
    <div class="report-footer">
      <div class="footer-info">
        <p>报告生成时间：{{ formatDate(new Date()) }}</p>
        <p>数据分析系统版本：v2.5.0</p>
      </div>
      <div class="footer-actions">
        <button class="action-button print-button" @click="printReport">
          <i class="el-icon-printer"></i> 打印报告
        </button>
        <button class="action-button export-button" @click="exportPDF">
          <i class="el-icon-download"></i> 导出PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
  name: 'FeedAnalysisReport',
  props: {
    reportData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      charts: []
    };
  },
  computed: {
    parsedReport() {
      if (!this.reportData || !this.reportData.data) {
        return {
          title: '',
          physicalAnalysis: [],
          designPrinciples: '',
          plans: [],
          recommendations: [],
          summary: ''
        };
      }
      
      return this.parseReportData(this.reportData.data);
    }
  },
  mounted() {
    this.initCharts();
  },
  updated() {
    // 确保在DOM更新后重新初始化图表
    this.$nextTick(() => {
      this.initCharts();
    });
  },
  beforeDestroy() {
    // 清理图表实例，避免内存泄漏
    this.disposeCharts();
  },
  methods: {
    parseReportData(data) {
      // 初始化结果对象
      const result = {
        title: '',
        physicalAnalysis: [],
        designPrinciples: '',
        plans: [],
        recommendations: [],
        summary: ''
      };
      
      // 分割报告文本为行
      const lines = data.split('\n');
      
      // 提取标题
      result.title = lines[0] || '饲料方案设计报告';
      
      let currentSection = '';
      let currentPlan = null;
      let currentRecommendation = null;
      
      // 解析每一行
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // 跳过空行
        if (!line) continue;
        
        // 检测章节标题
        if (line.startsWith('--')) {
          const sectionTitle = line.replace('--', '').trim();
          
          if (sectionTitle.includes('个体体征分析')) {
            currentSection = 'physicalAnalysis';
          } else if (sectionTitle.includes('配方设计原则')) {
            currentSection = 'designPrinciples';
          } else if (sectionTitle.includes('方案一') || sectionTitle.includes('方案二') || sectionTitle.includes('方案三')) {
            currentSection = 'plans';
            currentPlan = {
              title: sectionTitle,
              designIdeas: [],
              indicators: [],
              economicAnalysis: [],
              materialAnalysis: [],
              seasonalAdjustment: [],
              matchAnalysis: ''
            };
            result.plans.push(currentPlan);
          } else if (sectionTitle.includes('执行建议')) {
            currentSection = 'recommendations';
          } else if (sectionTitle.includes('总结')) {
            currentSection = 'summary';
          } else if (currentSection === 'plans' && currentPlan) {
            // 处理方案内的子章节
            if (sectionTitle.includes('设计思路')) {
              // 下一行是设计思路内容
              if (i + 1 < lines.length) {
                currentPlan.designIdeas.push(lines[i + 1].trim());
                i++; // 跳过下一行
              }
            } else if (sectionTitle.includes('原料组成')) {
              // 收集原料组成信息到指标中
              let j = i + 1;
              while (j < lines.length && !lines[j].trim().startsWith('--') && lines[j].trim()) {
                currentPlan.indicators.push(lines[j].trim());
                j++;
              }
              i = j - 1; // 调整循环索引
            } else if (sectionTitle.includes('营养指标')) {
              // 收集营养指标信息
              let j = i + 1;
              while (j < lines.length && !lines[j].trim().startsWith('--') && lines[j].trim()) {
                currentPlan.indicators.push(lines[j].trim());
                j++;
              }
              i = j - 1; // 调整循环索引
            } else if (sectionTitle.includes('成本控制') || sectionTitle.includes('经济性')) {
              // 收集经济性分析信息
              let j = i + 1;
              while (j < lines.length && !lines[j].trim().startsWith('--') && lines[j].trim()) {
                currentPlan.economicAnalysis.push(lines[j].trim());
                j++;
              }
              i = j - 1; // 调整循环索引
            } else if (sectionTitle.includes('预期效益')) {
              // 收集预期效益信息到经济性分析
              let j = i + 1;
              while (j < lines.length && !lines[j].trim().startsWith('--') && lines[j].trim()) {
                currentPlan.economicAnalysis.push(lines[j].trim());
                j++;
              }
              i = j - 1; // 调整循环索引
            } else if (sectionTitle.includes('原料采购可行性')) {
              // 收集原料采购可行性信息
              let j = i + 1;
              while (j < lines.length && !lines[j].trim().startsWith('--') && lines[j].trim()) {
                currentPlan.materialAnalysis.push(lines[j].trim());
                j++;
              }
              i = j - 1; // 调整循环索引
            } else if (sectionTitle.includes('季节调整建议')) {
              // 收集季节调整建议信息
              let j = i + 1;
              while (j < lines.length && !lines[j].trim().startsWith('--') && lines[j].trim()) {
                currentPlan.seasonalAdjustment.push(lines[j].trim());
                j++;
              }
              i = j - 1; // 调整循环索引
            } else if (sectionTitle.includes('与生长阶段匹配度分析')) {
              // 收集匹配度分析信息
              let j = i + 1;
              let matchAnalysis = '';
              while (j < lines.length && !lines[j].trim().startsWith('--') && lines[j].trim()) {
                matchAnalysis += lines[j].trim() + ' ';
                j++;
              }
              currentPlan.matchAnalysis = matchAnalysis.trim();
              i = j - 1; // 调整循环索引
            }
          }
          
          continue;
        }
        
        // 根据当前章节处理内容
        switch (currentSection) {
          case 'physicalAnalysis':
            if (line.includes('：')) {
              const parts = line.split('：');
              if (parts.length >= 2) {
                const label = parts[0].trim();
                const content = parts[1].trim();
                
                // 进一步解析体征数据
                if (content.includes('（') && content.includes('）')) {
                  const valuePart = content.split('（')[0].trim();
                  const notePart = content.split('（')[1].replace('）', '').trim();
                  const conclusionPart = content.includes('表明') ? content.split('表明')[1].trim() : '';
                  
                  result.physicalAnalysis.push({
                    label,
                    value: valuePart,
                    note: notePart,
                    conclusion: conclusionPart
                  });
                } else {
                  result.physicalAnalysis.push({
                    label,
                    value: content,
                    note: '',
                    conclusion: ''
                  });
                }
              }
            }
            break;
            
          case 'designPrinciples':
            result.designPrinciples += line + ' ';
            break;
            
          case 'plans':
            if (currentPlan) {
              if (line.startsWith('设计思路')) {
                // 设计思路标题行，下一行开始是内容
                let j = i + 1;
                while (j < lines.length && lines[j].trim() && !lines[j].includes('原料组成') && !lines[j].startsWith('--')) {
                  const idea = lines[j].trim();
                  if (idea) currentPlan.designIdeas.push(idea);
                  j++;
                }
                i = j - 1; // 调整循环索引
              } else if (line.startsWith('原料组成')) {
                // 原料组成标题行，下一行开始是内容
                let j = i + 1;
                while (j < lines.length && lines[j].trim() && !lines[j].includes('营养指标') && !lines[j].startsWith('--')) {
                  const indicator = lines[j].trim();
                  if (indicator) currentPlan.indicators.push(indicator);
                  j++;
                }
                i = j - 1; // 调整循环索引
              } else if (line.startsWith('营养指标')) {
                // 营养指标标题行，下一行开始是内容
                let j = i + 1;
                while (j < lines.length && lines[j].trim() && !lines[j].includes('成本控制') && !lines[j].includes('经济性') && !lines[j].startsWith('--')) {
                  const indicator = lines[j].trim();
                  if (indicator) currentPlan.indicators.push(indicator);
                  j++;
                }
                i = j - 1; // 调整循环索引
              } else if (line.startsWith('成本控制') || line.startsWith('经济性')) {
                // 成本控制标题行，下一行开始是内容
                let j = i + 1;
                while (j < lines.length && lines[j].trim() && !lines[j].includes('预期效益') && !lines[j].startsWith('--')) {
                  const analysis = lines[j].trim();
                  if (analysis) currentPlan.economicAnalysis.push(analysis);
                  j++;
                }
                i = j - 1; // 调整循环索引
              } else if (line.startsWith('预期效益')) {
                // 预期效益标题行，下一行开始是内容
                let j = i + 1;
                while (j < lines.length && lines[j].trim() && !lines[j].includes('原料采购可行性') && !lines[j].startsWith('--')) {
                  const analysis = lines[j].trim();
                  if (analysis) currentPlan.economicAnalysis.push(analysis);
                  j++;
                }
                i = j - 1; // 调整循环索引
              }
            }
            break;
            
          case 'recommendations':
            if (line.match(/^\d+\./)) {
              // 新的建议项
              currentRecommendation = {
                title: line.replace(/^\d+\./, '').trim(),
                items: []
              };
              result.recommendations.push(currentRecommendation);
            } else if (currentRecommendation && line.trim()) {
              // 建议项的内容
              currentRecommendation.items.push(line.trim());
            }
            break;
            
          case 'summary':
            result.summary += line + ' ';
            break;
        }
      }
      
      return result;
    },
    
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    formatIndicators(indicators) {
      return indicators.map(indicator => {
        // 尝试分割标签和值
        if (indicator.includes('：')) {
          const parts = indicator.split('：');
          return {
            label: parts[0].trim(),
            value: parts[1].trim(),
            note: ''
          };
        } else if (indicator.includes(':')) {
          const parts = indicator.split(':');
          return {
            label: parts[0].trim(),
            value: parts[1].trim(),
            note: ''
          };
        } else {
          // 尝试提取括号中的注释
          let note = '';
          let value = indicator;
          
          if (indicator.includes('（') && indicator.includes('）')) {
            const notePart = indicator.match(/（(.+?)）/);
            if (notePart && notePart[1]) {
              note = notePart[1];
              value = indicator.replace(/（(.+?)）/, '').trim();
            }
          }
          
          return {
            label: value,
            value: '',
            note: note
          };
        }
      });
    },
    
    disposeCharts() {
      // 销毁所有图表实例
      if (this.charts && this.charts.length) {
        this.charts.forEach(chart => {
          if (chart && !chart.isDisposed()) {
            chart.dispose();
          }
        });
        this.charts = [];
      }
    },
    
    initCharts() {
      // 清理现有图表
      this.disposeCharts();
      
      // 初始化新图表
      this.$nextTick(() => {
        this.renderPlanComparisonChart();
        this.renderCostBenefitChart();
      });
    },
    
    renderPlanComparisonChart() {
      const chartDom = this.$refs.planComparisonChart;
      if (!chartDom) return;
      
      const chart = echarts.init(chartDom);
      
      // 从解析的数据中提取计划名称
      const planNames = this.parsedReport.plans.map(plan => {
        const titleParts = plan.title.split('：');
        return titleParts.length > 1 ? titleParts[1] : plan.title;
      });
      
      // 动态生成图表数据
      const proteinData = [];
      const energyData = [];
      const costData = [];
      
      this.parsedReport.plans.forEach(plan => {
        // 尝试从指标中提取蛋白质数据
        let proteinValue = 0;
        let energyValue = 0;
        let costValue = 0;
        
        plan.indicators.forEach(indicator => {
          if (indicator.includes('蛋白') || indicator.includes('动物蛋白')) {
            // 尝试提取百分比
            const match = indicator.match(/(\d+(?:\.\d+)?)%/);
            if (match) {
              proteinValue = parseFloat(match[1]);
            } else {
              // 如果没有百分比，给一个相对值
              proteinValue = plan.title.includes('一') ? 100 : (plan.title.includes('二') ? 60 : 80);
            }
          }
          
          if (indicator.includes('代谢能') || indicator.includes('MJ/kg')) {
            // 尝试提取能量值
            const match = indicator.match(/(\d+(?:\.\d+)?)/);
            if (match) {
              energyValue = parseFloat(match[1]);
            } else {
              // 如果没有具体值，给一个相对值
              energyValue = plan.title.includes('一') ? 110 : (plan.title.includes('二') ? 90 : 100);
            }
          }
        });
        
        // 从经济性分析或成本控制中提取成本数据
        plan.indicators.concat(plan.economicAnalysis).forEach(item => {
          if (item.includes('成本')) {
            if (item.includes('下降')) {
              // 成本下降，值应该低
              const match = item.match(/(\d+(?:\.\d+)?)%/);
              if (match) {
                costValue = 100 - parseFloat(match[1]);
              } else {
                costValue = 80; // 默认值
              }
            } else if (item.includes('上浮')) {
              // 成本上浮，值应该高
              const match = item.match(/(\d+(?:\.\d+)?)%/);
              if (match) {
                costValue = 100 + parseFloat(match[1]);
              } else {
                costValue = 120; // 默认值
              }
            }
          }
        });
        
        // 如果没有找到值，使用默认值
        if (proteinValue === 0) proteinValue = plan.title.includes('一') ? 100 : (plan.title.includes('二') ? 60 : 80);
        if (energyValue === 0) energyValue = plan.title.includes('一') ? 110 : (plan.title.includes('二') ? 90 : 100);
        if (costValue === 0) costValue = plan.title.includes('一') ? 120 : (plan.title.includes('二') ? 80 : 100);
        
        proteinData.push(proteinValue);
        energyData.push(energyValue);
        costData.push(costValue);
      });
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['蛋白质含量', '能量水平', '成本指数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: planNames
        },
        yAxis: {
          type: 'value',
          name: '相对值(%)',
          min: 0,
          max: 120
        },
        series: [
          {
            name: '蛋白质含量',
            type: 'bar',
            data: proteinData,
            color: '#67C23A'
          },
          {
            name: '能量水平',
            type: 'bar',
            data: energyData,
            color: '#409EFF'
          },
          {
            name: '成本指数',
            type: 'bar',
            data: costData,
            color: '#E6A23C'
          }
        ]
      };
      
      chart.setOption(option);
      this.charts.push(chart);
      
      // 添加窗口大小变化监听
      window.addEventListener('resize', () => {
        chart.resize();
      });
    },
    
    renderCostBenefitChart() {
      const chartDom = this.$refs.costBenefitChart;
      if (!chartDom) return;
      
      const chart = echarts.init(chartDom);
      
      // 从解析的数据中提取计划名称
      const planNames = this.parsedReport.plans.map(plan => {
        const titleParts = plan.title.split('：');
        return titleParts.length > 1 ? titleParts[1] : plan.title;
      });
      
      // 动态生成图表数据
      const costData = [];
      const benefitData = [];
      const roiData = [];
      
      this.parsedReport.plans.forEach(plan => {
        // 提取成本数据
        let costValue = 0;
        let benefitValue = 0;
        let roiValue = 0;
        
        // 从经济性分析或成本控制中提取数据
        plan.indicators.concat(plan.economicAnalysis).forEach(item => {
          if (item.includes('成本')) {
            if (item.includes('下降')) {
              costValue = 80; // 成本下降
            } else if (item.includes('上浮')) {
              costValue = 120; // 成本上浮
            }
          }
          
          if (item.includes('效益') || item.includes('提升')) {
            benefitValue = plan.title.includes('一') ? 110 : (plan.title.includes('二') ? 85 : 105);
          }
        });
        
        // 计算投资回报率 (ROI)
        if (costValue > 0 && benefitValue > 0) {
          roiValue = (benefitValue / costValue) * 20; // 简化的ROI计算
        } else {
          roiValue = plan.title.includes('一') ? 18 : (plan.title.includes('二') ? 22 : 20);
        }
        
        // 如果没有找到值，使用默认值
        if (costValue === 0) costValue = plan.title.includes('一') ? 120 : (plan.title.includes('二') ? 80 : 100);
        if (benefitValue === 0) benefitValue = plan.title.includes('一') ? 110 : (plan.title.includes('二') ? 85 : 105);
        if (roiValue === 0) roiValue = plan.title.includes('一') ? 18 : (plan.title.includes('二') ? 22 : 20);
        
        costData.push(costValue);
        benefitData.push(benefitValue);
        roiData.push(roiValue);
      });
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['成本', '效益', '投资回报率']
        },
        xAxis: [
          {
            type: 'category',
            data: planNames,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '成本/效益',
            min: 0,
            max: 120,
            interval: 20
          },
          {
            type: 'value',
            name: '投资回报率(%)',
            min: 0,
            max: 30,
            interval: 5
          }
        ],
        series: [
          {
            name: '成本',
            type: 'bar',
            data: costData,
            color: '#F56C6C'
          },
          {
            name: '效益',
            type: 'bar',
            data: benefitData,
            color: '#67C23A'
          },
          {
            name: '投资回报率',
            type: 'line',
            yAxisIndex: 1,
            data: roiData,
            color: '#409EFF'
          }
        ]
      };
      
      chart.setOption(option);
      this.charts.push(chart);
      
      // 添加窗口大小变化监听
      window.addEventListener('resize', () => {
        chart.resize();
      });
    },
    
    printReport() {
      window.print();
    },
    
     async exportPDF() {
      if (this.isExporting) return;
      
      this.isExporting = true;
      
      try {
        // 创建PDF文档
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4'
        });
        
        // 加载中文字体
        try {
          // 加载中文字体 - 确保在public目录下有这个字体文件
          const fontResponse = await fetch('/fonts/mysh.ttf');
          if (!fontResponse.ok) throw new Error('字体加载失败');
          
          const fontArrayBuffer = await fontResponse.arrayBuffer();
          
          // 添加字体到PDF
          pdf.addFileToVFS('msyh.ttf', this.arrayBufferToBase64(fontArrayBuffer));
          pdf.addFont('msyh.ttf', 'msyh', 'normal');
          pdf.setFont('msyh');
        } catch (fontError) {
          console.error('字体加载错误:', fontError);
          // 如果自定义字体加载失败，使用标准字体
        }
        
        // 页面尺寸
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // 设置字体大小
        pdf.setFontSize(18);
        pdf.setTextColor(0, 149, 94);
        
        // 添加标题
        pdf.text(this.parsedReport.title || '饲料方案设计报告', pageWidth / 2, 20, { align: 'center' });
        
        // 添加日期
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`生成日期: ${this.formatDate(new Date())}`, pageWidth / 2, 28, { align: 'center' });
        
        // 当前垂直位置
        let yPos = 40;
        
        // 添加体征分析部分
        if (this.parsedReport.physicalAnalysis.length > 0) {
          yPos = this.addSectionToPDF(pdf, '个体体征分析', pageWidth, yPos);
          
          // 添加体征分析内容
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          
          this.parsedReport.physicalAnalysis.forEach((item, index) => {
            const text = `${item.label}: ${item.value}${item.note ? ` (${item.note})` : ''}`;
            
            // 检查是否需要分页
            if (yPos > pageHeight - 20) {
              pdf.addPage();
              yPos = 20;
            }
            
            pdf.text(text, 20, yPos);
            yPos += 8;
            
            if (item.conclusion) {
              pdf.setFontSize(9);
              pdf.setTextColor(100, 100, 100);
              pdf.text(`结论: ${item.conclusion}`, 25, yPos);
              pdf.setFontSize(10);
              pdf.setTextColor(0, 0, 0);
              yPos += 8;
            }
          });
          
          yPos += 10;
        }
        
        // 添加配方设计原则
        if (this.parsedReport.designPrinciples) {
          yPos = this.addSectionToPDF(pdf, '配方设计原则', pageWidth, yPos);
          
          // 添加设计原则内容
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          
          // 处理长文本换行
          const splitText = pdf.splitTextToSize(this.parsedReport.designPrinciples, pageWidth - 40);
          
          // 检查是否需要分页
          if (yPos + splitText.length * 6 > pageHeight - 20) {
            pdf.addPage();
            yPos = 20;
          }
          
          pdf.text(splitText, 20, yPos);
          yPos += splitText.length * 6 + 10;
        }
        
        // 添加饲料方案
        if (this.parsedReport.plans.length > 0) {
          // 为每个方案创建一个新页面
          this.parsedReport.plans.forEach((plan, planIndex) => {
            if (planIndex > 0 || yPos > pageHeight - 100) {
              pdf.addPage();
              yPos = 20;
            }
            
            // 方案标题
            pdf.setFontSize(14);
            pdf.setTextColor(0, 149, 94);
            pdf.text(plan.title, 20, yPos);
            yPos += 10;
            
            // 设计思路
            if (plan.designIdeas.length > 0) {
              pdf.setFontSize(12);
              pdf.setTextColor(0, 0, 0);
              pdf.text('设计思路:', 20, yPos);
              yPos += 8;
              
              plan.designIdeas.forEach((idea, index) => {
                // 检查是否需要分页
                if (yPos > pageHeight - 20) {
                  pdf.addPage();
                  yPos = 20;
                }
                
                pdf.setFontSize(10);
                pdf.text(`• ${idea}`, 25, yPos);
                yPos += 6;
              });
              
              yPos += 5;
            }
            
            // 指标
            if (plan.indicators.length > 0) {
              // 检查是否需要分页
              if (yPos > pageHeight - 50) {
                pdf.addPage();
                yPos = 20;
              }
              
              pdf.setFontSize(12);
              pdf.setTextColor(0, 0, 0);
              pdf.text('具体指标:', 20, yPos);
              yPos += 8;
              
              const formattedIndicators = this.formatIndicators(plan.indicators);
              formattedIndicators.forEach((indicator, index) => {
                // 检查是否需要分页
                if (yPos > pageHeight - 20) {
                  pdf.addPage();
                  yPos = 20;
                }
                
                pdf.setFontSize(10);
                const text = indicator.label + (indicator.value ? `: ${indicator.value}` : '') + (indicator.note ? ` (${indicator.note})` : '');
                pdf.text(text, 25, yPos);
                yPos += 6;
              });
              
              yPos += 5;
            }
            
            // 经济性分析
            if (plan.economicAnalysis.length > 0) {
              // 检查是否需要分页
              if (yPos > pageHeight - 50) {
                pdf.addPage();
                yPos = 20;
              }
              
              pdf.setFontSize(12);
              pdf.setTextColor(0, 0, 0);
              pdf.text('经济性分析:', 20, yPos);
              yPos += 8;
              
              plan.economicAnalysis.forEach((analysis, index) => {
                // 检查是否需要分页
                if (yPos > pageHeight - 20) {
                  pdf.addPage();
                  yPos = 20;
                }
                
                pdf.setFontSize(10);
                pdf.text(`• ${analysis}`, 25, yPos);
                yPos += 6;
              });
              
              yPos += 5;
            }
            
            // 原料可行性分析
            if (plan.materialAnalysis.length > 0) {
              // 检查是否需要分页
              if (yPos > pageHeight - 50) {
                pdf.addPage();
                yPos = 20;
              }
              
              pdf.setFontSize(12);
              pdf.setTextColor(0, 0, 0);
              pdf.text('原料可行性分析:', 20, yPos);
              yPos += 8;
              
              plan.materialAnalysis.forEach((analysis, index) => {
                // 检查是否需要分页
                if (yPos > pageHeight - 20) {
                  pdf.addPage();
                  yPos = 20;
                }
                
                pdf.setFontSize(10);
                pdf.text(`• ${analysis}`, 25, yPos);
                yPos += 6;
              });
              
              yPos += 5;
            }
            
            // 季节调整建议
            if (plan.seasonalAdjustment.length > 0) {
              // 检查是否需要分页
              if (yPos > pageHeight - 50) {
                pdf.addPage();
                yPos = 20;
              }
              
              pdf.setFontSize(12);
              pdf.setTextColor(0, 0, 0);
              pdf.text('季节调整建议:', 20, yPos);
              yPos += 8;
              
              plan.seasonalAdjustment.forEach((adjustment, index) => {
                // 检查是否需要分页
                if (yPos > pageHeight - 20) {
                  pdf.addPage();
                  yPos = 20;
                }
                
                pdf.setFontSize(10);
                pdf.text(`• ${adjustment}`, 25, yPos);
                yPos += 6;
              });
              
              yPos += 5;
            }
            
            // 匹配度分析
            if (plan.matchAnalysis) {
              // 检查是否需要分页
              if (yPos > pageHeight - 50) {
                pdf.addPage();
                yPos = 20;
              }
              
              pdf.setFontSize(12);
              pdf.setTextColor(0, 0, 0);
              pdf.text('匹配度分析:', 20, yPos);
              yPos += 8;
              
              // 处理长文本换行
              const splitText = pdf.splitTextToSize(plan.matchAnalysis, pageWidth - 45);
              
              pdf.setFontSize(10);
              pdf.text(splitText, 25, yPos);
              yPos += splitText.length * 6 + 5;
            }
          });
        }
        
        // 添加图表
        if (this.charts.length > 0) {
          pdf.addPage();
          yPos = 20;
          
          pdf.setFontSize(14);
          pdf.setTextColor(0, 149, 94);
          pdf.text('饲料方案对比图表', pageWidth / 2, yPos, { align: 'center' });
          yPos += 15;
          
          // 获取图表的canvas
          try {
            // 方案对比图表
            if (this.$refs.planComparisonChart) {
              const planChart = this.charts[0];
              const planCanvas = await this.chartToCanvas(planChart);
              
              const imgWidth = pageWidth - 40;
              const imgHeight = (planCanvas.height * imgWidth) / planCanvas.width;
              
              pdf.addImage(planCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 20, yPos, imgWidth, imgHeight);
              yPos += imgHeight + 15;
            }
            
            // 成本效益图表
            if (this.$refs.costBenefitChart && yPos < pageHeight - 100) {
              const costChart = this.charts[1];
              const costCanvas = await this.chartToCanvas(costChart);
              
              const imgWidth = pageWidth - 40;
              const imgHeight = (costCanvas.height * imgWidth) / costCanvas.width;
              
              // 如果图表太大，添加新页面
              if (yPos + imgHeight > pageHeight - 20) {
                pdf.addPage();
                yPos = 20;
              }
              
              pdf.addImage(costCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 20, yPos, imgWidth, imgHeight);
              yPos += imgHeight + 15;
            } else if (this.$refs.costBenefitChart) {
              pdf.addPage();
              yPos = 20;
              
              const costChart = this.charts[1];
              const costCanvas = await this.chartToCanvas(costChart);
              
              const imgWidth = pageWidth - 40;
              const imgHeight = (costCanvas.height * imgWidth) / costCanvas.width;
              
              pdf.addImage(costCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 20, yPos, imgWidth, imgHeight);
              yPos += imgHeight + 15;
            }
          } catch (chartError) {
            console.error('图表导出错误:', chartError);
          }
        }
        
        // 添加执行建议
        if (this.parsedReport.recommendations.length > 0) {
          pdf.addPage();
          yPos = 20;
          
          yPos = this.addSectionToPDF(pdf, '执行建议', pageWidth, yPos);
          
          this.parsedReport.recommendations.forEach((recommendation, index) => {
            // 检查是否需要分页
            if (yPos > pageHeight - 50) {
              pdf.addPage();
              yPos = 20;
            }
            
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`${index + 1}. ${recommendation.title}`, 20, yPos);
            yPos += 8;
            
            recommendation.items.forEach((item) => {
              // 检查是否需要分页
              if (yPos > pageHeight - 20) {
                pdf.addPage();
                yPos = 20;
              }
              
              pdf.setFontSize(10);
              pdf.text(`• ${item}`, 25, yPos);
              yPos += 6;
            });
            
            yPos += 5;
          });
        }
        
        // 添加总结
        if (this.parsedReport.summary) {
          // 检查是否需要分页
          if (yPos > pageHeight - 60) {
            pdf.addPage();
            yPos = 20;
          }
          
          yPos = this.addSectionToPDF(pdf, '总结', pageWidth, yPos);
          
          // 处理长文本换行
          const splitText = pdf.splitTextToSize(this.parsedReport.summary, pageWidth - 40);
          
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          pdf.text(splitText, 20, yPos);
        }
        
        // 添加页脚
        this.addFooterToPDF(pdf, pageWidth, pageHeight);
        
        // 保存文件
        const fileName = `饲料方案设计报告_${this.formatDate(new Date()).replace(/-/g, '')}.pdf`;
        pdf.save(fileName);
        
        // 显示成功消息
        this.$message ? this.$message.success('报告导出成功') : alert('报告导出成功');
        
      } catch (error) {
        console.error('PDF导出错误:', error);
        this.$message ? this.$message.error('报告导出失败') : alert('报告导出失败，请稍后重试');
      } finally {
        this.isExporting = false;
      }
    },
    
    // 辅助方法：添加章节标题到PDF
    addSectionToPDF(pdf, title, pageWidth, yPos) {
      pdf.setFontSize(14);
      pdf.setTextColor(0, 149, 94);
      pdf.text(title, 20, yPos);
      
      // 添加下划线
      pdf.setDrawColor(0, 149, 94);
      pdf.setLineWidth(0.5);
      pdf.line(20, yPos + 1, pageWidth - 20, yPos + 1);
      
      return yPos + 10;
    },
    
    // 辅助方法：添加页脚到PDF
    addFooterToPDF(pdf, pageWidth, pageHeight) {
      const totalPages = pdf.internal.getNumberOfPages();
      
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        
        // 页码
        pdf.text(`第 ${i} 页 / 共 ${totalPages} 页`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        
        // 版权信息
        pdf.text('饲料方案设计系统', pageWidth - 20, pageHeight - 10, { align: 'right' });
        
        // 生成日期
        pdf.text(`生成日期: ${this.formatDate(new Date())}`, 20, pageHeight - 10);
      }
    },
    
    // 辅助方法：将图表转换为Canvas
    async chartToCanvas(chart) {
      return new Promise((resolve, reject) => {
        try {
          // 获取图表的base64图片
          const base64 = chart.getDataURL({
            type: 'jpeg',
            pixelRatio: 2,
            backgroundColor: '#fff'
          });
          
          // 创建图片对象
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          
          img.onload = () => {
            // 创建canvas
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 绘制图片到canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            resolve(canvas);
          };
          
          img.onerror = (error) => {
            reject(error);
          };
          
          img.src = base64;
        } catch (error) {
          reject(error);
        }
      });
    },
    
    // 辅助方法：ArrayBuffer转Base64
    arrayBufferToBase64(buffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }
  }
};
</script>

<style scoped>
.feed-analysis-report {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.report-header {
  text-align: center;
  margin-bottom: 20px;
}

.report-header h2 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 10px;
}

.report-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 0.85em;
  color: #666;
  margin-top: 5px;
}

.report-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  overflow: hidden;
}

.section-header {
  background-color: #f7f7f7;
  color: #333;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}

.section-header h3 {
  font-size: 1.2em;
  margin: 0;
}

.section-icon i {
  font-size: 1.5em;
  color: #888;
}

.section-content {
  padding: 20px;
}

.section-intro {
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.metric-item {
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #eee;
  background-color: #f9f9f9;
}

.metric-label {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 1.1em;
  color: #4caf50;
}

.metric-note {
  font-size: 0.85em;
  color: #777;
  margin-top: 5px;
}

.metric-conclusion {
  font-style: italic;
  color: #555;
  margin-top: 5px;
}

.plans-comparison {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comparison-charts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart-container {
  flex: 1;
  min-width: 300px;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 10px;
}

.chart-container h4 {
  font-size: 1em;
  color: #444;
  margin-bottom: 10px;
}

.chart {
  width: 100%;
  height: 300px;
}

.plans-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plan-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.plan-header {
  background-color: #f7f7f7;
  color: #333;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #eee;
}

.plan-badge {
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8em;
}

.plan-header h3 {
  font-size: 1.1em;
  margin: 0;
}

.plan-content {
  padding: 20px;
}

.plan-section {
  margin-bottom: 20px;
}

.plan-section h4 {
  font-size: 1em;
  color: #444;
  margin-bottom: 10px;
}

.plan-section ul {
  list-style-type: disc;
  padding-left: 20px;
}

.plan-section li {
  color: #555;
  line-height: 1.6;
}

.indicators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.indicator-item {
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.indicator-label {
  font-weight: bold;
  color: #333;
  font-size: 0.9em;
  margin-bottom: 3px;
}

.indicator-value {
  color: #555;
  font-size: 0.85em;
}

.indicator-note {
  font-style: italic;
  color: #777;
  font-size: 0.75em;
  margin-top: 3px;
}

.advice-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.advice-item {
  display: flex;
  gap: 10px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 6px;
  background-color: #f9f9f9;
}

.advice-number {
  background-color: #4caf50;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
}

.advice-content {
  flex: 1;
}

.advice-content h4 {
  font-size: 1em;
  color: #333;
  margin-bottom: 8px;
}

.advice-content ul {
  list-style-type: disc;
  padding-left: 20px;
}

.advice-content li {
  color: #555;
  line-height: 1.6;
}

.summary-section p {
  color: #555;
  line-height: 1.7;
}

.report-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #eee;
  background-color: #f7f7f7;
}

.footer-info p {
  color: #777;
  font-size: 0.8em;
  margin: 0;
}

.footer-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9em;
}

.action-button:hover {
  background-color: #f0f0f0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .comparison-charts {
    flex-direction: column;
  }
  
  .chart-container {
    min-width: 100%;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .report-footer {
    flex-direction: column;
    gap: 15px;
  }
}

/* 打印样式 */
@media print {
  .feed-analysis-report {
    max-width: none;
    margin: 0;
    padding: 0;
    border: none;
  }

  .report-footer {
    display: none;
  }

  .action-button {
    display: none;
  }
  
  .report-section {
    box-shadow: none;
    border: 1px solid #ddd;
    break-inside: avoid;
  }
}
</style>