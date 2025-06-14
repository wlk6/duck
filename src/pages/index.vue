<template>
  <div>
    <!-- User Authentication Status Loading -->
    <!-- <div v-if="isLoading" class="auth-status loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div> -->
    
    <div id="wrap">
      <!-- Header -->
      <header class="header" id="myHeader">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-6 col-md-4 col-lg-2">
              <div class="logo">
                <a href="main.html">
                  <img src="@/assets/images/logo/logo.png" class="img-fluid" alt="The cafe360 Logo Image">
                </a>
              </div>
            </div>
            <div class="col-6 col-md-8 col-lg-10">
              <!-- Nav -->
              <nav class="navbar navbar-expand-lg nabar-own p-0">
                <button class="navbar-toggler collapsed" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation"> 
                  <span class="navbar-toggler-icon">
                    <span class="menu_line_1"></span>
                    <span class="menu_line_2"></span>
                    <span class="menu_line_3"></span>
                  </span>
                </button>
                <div class="collapse navbar-collapse tr-nabar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav mr-auto align-self-center">
                    <li class="nav-item tr-nav-item"><a class="nav-link" href="javascript:void(0)">首页</a></li>
                    <li class="nav-item tr-nav-item" @click="watch"><span class="nav-link" style="cursor:pointer">监控查看</span></li>
                    <li class="nav-item tr-nav-item" @click="duck"><span class="nav-link" style="cursor:pointer">鸭子照料</span></li>
                    <li class="nav-item tr-nav-item" @click="com"><span class="nav-link" style="cursor:pointer">交流平台</span></li>
                    <li class="nav-item tr-nav-item" @click="market"><span class="nav-link" style="cursor:pointer">市场信息</span></li>
                  </ul>
                  <div class="search-container" ref="searchContainer" :class="{ 'active': isSearchActive }">
                    <input type="text" v-model="searchText" class="search-input" placeholder="Search" />
                    <span class="search-close" @click="closeSearch">×</span>
                  </div>
                  <div class="search-icon-container" @click="openSearch" v-if="!isSearchActive">
                    <i class="fas fa-search"></i>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <!-- End Header -->
      
      <!-- start slider section -->
      <section class="home-slider" style="margin-top:-55px">
        <div class="home-slider-image wow fadeInRight col-xl-5 col-lg-6 col-md-6 col-12 p-0" data-wow-duration="2s" data-wow-delay=".4s">
          <div class="slider-outer" id="j_silder_outer" ref="sliderOuter">
            <div class="img-item" v-for="(item, index) in 5" :key="index">
              <div class="img"></div>
              <div class="img"></div>
              <div class="img"></div>
              <div class="img"></div>
            </div>
            <div class="btns" data-num="0">
              <div class="prev" @click="rotate(1)">&lt;</div>
              <div class="next" @click="rotate(-1)">&gt;</div>
            </div>
          </div>
        </div>
        <div class="container" style="margin-top: 0px;">
          <div class="row">
            <div class="col-12 col-sm-11 col-md-6 col-lg-9 col-xl-10">
              <div class="slider-content">
                <span class="wow fadeInDown" data-wow-duration="1s" data-wow-delay=".3s">推进畜牧养殖科技化 &amp; 创新化</span>
                <h1 class="wow fadeInDown" data-wow-duration="1.5s" data-wow-delay=".4s">通禽达理，您的养殖助手</h1>
                <p class="mb-0 wow fadeIn" data-wow-duration="2s" data-wow-delay=".4s" style="margin-top: 20px;color:gray">
                  还在为养殖难题发愁？"通禽达理"，您专属的全能养殖助手强势登场！无论是养殖场用户，还是养殖公司，都能在这里找到一站式解决方案。选择 "通禽达理"，拥抱高效、智能的养殖新时代，开启养殖事业的无限可能！
                </p>
              </div>
              <div class="slider-video-section wow fadeInUp" data-wow-duration="1.5s" data-wow-delay=".4s">
                <div class="slider-obutton">
                  <!-- 用户信息/登录按钮 -->
                  <div class="user-profile-container" @mouseenter="showUserModal = true" @mouseleave="showUserModal = false">
                    <button v-if="userInfo" class="btn btn-sm btn-outline-success user-profile-button">
                      <span class="user-avatar-small" v-if="userInfo.avatar">
                        <img :src="userInfo.avatar" alt="用户头像">
                      </span>
                      <i v-else class="fas fa-user-circle mr-1"></i>
                      {{ userInfo.username || '用户' }}
                    </button>
                    <button v-else class="btn btn-sm btn-success" @click="log">
                      登录/注册
                    </button>
                    
                    <!-- 用户信息模态框 -->
                    <transition name="fade">
                      <div v-if="showUserModal && userInfo" class="user-modal">
                        <div class="user-modal-content">
                          <div class="user-modal-header">
                            <div class="user-modal-avatar">
                              <img :src="userInfo.avatar || '/img/my-notion-face-transparent.png?height=80&width=80'" alt="用户头像">
                            </div>
                            <div class="user-modal-title">
                              <h4>{{ userInfo.username || '用户' }}</h4>
                              <span class="user-type-badge" :class="'user-type-' + userInfo.userType">
                                {{ getUserType(userInfo.userType) }}
                              </span>
                            </div>
                          </div>
                          <div class="user-modal-body">
                            <div class="user-info-item">
                              <span class="user-info-label">用户ID：</span>
                              <span class="user-info-value">{{ userInfo.userId }}</span>
                            </div>
                            <div class="user-info-item">
                              <span class="user-info-label">邮箱：</span>
                              <span class="user-info-value">{{ userInfo.email || '未设置' }}</span>
                            </div>
                            <div class="user-info-item">
                              <span class="user-info-label">地区：</span>
                              <span class="user-info-value">{{ formatRegion(userInfo) }}</span>
                            </div>
                            <div class="user-info-item" v-if="userInfo.affiliation">
                              <span class="user-info-label">单位：</span>
                              <span class="user-info-value">{{ userInfo.affiliation }}</span>
                            </div>
                            <div class="user-info-item" v-if="userInfo.introduce">
                              <span class="user-info-label">简介：</span>
                              <p class="user-info-bio">{{ userInfo.introduce }}</p>
                            </div>
                          </div>
                          <div class="user-modal-footer">
                            <button class="btn btn-sm btn-outline-primary" @click="goToUserCenter">个人中心</button>
                            <button class="btn btn-sm btn-outline-danger" @click="logout">退出登录</button>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
                <div class="slider-pbutton">
                  <div class="play-button" data-toggle="modal" data-target="#exampleModalCenter" style="cursor:pointer">
                    <img src="@/assets/images/silders/paly-icon.png" alt="Play Video Icon">
                  </div>
                  <p class="mb-0 ml-4">Watch Our Video</p>                            
                  <!-- Modal -->
                  <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                      <div class="modal-content">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <i class="fas fa-window-close"></i>
                        </button>
                        <div class="modal-body"> 
                          <!-- video tag  -->
                          <video controls width="727" height="600">
                            <source src="@/assets/images/our1.mp4" type="video/mp4">
                          </video>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Over Modal -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- END slider section -->

      <!-- start specialities section -->
      <section class="specialities position-relative" id="Recipes">
        <h2 class="d-none">hidden</h2>
        <div class="shape-image-one">
          <img src="@/assets/images/background-shape/dottd-squre.png" class="img-fluid" alt="the background decorated dotted square image">
        </div>
        <div class="container">
          <div class="row specialities-top">
            <div class="col-12 col-md-12 col-lg-12">
              <div class="wow fadeInDown" data-wow-duration="2s" data-wow-delay=".4s">
                <h2 class="mb-0">Our Services</h2>
              </div>
              <p class="wow fadeIn" data-wow-duration="2s" data-wow-delay=".4s" style="max-width:1000px">
                我们提供超实用的养殖服务。健康监测超智能，能精准标红可疑病鸭，支持病鸭部位细查和历史数据分析，全方位守护家禽健康。鸭蛋监测也简单，导入照片即得结果，养殖户给鸭蛋标身份后，后续专业检测由我们接手。同时，我们还准备了丰富视频介绍，涵盖养殖管理、技术应用、病鸭识别及鸭蛋检测讲解等内容，像贴心导师手把手教你养殖。选 "通禽达理"，开启辉煌养殖路！
              </p>
            </div>
          </div>
          <!-- Services content sections -->
          <div class="row specialities-section" style="margin-top: 180px;">
            <div class="col-12 col-md-6 col-lg-5">
              <div class="specialities-image wow fadeInLeft" data-wow-duration="2s" data-wow-delay=".4s">
                <img src="@/assets/images/specialities/duckvedio.png" alt="find your best healthy food">
              </div>
            </div>
            <div class="col-12 col-lg-1 d-lg-block d-none p-0"></div>
            <div class="col-12 col-md-6 col-lg-6 p-lg-0 specialities-column">
              <div class="wow fadeInRight" data-wow-duration="2s" data-wow-delay=".4s">
                <h3 class="mb-0">视频介绍</h3>
              </div>
              <p class="wow fadeIn mb-0" data-wow-duration="2s" data-wow-delay=".4s">
                踏入畜牧养殖这片蓬勃发展的领域，"通禽达理"全力为您开启探索科技前沿的大门。我们精心制作的视频，是连接您与前沿知识的桥梁。在这里,您能通过我们的视频深入了解养殖技术，设备创新及行业趋势，探索畜牧养殖的科技前沿。
              </p>
            </div>
          </div>
          <!-- More service sections -->
          <div class="row specialities-section">
            <div class="col-12 col-md-6 col-lg-6 p-lg-0 specialities-column specialities-middle">
              <div class="wow fadeInLeft" data-wow-duration="2s" data-wow-delay=".4s">
                <h3 class="mb-0">健康监测</h3>                           
              </div>
              <p class="wow fadeIn mb-0" data-wow-duration="2s" data-wow-delay=".4s">
                推进鸭子养殖科技化，实时监测健康状态，让鸭子养殖在科技的助力下，实现高效、稳定且可持续的发展，不断迈向新的高峰 。
              </p>
            </div>
            <div class="col-12 col-lg-1 d-lg-block d-none p-0"></div>
            <div class="col-12 col-md-6 col-lg-5">
              <div class="specialities-image wow fadeInRight" data-wow-duration="2s" data-wow-delay=".4s">
                <img src="@/assets/images/specialities/duck2.png" alt="attractive dish for yoy">
              </div>
            </div>
          </div>
          <div class="row specialities-section">
            <div class="col-12 col-md-6 col-lg-5">
              <div class="specialities-image wow fadeInLeft" data-wow-duration="2s" data-wow-delay=".4s">
                <img src="@/assets/images/specialities/duckegg.png" alt="home delivery dishes">
              </div>
            </div>
            <div class="col-12 col-lg-1 d-lg-block d-none p-0"></div>
            <div class="col-12 col-md-6 col-lg-6 p-lg-0 specialities-column">
              <div class="wow fadeInRight" data-wow-duration="2s" data-wow-delay=".4s">
                <h3 class="mb-0">鸭蛋检测</h3>                        
              </div>
              <p class="wow fadeIn mb-0" data-wow-duration="2s" data-wow-delay=".4s">
                推进鸭蛋品质科技化检测，助力鸭蛋产业在科技赋能下，实现品质飞跃，满足市场对高品质鸭蛋的严苛需求 。
              </p>
            </div>
          </div>  
        </div>
      </section>

      <!-- start chef section -->
      <section class="chef-section position-relative" id="About" style="margin-top: -180px;">
        <h2 class="d-none">hidden</h2>
        <div class="shape-image-four">
          <img src="@/assets/images/background-shape/dottd-squre.png" class="img-fluid" alt="the background decorated dotted chef square image">
        </div>
        <div class="container position-relative">
          <div class="row specialities-top">
            <div class="col-12 col-md-12 col-lg-12">
              <div class="wow fadeInDown" data-wow-duration="2s" data-wow-delay=".4s">
                <h2 class="mb-0">Our specialities</h2>
              </div>
              <p class="wow fadeIn" data-wow-duration="2s" data-wow-delay=".4s" style="max-width:1000px">
                养殖户们组成温暖互助的社群，分享养殖心得,点滴经验汇聚成智慧海洋。专业导师团队凭借深厚的专业知识与丰富实践经验，提供专业指导，为养殖难题精准开方。此外，众多成功养殖户现身说法，将宝贵的实战经验倾囊相授，全方位汲取精华，在养殖之路上稳步前行，轻松实现养殖事业的蓬勃发展 。
              </p>
            </div>
          </div>
          <div class="chef-slider" style="margin-top: 180px;" ref="chefSlider">
            <div class="chef-slider-inner" v-for="(slide, index) in chefSlides" :key="index" :class="{ active: currentChefSlide === index }">
              <div class="row mx-lg-0">
                <div class="col-12 col-md-4 col-lg-4 p-0">
                  <div class="chef-image wow fadeInLeft" data-wow-duration="2s" data-wow-delay=".4s">
                    <img :src="slide.image" :alt="slide.alt">
                  </div>
                </div>
                <div class="col-12 col-md-1 col-lg-1 p-lg-0 d-lg-block d-none"></div>
                <div class="col-12 col-md-8 col-lg-7 p-lg-0">
                  <div class="chef-content wow fadeIn" data-wow-duration="2s" data-wow-delay=".4s">
                    <h3 class="mb-0">{{ slide.title }}</h3>
                    <p class="wow fadeIn" data-wow-duration="2s" data-wow-delay=".4s">{{ slide.description1 }}</p>
                    <p class="wow fadeIn" data-wow-duration="2s" data-wow-delay=".4s">{{ slide.description2 }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="chef-slider-controls">
              <button class="prev-slide" @click="prevChefSlide">&lt;</button>
              <button class="next-slide" @click="nextChefSlide">&gt;</button>
            </div>
          </div>
        </div>
      </section>
      <!-- END chef section -->
      
      <!--start email-subscription-->
      <section class="email-subscription position-relative" id="Contact">
        <div class="container">
          <div class="row specialities-top">
            <div class="col-12 col-md-12 col-lg-12">
              <div class="wow fadeInDown" data-wow-duration="2s" data-wow-delay=".4s">
                <h2 class="mb-0">加入/联系我们？</h2>
              </div>
              <p class="wow fadeIn" data-wow-duration="2s" data-wow-delay=".4s">
                在养殖领域中闯荡，你是否期待着能与志同道合者并肩，获得专业力量的加持？加入 "通禽达理"，一切美好皆可实现！当你选择加入我们，便踏入了一个充满活力与机遇的养殖社群。在这里，养殖户们亲如一家，热烈交流着养殖过程中的点点滴滴。
                我们的联系方式触手可得，只需轻轻一点，就能与我们取得联系。若你渴望交流养殖心得，分享成功经验，或是在养殖路上遭遇难题亟待解决，我们的专业团队和热情的会员们随时准备倾听。我们会迅速响应你的每一次咨询，为你答疑解惑，提供一对一的贴心服务。
              </p>
            </div>
          </div> 
          <div class="row justify-content-center">
            <div class="col-12 col-md-10 col-lg-6">
              <form class="email-form" @submit.prevent="submitEmail">
                <div class="form-group position-relative mb-0">
                  <input type="email" class="form-control" placeholder="您的邮箱号" v-model="email" required>
                  <button type="submit" class="btn btn-primary email-form-button">发送</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <!--END email-subscription-->
    </div>
    <!-- Page Wrapper -->
    
    <!--start footer-->
    <footer class="position-relative wow fadeIn" data-wow-duration="2s" data-wow-delay=".4s">
      <div class="footer-bottom">
        <div class="container position-relative">
          <div class="row">
            <div class="col-12 col-md-12 col-lg-12">
              <div class="footer-menu text-center">
                <ul>
                  <li class="nav-item tr-nav-item"><a class="nav-link" href="javascript:void(0)">首页</a></li>
                  <li class="nav-item tr-nav-item" @click="watch"><span class="nav-link" style="cursor:pointer">监控查看</span></li>
                  <li class="nav-item tr-nav-item" @click="duck"><span class="nav-link" style="cursor:pointer">鸭子照料</span></li>
                  <li class="nav-item tr-nav-item" @click="com"><span class="nav-link" style="cursor:pointer">交流平台</span></li>
                  <li class="nav-item tr-nav-item" @click="market"><span class="nav-link" style="cursor:pointer">市场信息</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-12 col-lg-12 text-center">
              <div class="footer-logo">
                <img src="@/assets/images/logo/logo.png" alt="the logo image | Footer cafe Logo" style="width: 300px;">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="footer-copylink text-center">
                <span><i class="fas fa-copyright"></i> All Rights Reserved by TongQinDaLi Made with <i class="fas fa-heart" style="color: #ff0000;"></i> 2025</span>
              </div>
            </div>  
          </div>
        </div>
      </div>
    </footer>
    <!--end footer-->

    <span class="scroll-top" data-scroll="up" @click="scrollToTop">
      <i class="fas fa-long-arrow-alt-up"></i>
    </span>            
  </div>
</template>

<script>
import $ from 'jquery'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// import WOW from 'wow.js'

export default {
  name: 'LandingPage',
  data() {
    return {
      currentRotation: 0,
      interval: null,
      searchText: '',
      isSearchActive: false,
      email: '',
      currentChefSlide: 0,
      chefSlides: [
        {
          image: '/img/duck3.png',
          alt: '分享养殖心得',
          title: '分享养殖心得',
          description1: '投身养殖行业，难免会遇到各种难题，而 "通禽达理" 就是破局的关键！在这里，养殖户们组成温暖互助的社群，毫无保留地分享养殖心得。大家交流日常喂料的最佳时机、不同季节禽舍温度的调控窍门，探讨如何巧妙识别家禽早期疫病症状，分享用天然食材预防疾病的独特偏方。',
          description2: '每一位会员的疑问都会被迅速关注，经验丰富的前辈会结合实际案例，细致剖析复杂的养殖技术难题，从禽畜疫病的精准诊断与高效治疗，到新型养殖设备的正确操作与维护，给出切实可行的解决方案。市场洞察敏锐的会员则会分享最新的市场动态，深入解读价格波动背后的供需关系，分析不同地区的消费偏好对市场走向的影响。'
        },
        {
          image: '/img/duck4.png',
          alt: '专业指导',
          title: '专业指导',
          description1: '专业导师团队随时待命，凭借深厚的专业知识与丰富的实战经验，为你提供精准的专业指导，无论是复杂的饲料配比难题，还是棘手的禽舍环境调控困境，都能手到擒来为你化解。众多成功案例背后的宝贵经验倾囊相授，让你少走弯路，快速汲取精华，在养殖领域稳步迈向成功，轻松实现养殖事业的腾飞。',
          description2: '由资深养殖专家和兽医团队提供科学养殖、疾病防治、饲料配方等全方位技术指导，让您的养殖之路更加顺畅'
        },
        {
          image: '/img/duckfarm.png',
          alt: '经验分享',
          title: '经验分享',
          description1: '众多成功养殖户现身说法，将宝贵的实战经验倾囊相授。有的养殖户分享自己如何通过观察家禽的粪便状态，精准判断其肠胃健康状况，及时调整饲料配方，避免了大规模疫病的爆发；有的则讲述在禽舍选址时，如何综合考量地形、水源与通风条件，打造出最适宜家禽生长的环境，极大提高了养殖效率。还有养殖户分享在市场行情波动时，巧妙利用期货市场套期保值，稳定养殖收益的独到策略。',
          description2: '海量养殖户的真实案例分享，从孵化管理到成鸭饲养，从鸭蛋保鲜到市场销售，每一个细节都满载着前辈们的宝贵经验'
        }
      ],
      chefSliderInterval: null,
      // 用户认证相关数据
      userInfo: null,
      isLoading: true,
      authToken: null,
      showUserModal: false
    }
  },
  created() {
    // Check if search state was saved to localStorage
    const savedSearchState = localStorage.getItem('searchState')
    if (savedSearchState) {
      const searchData = JSON.parse(savedSearchState)
      this.isSearchActive = searchData.isActive
      this.searchText = searchData.text
    }
    
    // 检查本地存储中是否有认证令牌并获取用户信息
    this.fetchUserData()
  },
  mounted() {
    this.loadScripts()
    this.initSlider()
    this.startAutoPlay()
    this.startChefSliderAutoPlay()
    
    // Add event listener for browser back button
    window.addEventListener('popstate', this.handleBackNavigation)
  },
  beforeDestroy() {
    // Clean up intervals when component is destroyed
    this.stopAutoPlay()
    this.stopChefSliderAutoPlay()
    
    // Remove event listener
    window.removeEventListener('popstate', this.handleBackNavigation)
  },
  methods: {
    // 用户认证相关方法
    async fetchUserData() {
      this.isLoading = true
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        this.isLoading = false
        this.userInfo = null
        return
      }
      
      try {
        const response = await fetch(`http://118.178.172.251:8080/user/getUserInfo/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          }
        });

        if (!response.ok) {
          throw new Error(`请求失败，状态码：${response.status}`);
        }

        const result = await response.json();
        if (result.code === 200 && result.data) {
          // 成功获取用户信息
          this.userInfo = result.data;
          this.authToken = token;
          console.log('用户信息获取成功:', this.userInfo);
        } else {
          console.error('获取用户信息失败，服务器响应代码：', result.code);
          this.userInfo = null;
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('获取用户数据失败:', error);
        this.userInfo = null;
        localStorage.removeItem('authToken');
      } finally {
        this.isLoading = false;
      }
    },
    
    // 获取用户类型名称
    getUserType(typeCode) {
      const typeMap = {
        1: '普通用户',
        2: '养殖户',
        3: '专家',
        4: '管理员'
      };
      return typeMap[typeCode] || '未知类型';
    },
    
    // 格式化地区信息
    formatRegion(user) {
      const parts = [
        user.province || '',
        user.city || '',
        user.district || ''
      ].filter(Boolean);
      
      return parts.length > 0 ? parts.join(' ') : '未设置地区';
    },
    
    // 退出登录
    logout() {
      localStorage.removeItem('authToken');
      this.authToken = null;
      this.userInfo = null;
      this.showUserModal = false;
      
      // 显示退出成功消息
      alert('您已成功退出登录');
    },
    
    // 前往用户中心
    goToUserCenter() {
      this.$router.push('/mine/homeview');
    },
    
    handleBackNavigation() {
      // Restore search state from localStorage when navigating back
      const savedSearchState = localStorage.getItem('searchState')
      if (savedSearchState) {
        const searchData = JSON.parse(savedSearchState)
        this.isSearchActive = searchData.isActive
        this.searchText = searchData.text
      }
    },
    
    // Search functionality
    openSearch() {
      this.isSearchActive = true
      this.$nextTick(() => {
        // Focus the search input when it becomes active
        const searchInput = this.$refs.searchContainer.querySelector('.search-input')
        if (searchInput) {
          searchInput.focus()
        }
        
        // Save search state to localStorage
        this.saveSearchState()
      })
    },
    
    closeSearch() {
      this.isSearchActive = false
      this.searchText = ''
      
      // Save search state to localStorage
      this.saveSearchState()
    },
    
    performSearch() {
      if (this.searchText.trim()) {
        alert(`搜索: ${this.searchText}`)
        // Implement actual search functionality here
      }
    },
    
    saveSearchState() {
      // Save current search state to localStorage
      const searchData = {
        isActive: this.isSearchActive,
        text: this.searchText
      }
      localStorage.setItem('searchState', JSON.stringify(searchData))
    },
    
    loadScripts() {
      const scripts = [
        'index/jquery-3.4.1.slim.min.js',
        'index/popper.min.js',
        'index/jquery.js',
        'index/bootstrap.min.js',
        'index/wow.min.js',
        'index/custom.js'
      ]
      
      scripts.forEach(src => {
        // Check if script already exists to avoid duplicates
        const existingScript = document.querySelector(`script[src="${src}"]`)
        if (!existingScript) {
          const script = document.createElement('script')
          script.src = src
          if (src === 'index/wow.min.js') {
            script.onload = () => {
              if (typeof WOW !== 'undefined') {
                new WOW().init()
              }
            }
          }
          document.body.appendChild(script)
        }
      })
    },
    
    initSlider() {
      // Initialize the 3D slider
      setTimeout(() => {
        const $imgItems = document.querySelectorAll('.img-item')
        $imgItems.forEach((el, index) => {
          el.style.left = `${el.offsetWidth * index}px`
          el.style.transitionDelay = `${index * 0.3}s`
          
          const images = el.querySelectorAll('.img')
          images.forEach(img => {
            img.style.backgroundPosition = `-${el.offsetWidth * index}px`
          })
        })
      }, 500)
    },
    
    rotate(direction) {
      this.currentRotation += direction
      const $imgItems = document.querySelectorAll('.img-item')
      $imgItems.forEach(el => {
        el.style.transform = `rotateX(${this.currentRotation * 90}deg)`
      })
    },
    
    startAutoPlay() {
      // Clear any existing interval
      if (this.interval) {
        clearInterval(this.interval)
      }
      
      // Start auto rotation
      this.interval = setInterval(() => {
        this.rotate(-1)
      }, 4000)
    },
    
    stopAutoPlay() {
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
    },
    
    // Chef slider methods
    nextChefSlide() {
      this.currentChefSlide = (this.currentChefSlide + 1) % this.chefSlides.length
    },
    
    prevChefSlide() {
      this.currentChefSlide = (this.currentChefSlide - 1 + this.chefSlides.length) % this.chefSlides.length
    },
    
    startChefSliderAutoPlay() {
      this.chefSliderInterval = setInterval(() => {
        this.nextChefSlide()
      }, 5000)
    },
    
    stopChefSliderAutoPlay() {
      if (this.chefSliderInterval) {
        clearInterval(this.chefSliderInterval)
        this.chefSliderInterval = null
      }
    },
    
    // Email subscription
    submitEmail() {
      if (this.email) {
        alert(`邮箱订阅成功: ${this.email}`)
        this.email = ''
      }
    },
    
    // Navigation methods
    log() {
      this.$router.push('/login')
    },
    
    com() {
      this.$router.push('/community')
    },
    
    market() {
      this.$router.push('/market')
    },
    
    watch() {
      this.$router.push('/watch')
    },
    
    duck() {
      this.$router.push('/duckcare')
    },
    
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  },
  watch: {
    searchText(newVal) {
      // Save search state to localStorage when searchText changes
      this.saveSearchState()
      
      // If enter key is pressed while typing, perform search
      if (newVal.includes('\n')) {
        this.searchText = newVal.replace('\n', '')
        this.performSearch()
      }
    }
  }
}
</script>

<style scoped>
@import 'bootstrap/dist/css/bootstrap.css';
@import './index_css/animate.css';
@import './index_css/custom.css';
@import './index_css/mediaquery.css';
@import './index_css/fontawesomeallmin.css';

/* 用户认证相关样式 */
.auth-status {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1050;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-status.loading {
  height: 80px;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(76, 175, 80, 0.3);
  border-radius: 50%;
  border-top-color: #4CAF50;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 用户信息模态框样式 */
.user-profile-container {
  position: relative;
}

.user-profile-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar-small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-modal {
  position: absolute;
  top: -100%;
  right: 0;
  left: 40%;
  width: 320px;
  z-index: 1000;
  margin-top: 10px;
}

.user-modal-content {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.user-modal-header {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.user-modal-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  border: 2px solid #4CAF50;
}

.user-modal-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-modal-title {
  flex: 1;
}

.user-modal-title h4 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: #333;
}

.user-type-badge {
  display: inline-block;
  padding: 3px 8px;
  font-size: 0.75rem;
  border-radius: 12px;
}

.user-type-1 {
  background-color: #e3f2fd;
  color: #1976d2;
}

.user-type-2 {
  background-color: #e8f5e9;
  color: #4CAF50;
}

.user-type-3 {
  background-color: #fff8e1;
  color: #ff9800;
}

.user-type-4 {
  background-color: #fce4ec;
  color: #e91e63;
}

.user-modal-body {
  padding: 15px;
}

.user-info-item {
  margin-bottom: 10px;
}

.user-info-label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.user-info-value {
  color: #666;
  font-size: 0.9rem;
}

.user-info-bio {
  margin-top: 5px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #666;
}

.user-modal-footer {
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

/* 淡入淡出动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 原有样式保持不变 */
.scroll-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 123, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  z-index: 999;
}

.scroll-top i {
  color: #007bff;
  font-size: 24px;
}

.slider-outer {
  width: 560px;
  height: 480px;
  margin: 90px auto;
  background-color: transparent;
  position: relative;
}

.img-item {
  position: absolute;
  width: 112px;
  height: 100%;
  transition: all 1.5s;
  transform-style: preserve-3d;
}

.img {
  width: 100%;
  height: 100%;
  position: absolute;
  background-size: cover;
}

.img:nth-child(1) {
  background: url(index_css/y1.png) no-repeat;
  transform: rotateX(0deg) translateZ(150px);
}

.img:nth-child(2) {
  background: url(index_css/y2.png) no-repeat;
  transform: rotateX(-90deg) translateZ(150px);
}

.img:nth-child(3) {
  background: url(index_css/y3.png) no-repeat;
  transform: rotateX(-180deg) translateZ(150px);
}

.img:nth-child(4) {
  background: url(index_css/y4.png) no-repeat;
  transform: rotateX(-270deg) translateZ(150px);
}

.btns {
  position: absolute;
  top: 50%;
  width: 100%;
  height: 70px;
  margin-top: -35px;
}

.prev,
.next {
  width: 70px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  background-color: rgba(0,0,0,.3);
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  position: absolute;
  z-index: 10;
  transition: background-color 0.3s;
}

.prev:hover,
.next:hover {
  background-color: rgba(0,0,0,.5);
}

.prev {
  left: 0;
}

.next {
  right: 0;
}

/* Search Styling */
.search-container {
  display: none;
  position: relative;
  height: 30px;
  border-bottom: 1px solid #4CAF50;
  padding: 5px 0;
  margin: 0 15px;
  width: 200px;
}

.search-container.active {
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 8px 30px 8px 5px;
  font-size: 16px;
  outline: none;
}

.search-input::placeholder {
  color: #999;
}

.search-close {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  cursor: pointer;
  color: #777;
  font-weight: bold;
}

.search-icon-container {
  cursor: pointer;
  padding: 8px;
  color: #333;
  transition: color 0.3s;
}

.search-icon-container:hover {
  color: #4CAF50;
}

/* Chef slider */
.chef-slider {
  position: relative;
  overflow: hidden;
}

.chef-slider-inner {
  display: none;
}

.chef-slider-inner.active {
  display: block;
  animation: fadeIn 0.5s ease-in-out;
}

.chef-slider-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.chef-slider-controls button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0,0,0,0.3);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chef-slider-controls button:hover {
  background-color: rgba(0,0,0,0.5);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive fixes */
@media (max-width: 768px) {
  .search-container {
    width: 150px;
  }
  
  .user-modal {
    width: 280px;
  }
  
  .user-modal-avatar {
    width: 50px;
    height: 50px;
  }
  
  p[style="max-width:1000px"] {
    max-width: 100% !important;
  }
}
</style>