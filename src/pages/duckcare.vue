<template>
  <div>
    <header class=" ">
      <!--//app-header-inner-->
      <div id="app-sidepanel" class="app-sidepanel">
        <div id="sidepanel-drop" class="sidepanel-drop"></div>
        <div class="sidepanel-inner d-flex flex-column">
          <a href="#" id="sidepanel-close" class="sidepanel-close d-xl-none">&times;</a>
          <div class="app-branding">
            <a class="app-logo" href="index.html">
              <img class="logo-icon mr-2" src="@/assets/images/duck10.png" alt="logo">
              <span class="logo-text">通禽达理</span>
            </a>
          </div>
          <!--//app-branding-->
          <nav id="app-nav-main" class="app-nav app-nav-main flex-grow-1">
            <ul class="app-menu list-unstyled accordion" id="menu-accordion">
            
              <li class="nav-item">
                <router-link class="nav-link" to="/duckcare/ducksize" @click="handleNavClick($event, 0)" :class="{ 'active': activeIndex === 0 }">
                  <span class="nav-icon">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-folder" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.828 4a3 3 0 0 1-2.12-.879l-.83-.828A1 1 0 0 0 6.173 2H2.5a1 1 0 0 0-1 .981L1.546 4h-1L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3v1z"/>
                      <path fill-rule="evenodd" d="M13.81 4H2.19a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zM2.19 3A2 2 0 0 0 .198 5.181l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3H2.19z"/>
                    </svg>
                  </span>
                  <span class="nav-link-text">体尺预测</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/duckcare/duckfeed" @click="handleNavClick($event, 1)" :class="{ 'active': activeIndex === 1 }">
                  <span class="nav-icon">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-card-list" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M14.5 3h-13a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                      <path fill-rule="evenodd" d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z"/>
                      <circle cx="3.5" cy="5.5" r=".5"/>
                      <circle cx="3.5" cy="8" r=".5"/>
                      <circle cx="3.5" cy="10.5" r=".5"/>
                    </svg>
                  </span>
                  <span class="nav-link-text">饲料配比</span>
                </router-link>
              </li>
              <li class="nav-item has-submenu">
                <router-link class="nav-link" to="/duckcare/duckanalysis" @click="handleNavClick($event, 2)" :class="{ 'active': activeIndex === 2 }">
                  <span class="nav-icon">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-files" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M4 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4z"/>
                      <path d="M6 0h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1H4a2 2 0 0 1 2-2z"/>
                    </svg>
                  </span>
                  <span class="nav-link-text">育种分析</span>
                </router-link>
              </li>
           
              <li class="nav-item">
                <router-link class="nav-link" to="/duckcare/duckpricetracker" @click="handleNavClick($event, 3)" :class="{ 'active': activeIndex === 3 }">
                  <span class="nav-icon">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-bar-chart-line" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z"/>
                    </svg>
                  </span>
                  <span class="nav-link-text">活鸭批发价格走势</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/duckcare/help" @click="handleNavClick($event, 4)" :class="{ 'active': activeIndex === 4 }">
                  <span class="nav-icon">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                    </svg>
                  </span>
                  <span class="nav-link-text">帮助</span>
                </router-link>
              </li>
              <li class="nav-item-divider"></li>
              <li class="nav-item">
                <a class="nav-link back-link" href="#" @click.prevent="goBack">
                  <span class="nav-icon">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                  </span>
                  <span class="nav-link-text">返回上一页</span>
                </a>
              </li>
            </ul>
          </nav>
          <div class="app-sidepanel-footer">
            <!-- 底部内容 -->
          </div>
        </div>
      </div>
    </header>
    <div class="app-wrapper">
      <div class="app-content pt-3 p-md-3 p-lg-4">
        <router-view></router-view>
      </div>
      <footer class="app-footer">
        <div class="container text-center py-3">
          <small class="copyright">Designed with <i class="fas fa-heart" style="color: #fb866a;"></i> by <a class="app-link" href="#">TongQinDaLi</a> for developers</small>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0 // 默认第一个导航项为激活状态
    }
  },
  mounted() {
    const scriptt = document.createElement('script');
    scriptt.src = 'duck/bootstrapmin.js';
    document.body.appendChild(scriptt);
    
    const scr = document.createElement('script');
    scr.src = 'duck/poppermin.js';
    scr.onload = () => { 
      document.body.appendChild(scr);
      const s = document.createElement('script');
      s.src = 'duck/app.js';
      document.body.appendChild(s);
    };
    
    // 根据当前路由设置激活的导航项
    this.setActiveNavByRoute();
  },
  watch: {
    // 监听路由变化，更新激活的导航项
    '$route'() {
      this.setActiveNavByRoute();
    }
  },
  methods: {
    // 返回上一页方法
    goBack() {
      window.history.back();
    },
    
    // 根据当前路由路径设置激活的导航项
    setActiveNavByRoute() {
      const path = this.$route.path;
      
      if (path.includes('/duckcare/ducksize')) {
        this.activeIndex = 0;
      } else if (path.includes('/duckcare/duckfeed')) {
        this.activeIndex = 1;
      } else if (path.includes('/duckcare/duckanalysis')) {
        this.activeIndex = 2;
      } else if (path.includes('/duckcare/duckpricetracker')) {
        this.activeIndex = 3;
      } else if (path.includes('help.html')) {
        this.activeIndex = 4;
      }
    },
    
    // 处理导航点击事件
    handleNavClick(event, index) {
      this.activeIndex = index;
    }
  }
}
</script>

<style scoped>
@import 'index_css/portal.css';

/* 添加到样式文件中 */
.nav-link.active {
  background-color: #28a745 !important; /* 绿色背景 */
  color: white !important; /* 文字颜色 */
  font-weight: bold;
}

.nav-link.active .nav-icon svg {
  color: white !important; /* 图标颜色同步变白 */
}

/* 返回按钮样式 */
.back-link {
  color: #495057;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 10px 15px;
  transition: all 0.3s;
}

.back-link:hover {
  background-color: #e9ecef;
  color: #212529;
}

.back-link .nav-icon svg {
  color: #28a745; /* 使用绿色图标，与激活状态颜色一致 */
}

/* 分隔线样式 */
.nav-item-divider {
  height: 1px;
  background-color: #e9ecef;
  margin: 8px 0;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .back-link {
    padding: 8px 12px;
  }
}
</style>