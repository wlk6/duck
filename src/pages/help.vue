<template>
  <div class="help-page-container">
    <div class="help-header">
      <h1>帮助中心</h1>
      <p>欢迎使用通禽达理系统帮助中心，您可以在这里找到关于系统各功能的常见问题解答</p>
    </div>
    
    <div class="search-container">
      <div class="search-input-wrapper">
        <i class="el-icon-search search-icon"></i>
        <input 
          type="text" 
          placeholder="搜索问题..." 
          class="search-input"
          v-model="searchQuery"
          @input="filterFAQs"
        />
        <i v-if="searchQuery" @click="clearSearch" class="el-icon-close clear-icon"></i>
      </div>
      <button class="search-button" @click="filterFAQs">
        搜索
      </button>
    </div>
    
    <div v-if="searchActive && filteredFAQs.length === 0" class="no-results">
      <i class="el-icon-warning-outline"></i>
      <p>没有找到与"{{ searchQuery }}"相关的结果</p>
      <button @click="clearSearch" class="reset-button">重置搜索</button>
    </div>
    
    <div class="faq-container" v-if="!searchActive || filteredFAQs.length > 0">
      <div class="category-tabs">
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="category-tab"
          :class="{ 'active': activeCategory === category.id }"
          @click="setActiveCategory(category.id)"
        >
          <i :class="category.icon"></i>
          {{ category.name }}
          <span class="count" v-if="getCategoryCount(category.id) > 0">({{ getCategoryCount(category.id) }})</span>
        </button>
      </div>
      
      <div class="faq-items">
        <div v-for="item in filteredFAQs" :key="item.id" class="faq-item">
          <div 
            class="faq-question"
            :class="{ 'open': openItems.includes(item.id) }"
            @click="toggleItem(item.id)"
          >
            <h3 v-html="highlightText(item.question)"></h3>
            <i :class="openItems.includes(item.id) ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="faq-icon"></i>
          </div>
          
          <div v-if="openItems.includes(item.id)" class="faq-answer" v-html="highlightText(item.answer)"></div>
        </div>
      </div>
      
      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="pagination-button" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <i class="el-icon-arrow-left"></i> 上一页
        </button>
        
        <div class="page-numbers">
          <span v-for="page in displayedPages" :key="page" 
                :class="{ 'current': currentPage === page }"
                @click="changePage(page)">
            {{ page }}
          </span>
        </div>
        
        <button 
          class="pagination-button" 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          下一页 <i class="el-icon-arrow-right"></i>
        </button>
      </div>
    </div>
    
    <div class="help-footer">
      <h3>还有其他问题?</h3>
      <p>如果您没有找到需要的答案，请联系我们的技术支持团队</p>
      <div class="contact-info">
        <div class="contact-item">
          <i class="el-icon-phone"></i>
          <span>400-123-4567</span>
        </div>
        <div class="contact-item">
          <i class="el-icon-message"></i>
          <span>support@tongqindali.com</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpPage',
  data() {
    return {
      searchQuery: '',
      searchActive: false,
      openItems: [],
      activeCategory: 'all',
      currentPage: 1,
      itemsPerPage: 10,
      categories: [
        { id: 'all', name: '全部问题', icon: 'el-icon-s-grid' },
        { id: '体尺预测', name: '体尺预测', icon: 'el-icon-data-line' },
        { id: '饲料配比', name: '饲料配比', icon: 'el-icon-dish' },
        { id: '育种分析', name: '育种分析', icon: 'el-icon-s-data' },
        { id: '价格走势', name: '价格走势', icon: 'el-icon-trend-charts' },
        { id: '系统使用', name: '系统使用', icon: 'el-icon-s-platform' }
      ],
      faqData: [
        // 体尺预测相关问题
        {
          id: 1,
          question: "体尺预测功能如何帮助我的养殖场?",
          answer: `
            <div>
              <p>体尺预测功能通过分析鸭只的体尺数据，帮助您:</p>
              <ul>
                <li>预测鸭只的生长发育情况</li>
                <li>评估鸭只的健康状况</li>
                <li>优化饲养管理策略</li>
                <li>提前发现潜在的生长问题</li>
              </ul>
              <p>通过定期测量和记录鸭只的体尺数据，系统能够生成生长曲线，与标准生长曲线进行对比，帮助您及时调整饲养方案。</p>
            </div>
          `,
          category: "体尺预测"
        },
        {
          id: 2,
          question: "如何正确测量鸭只的体尺数据?",
          answer: `
            <div>
              <p>正确测量鸭只体尺数据的步骤:</p>
              <ol>
                <li><strong>体重</strong>: 使用电子秤，确保鸭只安静状态下测量</li>
                <li><strong>体斜长</strong>: 从喙尖到尾端的直线距离</li>
                <li><strong>颈长</strong>: 从头部与颈部连接处到颈部与躯干连接处的距离</li>
                <li><strong>胸宽</strong>: 两翅关节间的宽度</li>
                <li><strong>胸深</strong>: 从脊柱到胸骨的垂直距离</li>
              </ol>
              <p>建议在固定时间（如早晨喂食前）进行测量，以确保数据的一致性和可比性。测量时应轻柔操作，避免对鸭只造成应激。</p>
            </div>
          `,
          category: "体尺预测"
        },
        {
          id: 3,
          question: "体尺数据与生产性能有什么关系?",
          answer: `
            <div>
              <p>体尺数据与生产性能密切相关:</p>
              <ul>
                <li><strong>体重增长率</strong>: 直接反映饲料转化效率和生长速度</li>
                <li><strong>胸部发育</strong>: 与肉产量和品质相关</li>
                <li><strong>体长与体型</strong>: 影响屠宰率和肉品分布</li>
              </ul>
              <p>研究表明，体尺指标与经济性状（如饲料转化率、产蛋率、肉品质量）有显著相关性。通过监测体尺变化，可以预测生产性能，及时调整饲养管理策略。</p>
            </div>
          `,
          category: "体尺预测"
        },
        {
          id: 4,
          question: "体尺预测的数据如何导出和分享?",
          answer: `
            <div>
              <p>您可以通过以下方式导出和分享体尺预测数据:</p>
              <ol>
                <li><strong>导出报告</strong>: 在体尺预测页面右上角，点击"导出"按钮，选择Excel或PDF格式</li>
                <li><strong>数据分享</strong>: 点击"分享"按钮，可通过邮件或生成链接分享给团队成员</li>
                <li><strong>批量导出</strong>: 在数据管理页面，可选择多个记录进行批量导出</li>
                <li><strong>自动报告</strong>: 设置定期报告，系统会自动生成并发送到指定邮箱</li>
              </ol>
              <p>所有导出的数据都包含完整的测量记录、生长曲线图表和系统分析建议，便于您与专家或团队成员进行交流讨论。</p>
            </div>
          `,
          category: "体尺预测"
        },
        {
          id: 5,
          question: "体尺预测系统支持哪些鸭品种的标准数据?",
          answer: `
            <div>
              <p>我们的体尺预测系统目前支持以下鸭品种的标准数据:</p>
              <ul>
                <li><strong>北京鸭</strong>: 完整的生长发育标准数据，包括不同周龄的体重、体长等指标</li>
                <li><strong>樱桃谷鸭</strong>: 肉用型品种的标准生长曲线和体型参数</li>
                <li><strong>绍兴鸭</strong>: 蛋用型品种的体型特征和生长标准</li>
                <li><strong>金定鸭</strong>: 兼用型品种的生长发育参数</li>
                <li><strong>林甸麻鸭</strong>: 地方品种的特征数据</li>
              </ul>
              <p>系统会根据您选择的品种自动加载相应的标准数据。如果您饲养的是杂交品种或其他特殊品种，可以联系客服添加自定义标准。</p>
            </div>
          `,
          category: "体尺预测"
        },
        
        // 饲料配比相关问题
        {
          id: 6,
          question: "如何根据鸭只生长阶段调整饲料配比?",
          answer: `
            <div>
              <p>不同生长阶段的鸭只对营养需求不同，饲料配比应相应调整:</p>
              <ul>
                <li><strong>雏鸭期(0-3周)</strong>: 蛋白质21-22%，能量2900-3000kcal/kg，钙1.0%，磷0.7%</li>
                <li><strong>生长期(4-7周)</strong>: 蛋白质18-20%，能量3000-3100kcal/kg，钙0.9%，磷0.6%</li>
                <li><strong>育成期(8周以上)</strong>: 蛋白质16-17%，能量2900-3000kcal/kg，钙0.8%，磷0.5%</li>
              </ul>
              <p>使用我们的饲料配比功能，您可以根据鸭只的实际生长情况、体重和环境条件，获得更精确的饲料配方建议。</p>
            </div>
          `,
          category: "饲料配比"
        },
        {
          id: 7,
          question: "饲料成本如何影响养殖效益?",
          answer: `
            <div>
              <p>饲料成本通常占养鸭总成本的60-70%，是影响养殖效益的关键因素:</p>
              <ul>
                <li>合理配比可降低饲料成本15-20%</li>
                <li>提高饲料转化率可减少饲料用量</li>
                <li>季节性原料替代可降低成本波动风险</li>
              </ul>
              <p>我们的系统会根据当前市场原料价格，自动计算最经济的配方，同时保证营养需求，帮助您平衡成本与生产性能。</p>
              <p>此外，系统还会提供饲料成本与预期收益的分析，帮助您做出更明智的决策。</p>
            </div>
          `,
          category: "饲料配比"
        },
        {
          id: 8,
          question: "如何解读饲料配比分析报告?",
          answer: `
            <div>
              <p>饲料配比分析报告包含以下关键信息:</p>
              <ol>
                <li><strong>营养成分分析</strong>: 显示各营养素含量及平衡情况</li>
                <li><strong>原料组成</strong>: 列出各原料的比例及其营养贡献</li>
                <li><strong>成本分析</strong>: 计算每公斤饲料成本及各原料成本占比</li>
                <li><strong>优化建议</strong>: 提供可能的替代原料及其影响</li>
              </ol>
              <p>报告中的色彩标记帮助您快速识别问题：绿色表示正常范围，黄色表示边界值需要关注，红色表示需要调整。</p>
              <p>您可以通过点击报告中的"详细分析"按钮，查看更深入的数据解读和建议。</p>
            </div>
          `,
          category: "饲料配比"
        },
        {
          id: 9,
          question: "如何根据季节变化调整饲料配方?",
          answer: `
            <div>
              <p>季节变化对鸭只的营养需求和采食量有显著影响，应相应调整饲料配方:</p>
              <ul>
                <li><strong>夏季高温期</strong>:
                  <ul>
                    <li>增加饲料能量密度，弥补采食量下降</li>
                    <li>添加电解质，预防热应激</li>
                    <li>增加维生素C和E的添加量，增强抗应激能力</li>
                    <li>控制蛋白质水平，减少代谢热</li>
                  </ul>
                </li>
                <li><strong>冬季低温期</strong>:
                  <ul>
                    <li>适当增加饲料中的能量含量，满足保温需要</li>
                    <li>提高蛋白质水平，促进羽毛生长和保温</li>
                    <li>增加脂肪含量，提供更多热能</li>
                  </ul>
                </li>
              </ul>
              <p>系统会根据当前季节和天气预报自动提供调整建议，您也可以在"环境因素"选项中手动设置温度范围，获得更精准的配方。</p>
            </div>
          `,
          category: "饲料配比"
        },
        {
          id: 10,
          question: "如何处理饲料原料价格波动问题?",
          answer: `
            <div>
              <p>应对饲料原料价格波动的策略:</p>
              <ol>
                <li><strong>替代原料使用</strong>: 系统会根据当前市场价格，推荐性价比更高的替代原料</li>
                <li><strong>期货锁价</strong>: 对于价格波动大的原料，可考虑通过期货合约锁定价格</li>
                <li><strong>批量采购</strong>: 在原料价格低点进行适量储备</li>
                <li><strong>配方动态调整</strong>: 启用系统的"价格敏感"模式，自动根据原料价格变化调整配方</li>
              </ol>
              <p>在"原料管理"页面，您可以设置价格预警，当关键原料价格超过设定阈值时，系统会自动通知您并提供调整建议。</p>
              <p>此外，系统的"市场分析"功能可帮助您了解原料价格趋势，做出更具前瞻性的采购决策。</p>
            </div>
          `,
          category: "饲料配比"
        },
        
        // 育种分析相关问题
        {
          id: 11,
          question: "育种分析系统如何帮助提高种群质量?",
          answer: `
            <div>
              <p>育种分析系统通过以下方式帮助提高种群质量:</p>
              <ul>
                <li>识别具有优良性状的个体，用于选育下一代</li>
                <li>分析亲本与后代的性状关联，评估遗传力</li>
                <li>监测近交系数，避免近亲繁殖导致的问题</li>
                <li>预测杂交组合的表现，优化配种方案</li>
              </ul>
              <p>系统采用先进的统计模型和遗传算法，能够从复杂的数据中识别出有价值的育种信息，帮助您制定科学的育种计划。</p>
            </div>
          `,
          category: "育种分析"
        },
        {
          id: 12,
          question: "如何解读育种分析中的标准范围指标?",
          answer: `
            <div>
              <p>育种分析中的标准范围指标解读:</p>
              <ul>
                <li><strong>体重</strong>: 正常范围100-500克，低于100克表示发育不良，高于500克可能影响繁殖能力</li>
                <li><strong>体斜长</strong>: 正常范围10-14厘米，影响体型和肉产量</li>
                <li><strong>颈长</strong>: 正常范围30-45厘米，与品种特征和外观相关</li>
                <li><strong>胸宽/胸深</strong>: 正常范围60-70毫米，直接关系到胸肌发育和肉品质量</li>
              </ul>
              <p>系统会自动将测量数据与标准范围对比，并用不同颜色标记：绿色表示正常范围内，黄色表示低于正常，橙色表示高于正常。</p>
              <p>这些指标的综合分析可以帮助您评估个体的育种价值和选育方向。</p>
            </div>
          `,
          category: "育种分析"
        },
        {
          id: 13,
          question: "育种分析中的建议如何应用到实际生产中?",
          answer: `
            <div>
              <p>将育种分析建议应用到实际生产的步骤:</p>
              <ol>
                <li><strong>选种</strong>: 根据分析结果，选择具有优良性状的个体作为种源</li>
                <li><strong>配种</strong>: 按照系统推荐的配对方案进行，避免近亲繁殖</li>
                <li><strong>记录</strong>: 详细记录后代的性能数据，用于验证和调整育种方案</li>
                <li><strong>循环改进</strong>: 根据每一代的表现，不断优化育种目标和策略</li>
              </ol>
              <p>建议将育种分析与其他功能模块（如体尺预测、饲料配比）结合使用，形成完整的养殖管理体系，实现种群性能的持续改进。</p>
            </div>
          `,
          category: "育种分析"
        },
        {
          id: 14,
          question: "如何建立科学的育种记录系统?",
          answer: `
            <div>
              <p>建立科学的育种记录系统的关键步骤:</p>
              <ol>
                <li><strong>个体识别</strong>: 为每只种鸭分配唯一ID，可使用脚环、翅膀标签或芯片植入</li>
                <li><strong>系谱记录</strong>: 详细记录每个个体的父母信息，建立完整的家系图</li>
                <li><strong>性能测定</strong>: 定期记录生长、繁殖和生产性能数据</li>
                <li><strong>健康记录</strong>: 记录疫苗接种、疾病治疗和体况评分</li>
                <li><strong>环境因素</strong>: 记录饲养环境、饲料配方和管理措施</li>
              </ol>
              <p>在我们的系统中，您可以使用移动应用进行现场数据采集，支持扫描标签快速录入，并自动同步到云端数据库。系统还提供数据导入模板，方便您将历史数据迁移到平台。</p>
              <p>完整的记录是科学育种的基础，建议至少保存3-5代的详细数据，以便进行长期遗传趋势分析。</p>
            </div>
          `,
          category: "育种分析"
        },
        {
          id: 15,
          question: "如何评估育种计划的经济效益?",
          answer: `
            <div>
              <p>评估育种计划经济效益的方法:</p>
              <ul>
                <li><strong>生产性能改进</strong>: 计算育种前后的生长速度、饲料转化率、产蛋量等指标的变化</li>
                <li><strong>成本收益分析</strong>: 对比育种投入（设备、人力、技术）与产出增益</li>
                <li><strong>遗传进展速率</strong>: 评估每代性状改良的幅度和速度</li>
                <li><strong>投资回报周期</strong>: 计算育种投入的回收期</li>
              </ul>
              <p>系统提供的"育种效益分析"工具可以帮助您:</p>
              <ol>
                <li>模拟不同育种策略的长期效果</li>
                <li>计算每个性状改良的经济价值</li>
                <li>预测未来几代的性能变化和经济效益</li>
                <li>生成详细的投资回报分析报告</li>
              </ol>
              <p>建议每年对育种计划进行一次全面评估，根据实际效果调整育种目标和策略，确保资源投入产生最大的经济回报。</p>
            </div>
          `,
          category: "育种分析"
        },
        
        // 活鸭批发价格走势相关问题
        {
          id: 16,
          question: "如何利用价格走势数据指导销售决策?",
          answer: `
            <div>
              <p>价格走势数据可以通过以下方式指导销售决策:</p>
              <ul>
                <li><strong>最佳销售时机</strong>: 分析季节性价格波动，选择价格高峰期出售</li>
                <li><strong>区域选择</strong>: 比较不同地区价格差异，选择最有利的销售市场</li>
                <li><strong>品种调整</strong>: 根据不同品种的价格表现，调整养殖结构</li>
                <li><strong>合同签订</strong>: 利用价格预测，确定合理的合同价格和期限</li>
              </ul>
              <p>系统提供的价格预警功能可以在价格达到设定阈值时自动通知您，帮助把握市场机会。</p>
            </div>
          `,
          category: "价格走势"
        },
        {
          id: 17,
          question: "价格走势图中的各项指标代表什么?",
          answer: `
            <div>
              <p>价格走势图中的主要指标解释:</p>
              <ul>
                <li><strong>当前均价</strong>: 全国或所选区域的平均批发价格</li>
                <li><strong>价格变化率</strong>: 与上一周期相比的价格变动百分比</li>
                <li><strong>最高/最低价</strong>: 所选时间范围内的价格极值及其出现地区</li>
                <li><strong>交易量</strong>: 柱状图显示的市场交易量，反映市场活跃度</li>
                <li><strong>季节性指数</strong>: 显示价格的季节性变化模式</li>
              </ul>
              <p>图表中的颜色标记也有特定含义：绿色通常表示价格上涨，红色表示价格下跌，深浅程度表示变化幅度。</p>
            </div>
          `,
          category: "价格走势"
        },
        {
          id: 18,
          question: "如何理解市场洞察中的供需分析?",
          answer: `
            <div>
              <p>市场洞察中的供需分析包含以下关键信息:</p>
              <ul>
                <li><strong>价格趋势</strong>: 分析价格变动的原因和未来走势</li>
                <li><strong>供应情况</strong>: 评估当前市场供应量的变化及影响因素</li>
                <li><strong>需求分析</strong>: 解读消费需求的变化和季节性特点</li>
                <li><strong>政策影响</strong>: 分析相关政策对市场的短期和长期影响</li>
              </ul>
              <p>这些分析结合了历史数据、季节性模式和当前市场情况，帮助您理解价格变动背后的深层原因，做出更具前瞻性的决策。</p>
              <p>建议结合区域价格对比图表，了解不同地区的市场差异，发现潜在的销售机会。</p>
            </div>
          `,
          category: "价格走势"
        },
        {
          id: 19,
          question: "如何设置价格预警功能?",
          answer: `
            <div>
              <p>设置价格预警的步骤:</p>
              <ol>
                <li>在价格走势页面，点击右上角的"预警设置"按钮</li>
                <li>选择需要监控的地区和品种</li>
                <li>设置价格阈值条件，例如:
                  <ul>
                    <li>"价格高于X元/kg"</li>
                    <li>"价格低于X元/kg"</li>
                    <li>"价格上涨幅度超过X%"</li>
                    <li>"价格下跌幅度超过X%"</li>
                  </ul>
                </li>
                <li>选择通知方式（短信、邮件或应用内通知）</li>
                <li>设置通知频率（实时、每日或每周汇总）</li>
                <li>点击"保存"完成设置</li>
              </ol>
              <p>您可以设置多个预警条件，针对不同地区或品种创建不同的预警规则。系统会根据您的设置，在条件触发时发送通知。</p>
              <p>在"我的预警"页面，您可以查看、编辑或删除已设置的预警规则，并查看历史预警记录。</p>
            </div>
          `,
          category: "价格走势"
        },
        {
          id: 20,
          question: "价格数据来源是什么？更新频率如何？",
          answer: `
            <div>
              <p>我们的价格数据来源和更新机制:</p>
              <ul>
                <li><strong>数据来源</strong>:
                  <ul>
                    <li>全国农产品批发市场价格信息系统</li>
                    <li>各省农业农村厅发布的市场监测数据</li>
                    <li>重点批发市场的实时交易数据</li>
                    <li>合作养殖企业提供的交易记录</li>
                  </ul>
                </li>
                <li><strong>更新频率</strong>:
                  <ul>
                    <li>全国均价: 每日更新一次（工作日16:00前）</li>
                    <li>重点市场价格: 每日更新两次（上午10:00和下午15:00）</li>
                    <li>历史数据和趋势分析: 每周更新一次</li>
                    <li>市场洞察报告: 每周一发布上周总结和本周展望</li>
                  </ul>
                </li>
              </ul>
              <p>我们采用多源数据交叉验证的方式，确保价格数据的准确性和代表性。在每个数据点旁边，您可以看到数据的采集时间和来源信息。</p>
              <p>如果您对特定地区的价格数据有疑问，可以点击"数据反馈"按钮提交问题，我们的数据团队会在1-2个工作日内回复。</p>
            </div>
          `,
          category: "价格走势"
        },
        
        // 系统使用相关问题
        {
          id: 21,
          question: "如何注册和登录系统?",
          answer: `
            <div>
              <p>注册和登录系统的步骤:</p>
              <ol>
                <li><strong>注册新账户</strong>:
                  <ul>
                    <li>访问系统首页，点击右上角"注册"按钮</li>
                    <li>填写手机号码，获取并输入验证码</li>
                    <li>设置登录密码（至少8位，包含字母和数字）</li>
                    <li>填写基本信息（姓名、单位、养殖规模等）</li>
                    <li>阅读并同意用户协议和隐私政策</li>
                    <li>点击"完成注册"</li>
                  </ul>
                </li>
                <li><strong>登录系统</strong>:
                  <ul>
                    <li>输入注册的手机号码和密码</li>
                    <li>或选择"短信验证码登录"</li>
                    <li>勾选"记住我"可保持登录状态7天</li>
                  </ul>
                </li>
              </ol>
              <p>如果忘记密码，可以点击登录页面的"忘记密码"链接，通过手机验证码重置密码。</p>
              <p>首次登录系统后，建议完善个人资料和养殖场信息，以获得更个性化的服务和建议。</p>
            </div>
          `,
          category: "系统使用"
        },
        {
          id: 22,
          question: "如何修改个人资料和密码?",
          answer: `
            <div>
              <p>修改个人资料和密码的方法:</p>
              <ol>
                <li><strong>修改个人资料</strong>:
                  <ul>
                    <li>点击右上角的用户头像，选择"个人中心"</li>
                    <li>在"基本资料"选项卡中，可以修改姓名、联系方式、单位等信息</li>
                    <li>点击"上传头像"可更换个人头像</li>
                    <li>填写完成后点击"保存更改"</li>
                  </ul>
                </li>
                <li><strong>修改密码</strong>:
                  <ul>
                    <li>在个人中心页面，切换到"账号安全"选项卡</li>
                    <li>点击"修改密码"按钮</li>
                    <li>输入当前密码和新密码（两次）</li>
                    <li>点击"确认修改"完成密码更新</li>
                  </ul>
                </li>
              </ol>
              <p>为了账号安全，建议定期更换密码，并避免使用与其他网站相同的密码。</p>
              <p>如果您需要修改注册手机号，需要通过原手机号验证后才能更换新手机号。</p>
            </div>
          `,
          category: "系统使用"
        },
        {
          id: 23,
          question: "系统支持哪些浏览器和设备?",
          answer: `
            <div>
              <p>系统兼容性信息:</p>
              <ul>
                <li><strong>支持的浏览器</strong>:
                  <ul>
                    <li>Google Chrome 60+</li>
                    <li>Microsoft Edge 80+</li>
                    <li>Firefox 60+</li>
                    <li>Safari 12+</li>
                  </ul>
                </li>
                <li><strong>支持的设备</strong>:
                  <ul>
                    <li>台式电脑和笔记本电脑</li>
                    <li>平板电脑（iPad、Android平板等）</li>
                    <li>智能手机（自动适应屏幕尺寸）</li>
                  </ul>
                </li>
                <li><strong>移动应用</strong>:
                  <ul>
                    <li>iOS应用（支持iOS 12.0及以上版本）</li>
                    <li>Android应用（支持Android 7.0及以上版本）</li>
                    <li>可在App Store或应用宝下载</li>
                  </ul>
                </li>
              </ul>
              <p>为获得最佳体验，建议使用最新版本的Chrome或Edge浏览器。</p>
              <p>移动应用提供离线数据采集功能，适合在网络信号不稳定的养殖场环境使用。</p>
            </div>
          `,
          category: "系统使用"
        },
        {
          id: 24,
          question: "如何导出和备份我的数据?",
          answer: `
            <div>
              <p>导出和备份数据的方法:</p>
              <ol>
                <li><strong>数据导出</strong>:
                  <ul>
                    <li>在各功能模块页面，点击右上角的"导出"按钮</li>
                    <li>选择导出格式（Excel、CSV或PDF）</li>
                    <li>选择要导出的数据范围（时间段、数据类型等）</li>
                    <li>点击"确认导出"，文件将自动下载到您的设备</li>
                  </ul>
                </li>
                <li><strong>数据备份</strong>:
                  <ul>
                    <li>进入"系统设置"页面，选择"数据管理"选项卡</li>
                    <li>点击"创建备份"按钮</li>
                    <li>选择要备份的数据模块</li>
                    <li>系统会自动创建一个包含所选数据的备份文件</li>
                    <li>备份完成后，可以下载到本地保存</li>
                  </ul>
                </li>
                <li><strong>自动备份设置</strong>:
                  <ul>
                    <li>在"数据管理"页面，开启"自动备份"功能</li>
                    <li>设置备份频率（每日、每周或每月）</li>
                    <li>选择备份保留时间（1个月到1年）</li>
                    <li>可选择将备份自动发送到指定邮箱</li>
                  </ul>
                </li>
              </ol>
              <p>系统默认保留最近30天的数据备份，超过保留期的备份将自动删除。建议定期下载重要数据的备份文件到本地存储。</p>
            </div>
          `,
          category: "系统使用"
        },
        {
          id: 25,
          question: "如何联系客服获取技术支持?",
          answer: `
            <div>
              <p>获取技术支持的多种方式:</p>
              <ul>
                <li><strong>在线客服</strong>: 点击系统右下角的"客服"图标，可以与在线客服人员实时交流</li>
                <li><strong>电话支持</strong>: 工作日9:00-18:00，拨打400-123-4567</li>
                <li><strong>邮件支持</strong>: 发送问题描述到support@tongqindali.com</li>
                <li><strong>远程协助</strong>: 客服可通过系统提供的远程协助功能，直接帮您解决操作问题</li>
                <li><strong>帮助中心</strong>: 本页面提供了常见问题的解答和操作指南</li>
                <li><strong>视频教程</strong>: 在"学习资源"页面可以观看系统各功能的操作视频</li>
              </ul>
              <p>提交技术支持请求时，请尽可能详细描述您遇到的问题，包括:</p>
              <ol>
                <li>问题发生的具体步骤</li>
                <li>使用的设备和浏览器信息</li>
                <li>相关的错误信息或截图</li>
                <li>您的账号和联系方式</li>
              </ol>
              <p>我们的技术支持团队会在24小时内回复您的请求。对于紧急问题，建议直接拨打电话获取即时支持。</p>
            </div>
          `,
          category: "系统使用"
        }
      ],
      filteredFAQs: []
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredFAQs.length / this.itemsPerPage);
    },
    displayedPages() {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (this.totalPages <= maxVisiblePages) {
        // 如果总页数小于等于最大可见页数，显示所有页码
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 否则，显示当前页附近的页码
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
        
        // 调整起始页，确保显示足够的页码
        if (endPage - startPage + 1 < maxVisiblePages) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    },
    paginatedFAQs() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredFAQs.slice(start, end);
    }
  },
  created() {
    this.filterFAQs();
  },
  methods: {
    toggleItem(id) {
      if (this.openItems.includes(id)) {
        this.openItems = this.openItems.filter(item => item !== id);
      } else {
        this.openItems.push(id);
      }
    },
    setActiveCategory(categoryId) {
      this.activeCategory = categoryId;
      this.currentPage = 1;
      this.filterFAQs();
    },
    filterFAQs() {
      // 先按类别筛选
      let result = this.activeCategory === 'all' 
        ? this.faqData 
        : this.faqData.filter(item => item.category === this.activeCategory);
      
      // 再按搜索词筛选
      if (this.searchQuery.trim() !== '') {
        this.searchActive = true;
        const query = this.searchQuery.toLowerCase();
        result = result.filter(item => 
          item.question.toLowerCase().includes(query) || 
          item.answer.toLowerCase().includes(query)
        );
      } else {
        this.searchActive = false;
      }
      
      this.filteredFAQs = result;
      
      // 如果当前页超出了筛选后的总页数，重置为第一页
      if (this.currentPage > Math.ceil(result.length / this.itemsPerPage)) {
        this.currentPage = 1;
      }
    },
    clearSearch() {
      this.searchQuery = '';
      this.searchActive = false;
      this.filterFAQs();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    getCategoryCount(categoryId) {
      if (categoryId === 'all') {
        return this.searchActive ? this.filteredFAQs.length : 0;
      } else {
        return this.filteredFAQs.filter(item => item.category === categoryId).length;
      }
    },
    highlightText(text) {
      if (!this.searchQuery.trim() || typeof text !== 'string') {
        return text;
      }
      
      const query = this.searchQuery.trim().toLowerCase();
      const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
      
      return text.replace(regex, '<span class="highlight">$1</span>');
    },
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  }
};
</script>

<style scoped>
.help-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #333333;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.help-header {
  text-align: center;
  margin-bottom: 2rem;
}

.help-header h1 {
  color: #2e7d32;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.help-header p {
  color: #666666;
  font-size: 1rem;
}

.search-container {
  display: flex;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 18px;
}

.clear-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 18px;
  cursor: pointer;
}

.clear-icon:hover {
  color: #666;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
}

.search-button {
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 0 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
  font-weight: 500;
}

.search-button:hover {
  background-color: #005005;
}

.no-results {
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.no-results i {
  font-size: 3rem;
  color: #e0e0e0;
  margin-bottom: 1rem;
}

.no-results p {
  color: #666;
  margin-bottom: 1rem;
}

.reset-button {
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 14px;
}

.faq-container {
  margin-bottom: 3rem;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.category-tab {
  padding: 0.5rem 1rem;
  background-color: #e8f5e9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  color: #333333;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.category-tab i {
  font-size: 16px;
}

.category-tab .count {
  font-size: 12px;
  color: #666;
}

.category-tab.active {
  background-color: #2e7d32;
  color: white;
  border-color: #2e7d32;
}

.category-tab.active .count {
  color: #e0e0e0;
}

.faq-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.faq-question:hover {
  background-color: #e8f5e9;
}

.faq-question.open {
  background-color: #e8f5e9;
  border-bottom: 1px solid #e0e0e0;
}

.faq-question h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #2e7d32;
}

.faq-icon {
  color: #2e7d32;
  font-size: 1.2rem;
}

.faq-answer {
  padding: 1.5rem;
  background-color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 10px;
}

.pagination-button {
  padding: 0.5rem 1rem;
  background-color: #e8f5e9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  color: #2e7d32;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.pagination-button:hover:not(:disabled) {
  background-color: #c8e6c9;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-numbers span {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.page-numbers span:hover:not(.current) {
  background-color: #e8f5e9;
}

.page-numbers span.current {
  background-color: #2e7d32;
  color: white;
}

.help-footer {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.help-footer h3 {
  color: #2e7d32;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666666;
}

@media (max-width: 768px) {
  .help-page-container {
    padding: 1rem;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 1rem;
  }
  
  .category-tabs {
    justify-content: center;
  }
}
</style>

<style>
/* 全局样式，用于高亮搜索结果 */
.highlight {
  background-color: #ffeb3b;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: bold;
}
</style>