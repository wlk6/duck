<template>
  <div class="duck-price-tracker">
    <div class="header-section">
      <div class="title-container">
        <h1 class="main-title">活鸭批发价格走势分析</h1>
        <p class="subtitle">实时监控全国各地区活鸭市场价格变化</p>
      </div>
      
      <div class="filter-container">
        <div class="filter-group">
          <label>时间范围</label>
          <select v-model="timeRange" @change="fetchPriceData">
            <option value="7">近7天</option>
            <option value="30">近30天</option>
            <option value="90">近3个月</option>
            <option value="180">近6个月</option>
            <option value="365">近1年</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>地区</label>
          <select v-model="selectedRegion" @change="fetchPriceData">
            <option value="all">全国</option>
            <option v-for="region in regions" :key="region.id" :value="region.id">
              {{ region.name }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>品种</label>
          <select v-model="selectedBreed" @change="fetchPriceData">
            <option value="all">所有品种</option>
            <option v-for="breed in breeds" :key="breed.id" :value="breed.id">
              {{ breed.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="dashboard-container">
      <div class="price-summary-cards">
        <div class="summary-card">
          <div class="card-icon">
            <i class="el-icon-data-line"></i>
          </div>
          <div class="card-content">
            <h3>当前均价</h3>
            <div class="price-value">¥{{ currentPrice }}<span class="unit">/kg</span></div>
            <div class="price-change" :class="priceChangeClass">
              <i :class="priceChangeIcon"></i>
              {{ priceChangeRate }}%
            </div>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="card-icon">
            <i class="el-icon-top"></i>
          </div>
          <div class="card-content">
            <h3>最高价</h3>
            <div class="price-value">¥{{ highestPrice }}<span class="unit">/kg</span></div>
            <div class="price-location">{{ highestPriceLocation }}</div>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="card-icon">
            <i class="el-icon-bottom"></i>
          </div>
          <div class="card-content">
            <h3>最低价</h3>
            <div class="price-value">¥{{ lowestPrice }}<span class="unit">/kg</span></div>
            <div class="price-location">{{ lowestPriceLocation }}</div>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="card-icon">
            <i class="el-icon-time"></i>
          </div>
          <div class="card-content">
            <h3>更新时间</h3>
            <div class="update-time">{{ lastUpdateTime }}</div>
            <div class="update-status">
              <span class="status-dot" :class="{ 'active': isDataFresh }"></span>
              {{ isDataFresh ? '数据实时' : '数据延迟' }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="chart-container">
        <div class="chart-header">
          <h2>价格走势图</h2>
          <div class="chart-actions">
            <button 
              v-for="(period, index) in chartPeriods" 
              :key="index" 
              @click="setChartPeriod(period.value)"
              :class="{ 'active': chartPeriod === period.value }"
              class="period-button"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
        
        <div class="chart-wrapper" ref="chartContainer">
          <div v-if="loading" class="loading-overlay">
            <div class="spinner"></div>
            <p>加载数据中...</p>
          </div>
          <canvas id="priceChart" ref="priceChart"></canvas>
        </div>
      </div>
      
      <div class="market-insights">
        <h2>市场洞察</h2>
        <div class="insights-container">
          <div class="insight-card" v-for="(insight, index) in marketInsights" :key="index">
            <div class="insight-icon" :class="insight.type">
              <i :class="insight.icon"></i>
            </div>
            <div class="insight-content">
              <h3>{{ insight.title }}</h3>
              <p>{{ insight.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="regional-comparison">
        <h2>区域价格对比</h2>
        <div class="region-chart-container">
          <canvas id="regionChart" ref="regionChart"></canvas>
        </div>
      </div>
      
      <div class="price-table">
        <h2>详细价格数据</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>日期</th>
                <th>地区</th>
                <th>品种</th>
                <th>价格(元/kg)</th>
                <th>涨跌幅</th>
                <th>交易量(吨)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedTableData" :key="index">
                <td>{{ item.date }}</td>
                <td>{{ item.region }}</td>
                <td>{{ item.breed }}</td>
                <td>{{ item.price }}</td>
                <td :class="item.change >= 0 ? 'price-up' : 'price-down'">
                  {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
                </td>
                <td>{{ item.volume }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
        </div>
      </div>
    </div>
    
    <div class="data-source">
      <p>数据来源: 中国农业信息网、各地农产品批发市场</p>
      <p>最后更新: {{ lastUpdateTime }}</p>
    </div>
  </div>
</template>

<script>
// 修正Chart.js导入方式
import { Chart, registerables } from 'chart.js';
// 注册所有Chart.js组件
Chart.register(...registerables);

export default {
  name: 'DuckPriceTracker',
  data() {
    return {
      timeRange: '30',
      selectedRegion: 'all',
      selectedBreed: 'all',
      chartPeriod: 'month',
      loading: true,
      currentPage: 1,
      itemsPerPage: 10,
      
      // 价格数据
      currentPrice: '18.75',
      priceChangeRate: '+2.8',
      highestPrice: '22.50',
      highestPriceLocation: '广东 广州',
      lowestPrice: '16.20',
      lowestPriceLocation: '河南 周口',
      lastUpdateTime: this.formatDate(new Date()),
      isDataFresh: true,
      
      // 图表数据
      priceData: [],
      regionData: [],
      
      // 表格数据
      priceTableData: [],
      
      // 市场洞察
      marketInsights: [],
      
      // 筛选选项
      regions: [
        { id: 'northeast', name: '东北地区' },
        { id: 'north', name: '华北地区' },
        { id: 'east', name: '华东地区' },
        { id: 'central', name: '华中地区' },
        { id: 'south', name: '华南地区' },
        { id: 'southwest', name: '西南地区' },
        { id: 'northwest', name: '西北地区' }
      ],
      breeds: [
        { id: 'linwu', name: '临武鸭' },
        { id: 'peking', name: '北京鸭' },
        { id: 'shaoxing', name: '绍兴鸭' },
        { id: 'jianchang', name: '建昌鸭' },
        { id: 'other', name: '其他品种' }
      ],
      
      // 图表周期选项
      chartPeriods: [
        { label: '周', value: 'week' },
        { label: '月', value: 'month' },
        { label: '季', value: 'quarter' },
        { label: '年', value: 'year' }
      ],
      
      // 图表实例
      priceChart: null,
      regionChart: null,
      
      // 刷新间隔
      refreshInterval: null
    };
  },
  computed: {
    priceChangeClass() {
      return parseFloat(this.priceChangeRate) >= 0 ? 'price-up' : 'price-down';
    },
    priceChangeIcon() {
      return parseFloat(this.priceChangeRate) >= 0 ? 'el-icon-top-right' : 'el-icon-bottom-right';
    },
    totalPages() {
      return Math.ceil(this.priceTableData.length / this.itemsPerPage);
    },
    paginatedTableData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.priceTableData.slice(start, end);
    }
  },
  mounted() {
    this.fetchPriceData();
    this.fetchMarketInsights();
    
    // 设置自动刷新
    this.refreshInterval = setInterval(() => {
      this.fetchPriceData(true);
    }, 300000); // 每5分钟刷新一次
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    // 销毁图表实例
    if (this.priceChart) {
      this.priceChart.destroy();
    }
    if (this.regionChart) {
      this.regionChart.destroy();
    }
  },
  methods: {
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    
    async fetchPriceData(isRefresh = false) {
      if (!isRefresh) {
        this.loading = true;
      }
      
      try {
        // 这里应该是实际的API调用
        // const response = await fetch('your-api-endpoint');
        // const data = await response.json();
        
        // 由于没有实际API，我们使用模拟数据
        await this.simulateApiCall();
        
        // 生成模拟数据
        this.generateMockData();
        
        // 初始化图表
        this.initCharts();
        
        this.lastUpdateTime = this.formatDate(new Date());
        this.isDataFresh = true;
      } catch (error) {
        console.error('获取价格数据失败:', error);
        this.isDataFresh = false;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchMarketInsights() {
      try {
        // 模拟获取市场洞察
        await this.simulateApiCall(500);
        
        this.marketInsights = [
          {
            type: 'trend',
            icon: 'el-icon-top-right',
            title: '价格上涨趋势',
            description: '受饲料成本上涨和节日需求增加影响，预计未来两周活鸭价格将持续上涨。'
          },
          {
            type: 'supply',
            icon: 'el-icon-goods',
            title: '供应情况',
            description: '华南地区受台风影响，短期内供应量减少约15%，导致当地价格上涨明显。'
          },
          {
            type: 'demand',
            icon: 'el-icon-shopping-cart-full',
            title: '需求分析',
            description: '中秋节临近，餐饮业采购量增加，带动批发市场交易活跃，需求同比增长20%。'
          },
          {
            type: 'policy',
            icon: 'el-icon-document',
            title: '政策影响',
            description: '新的畜禽养殖环保政策实施，部分小型养殖场关停，对长期供应结构产生影响。'
          }
        ];
      } catch (error) {
        console.error('获取市场洞察失败:', error);
      }
    },
    
    initCharts() {
      this.initPriceChart();
      this.initRegionChart();
    },
    
    initPriceChart() {
      const ctx = this.$refs.priceChart.getContext('2d');
      
      // 销毁现有图表
      if (this.priceChart) {
        this.priceChart.destroy();
      }
      
      // 准备数据
      const labels = this.priceData.map(item => item.date);
      const prices = this.priceData.map(item => item.price);
      const volumes = this.priceData.map(item => item.volume);
      
      // 创建新图表
      this.priceChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: '价格 (元/kg)',
              data: prices,
              borderColor: '#2e7d32',
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              borderWidth: 2,
              pointBackgroundColor: '#2e7d32',
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: true,
              tension: 0.4,
              yAxisID: 'y'
            },
            {
              label: '交易量 (吨)',
              data: volumes,
              type: 'bar',
              backgroundColor: 'rgba(200, 230, 201, 0.6)',
              borderColor: 'rgba(200, 230, 201, 1)',
              borderWidth: 1,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              position: 'left',
              title: {
                display: true,
                text: '价格 (元/kg)'
              },
              grid: {
                color: 'rgba(200, 200, 200, 0.2)'
              }
            },
            y1: {
              position: 'right',
              title: {
                display: true,
                text: '交易量 (吨)'
              },
              grid: {
                display: false
              }
            }
          },
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false
            },
            legend: {
              position: 'top'
            }
          }
        }
      });
    },
    
    initRegionChart() {
      const ctx = this.$refs.regionChart.getContext('2d');
      
      // 销毁现有图表
      if (this.regionChart) {
        this.regionChart.destroy();
      }
      
      // 准备数据
      const labels = this.regionData.map(item => item.region);
      const prices = this.regionData.map(item => item.price);
      const changes = this.regionData.map(item => item.change);
      
      // 创建新图表
      this.regionChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: '当前价格 (元/kg)',
              data: prices,
              backgroundColor: 'rgba(46, 125, 50, 0.7)',
              borderColor: 'rgba(46, 125, 50, 1)',
              borderWidth: 1
            },
            {
              label: '价格变化 (%)',
              data: changes,
              type: 'line',
              backgroundColor: 'rgba(255, 193, 7, 0.2)',
              borderColor: 'rgba(255, 193, 7, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(255, 193, 7, 1)',
              pointRadius: 4,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              grid: {
                color: 'rgba(200, 200, 200, 0.2)'
              }
            }
          },
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false
            },
            legend: {
              position: 'top'
            }
          }
        }
      });
    },
    
    setChartPeriod(period) {
      this.chartPeriod = period;
      this.fetchPriceData();
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    
    // 模拟API调用的延迟
    simulateApiCall(delay = 1000) {
      return new Promise(resolve => {
        setTimeout(resolve, delay);
      });
    },
    
    // 生成模拟数据
    generateMockData() {
      // 生成价格走势数据
      this.generatePriceData();
      
      // 生成区域对比数据
      this.generateRegionData();
      
      // 生成表格数据
      this.generateTableData();
    },
    
    generatePriceData() {
      const days = parseInt(this.timeRange);
      const data = [];
      
      let basePrice = 18;
      let lastPrice = basePrice;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // 生成波动的价格
        const change = (Math.random() - 0.5) * 0.8;
        const price = Math.max(15, Math.min(23, lastPrice + change)).toFixed(2);
        lastPrice = parseFloat(price);
        
        // 生成交易量
        const volume = Math.floor(Math.random() * 50) + 100;
        
        data.push({
          date: this.formatDate(date).split(' ')[0],
          price: price,
          volume: volume
        });
      }
      
      this.priceData = data;
    },
    
    generateRegionData() {
      const data = this.regions.map(region => {
        const basePrice = 18;
        const variance = (Math.random() - 0.5) * 5;
        const price = (basePrice + variance).toFixed(2);
        const change = (Math.random() * 6 - 3).toFixed(1);
        
        return {
          region: region.name,
          price: price,
          change: change
        };
      });
      
      this.regionData = data;
    },
    
    generateTableData() {
      const data = [];
      
      // 生成30条记录
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const regionIndex = Math.floor(Math.random() * this.regions.length);
        const breedIndex = Math.floor(Math.random() * this.breeds.length);
        
        const price = (16 + Math.random() * 7).toFixed(2);
        const change = (Math.random() * 6 - 3).toFixed(1);
        const volume = Math.floor(Math.random() * 50) + 80;
        
        data.push({
          date: this.formatDate(date).split(' ')[0],
          region: this.regions[regionIndex].name,
          breed: this.breeds[breedIndex].name,
          price: price,
          change: change,
          volume: volume
        });
      }
      
      this.priceTableData = data;
    }
  }
};
</script>

<style scoped>
.duck-price-tracker {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
  background-color: #f9f9f9;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.title-container {
  margin-bottom: 20px;
}

.main-title {
  color: #2e7d32;
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #757575;
  font-size: 16px;
  margin: 0;
}

.filter-container {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  min-width: 120px;
  font-size: 14px;
}

.dashboard-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 25px;
}

.price-summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.card-icon {
  width: 50px;
  height: 50px;
  background-color: rgba(46, 125, 50, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: #2e7d32;
  font-size: 24px;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.price-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.unit {
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.price-change {
  font-size: 14px;
  font-weight: 500;
}

.price-up {
  color: #4caf50;
}

.price-down {
  color: #f44336;
}

.price-location, .update-time {
  font-size: 14px;
  color: #666;
}

.update-status {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ccc;
  margin-right: 5px;
}

.status-dot.active {
  background-color: #4caf50;
}

.chart-container {
  margin-bottom: 30px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.chart-actions {
  display: flex;
  gap: 10px;
}

.period-button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.period-button.active {
  background-color: #2e7d32;
  color: white;
  border-color: #2e7d32;
}

.chart-wrapper {
  position: relative;
  height: 400px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(46, 125, 50, 0.1);
  border-radius: 50%;
  border-top-color: #2e7d32;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.market-insights {
  margin-bottom: 30px;
}

.market-insights h2, .regional-comparison h2, .price-table h2 {
  font-size: 18px;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.insights-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.insight-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  transition: transform 0.3s;
}

.insight-card:hover {
  transform: translateY(-3px);
}

.insight-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  font-size: 18px;
}

.insight-icon.trend {
  background-color: #4caf50;
}

.insight-icon.supply {
  background-color: #2196f3;
}

.insight-icon.demand {
  background-color: #ff9800;
}

.insight-icon.policy {
  background-color: #9c27b0;
}

.insight-content {
  flex: 1;
}

.insight-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.insight-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.region-chart-container {
  height: 350px;
  margin-bottom: 30px;
}

.price-table {
  margin-bottom: 30px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f5f5f5;
  font-weight: 500;
  color: #333;
}

tr:hover {
  background-color: #f9f9f9;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.pagination button {
  padding: 8px 15px;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination button:hover {
  background-color: #1b5e20;
}

.pagination button:disabled {
  background-color: #c8e6c9;
  cursor: not-allowed;
}

.data-source {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  color: #757575;
  font-size: 12px;
}

.data-source p {
  margin: 5px 0;
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-container {
    width: 100%;
  }
  
  .price-summary-cards {
    grid-template-columns: 1fr;
  }
  
  .insights-container {
    grid-template-columns: 1fr;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart-actions {
    margin-top: 10px;
  }
}
</style>