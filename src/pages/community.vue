<template>
  <body class="page-home">
    <!-- <div id="page-preloader">
        <div class="preloader-1">
            <div class="loader-text">Loading</div><span class="line line-1"></span><span class="line line-2"></span><span class="line line-3"></span><span class="line line-4"></span><span class="line line-5"></span><span class="line line-6"></span><span class="line line-7"></span><span class="line line-8"></span><span class="line line-9"></span>
        </div>
    </div> -->
    <div class="page-wrapper">
      <header class="page-header">
        <div class="page-header__inner">
          <div class="page-header__sidebar">
            <div class="page-header__menu-btn">
              <button class="menu-btn ico_menu is-active"></button>
            </div>
            <div class="page-header__logo">
              <img src="/src/img/logo.png" alt="logo" />
              <span class="page-header__logo_text">COMMUNITY</span>
            </div>
            <!-- 添加返回按钮 -->
            <!-- <div class="page-header__back" @click="$router.go(-1)">
              <button class="back-btn">
                <i class="ico_back"></i>
                <span>返回</span>
              </button>
            </div> -->
          </div>
          <div class="page-header__content">
            <div class="page-header__search">
              <div class="search">
                <div class="search__input">
                  <i class="ico_search"></i>
                  <input type="search" name="search" placeholder="Search" />
                </div>
                <div class="search__btn">
                  <button type="button">
                    <i class="ico_microphone"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="page-header__action">
              <a class="action-btn" href="#">
                <i class="ico_message"></i>
                <span></span>
              </a>
              <a class="action-btn" href="07_friends.html">
                <i class="ico_notification"></i>
                <span></span>
              </a>
              <router-link class="profile" to="/mine" style="width: 32px; height: 32px;">
                <img :src="userAvatar" alt="profile" style="border-radius: 50%; width: 100%; height: 100%;" />
              </router-link>
            </div>
          </div>
        </div>
      </header>
      <div class="page-content">
        <aside class="sidebar is-show" id="sidebar">
          <div class="sidebar-box">
            <ul class="uk-nav">
              <li :class="{ 'uk-active': activeItem === 'main' }" @click="activeItem = 'main'">
                <RouterLink to="/community/main">
                  <i class="ico_home"></i>
                  <span>推荐</span>
                </RouterLink>
              </li>
              <li class="uk-nav-header">Account</li>
              <li :class="{ 'uk-active': activeItem === 'blogs' }" @click="activeItem = 'blogs'">
                <RouterLink to="/community/blogs">
                  <i class="ico_community"></i>
                  <span>社区</span>
                </RouterLink>
              </li>
              <li :class="{ 'uk-active': activeItem === 'create' }" @click="activeItem = 'create'">
                <RouterLink to="/community/create">
                  <i class="ico_edit"></i>
                  <span>发帖</span>
                </RouterLink>
              </li>
              <li :class="{ 'uk-active': activeItem === 'my' }" @click="activeItem = 'my'">
                <RouterLink to="/community/my">
                  <i class="ico_profile"></i>
                  <span>询问</span>
                </RouterLink>
              </li>
              <li :class="{ 'uk-active': activeItem === 'mall' }" @click="activeItem = 'mall'">
                <RouterLink to="/community/mall">
                  <i class="ico_eye"></i>
                  <span>广场</span>
                </RouterLink>
              </li>
              <li :class="{ 'uk-active': activeItem === 'mine' }" @click="activeItem = 'mine'">
                <RouterLink to="/community/mine">
                  <i class="ico_star"></i>
                  <span>我发布的</span>
                </RouterLink>
              </li>
              <li :class="{ 'uk-active': activeItem === 'chat' }" @click="activeItem = 'chat'">
                <RouterLink to="/community/chat">
                  <i class="ico_chats"></i>
                  <span>聊天</span>
                  <span v-if="unreadCount !== 0" class="count">{{ unreadCount }}</span>
                </RouterLink>
              </li>
              <li>
                <a href="#">
                  <i class="ico_friends"></i>
                  <span>Friends</span>
                </a>
              </li>
              <li class="uk-nav-header">Main</li>
              <li :class="{ 'uk-active': activeItem === 'AI' }" @click="activeItem = 'AI'">
                <RouterLink to="/community/AI">
                  <i class="ico_help"></i>
                  <span>ChatAI</span>
                </RouterLink>
              </li>
              <li>
                <a href="#">
                  <i class="ico_store"></i>
                  <span>Store</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="ico_streams"></i>
                  <span>Streams</span>
                </a>
              </li>
              <li class="uk-nav-header">Support</li>
              <li>
                <a href="#" data-uk-toggle="">
                  <i class="ico_report"></i>
                  <span>Report</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
        <main class="page-main">
          <RouterView></RouterView>
        </main>
      </div>
    </div>
    <div class="page-modals">
      <div class="uk-flex-top" id="modal-report" data-uk-modal="">
        <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <button class="uk-modal-close-default" type="button" data-uk-close=""></button>
          <h2 class="uk-modal-title">Report</h2>
          <form class="uk-form-stacked" action="#">
            <div class="uk-margin">
              <div class="uk-form-label">Subject</div>
              <div class="uk-form-controls">
                <select class="js-select">
                  <option value="">Choose Subject</option>
                  <option value="Subject 1">Subject 1</option>
                  <option value="Subject 2">Subject 2</option>
                  <option value="Subject 3">Subject 3</option>
                </select>
              </div>
            </div>
            <div class="uk-margin">
              <div class="uk-form-label">Details</div>
              <div class="uk-form-controls">
                <textarea class="uk-textarea" name="details" placeholder="Try to include all details..."></textarea>
              </div>
              <div class="uk-form-controls uk-margin-small-top">
                <div data-uk-form-custom="">
                  <input type="file" />
                  <button class="uk-button uk-button-default" type="button" tabindex="-1">
                    <i class="ico_attach-circle"></i>
                    <span>Attach File</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="uk-margin">
              <div class="uk-grid uk-flex-right" data-uk-grid="">
                <div>
                  <button class="uk-button uk-button-small uk-button-link">Cancel</button>
                </div>
                <div>
                  <button class="uk-button uk-button-small uk-button-danger">Submit</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="uk-flex-top" id="modal-help" data-uk-modal="">
        <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <button class="uk-button uk-button-default" type="button" data-uk-close=""></button>
          <h2 class="uk-modal-title">Help</h2>
          <div class="search">
            <div class="search__input">
              <i class="ico_search"></i>
              <input type="search" name="search" placeholder="Search" />
            </div>
            <div class="search__btn">
              <button type="button">
                <i class="ico_microphone"></i>
              </button>
            </div>
          </div>
          <div class="uk-margin-small-left uk-margin-small-bottom uk-margin-medium-top">
            <h4>Popular Q&A</h4>
            <ul>
              <li>
                <img src="/src/image/clipboard-text.svg" alt="icon" />
                <span>How to Upload Your Developed Game</span>
              </li>
              <li>
                <img src="/src/image/clipboard-text.svg" alt="icon" />
                <span>How to Go Live Stream</span>
              </li>
              <li>
                <img src="/src/image/clipboard-text.svg" alt="icon" />
                <span>Get in touch with the Creator Support Team</span>
              </li>
            </ul>
            <ul>
              <li><a href="#!">browse all articles</a></li>
              <li><a href="#!">Send Feedback</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import { RouterLink } from "vue-router";
import axios from "axios";
import { useChatStore } from "../stores/chat";
import { baseURL } from "@/config/apiConfig";

export default {
  data() {
    return {
      activeItem: "",
      userAvatar: "/img/my-notion-face-transparent.png", // Default avatar
    };
  },
  beforeRouteEnter(to, from, next) {
    let active = "main";
    if (to.path.includes("/community/main")) {
      active = "main";
    } else if (to.path.includes("/community/blogs")) {
      active = "blogs";
    } else if (to.path.includes("/community/create")) {
      active = "create";
    } else if (to.path.includes("/community/my")) {
      active = "my";
    } else if (to.path.includes("/community/mall")) {
      active = "mall";
    } else if (to.path.includes("/community/mine")) {
      active = "mine";
    } else if (to.path.includes("/community/chat")) {
      active = "chat";
    } else if (to.path.includes("/community/AI")) {
      active = "AI";
    }
    next((vm) => {
      vm.activeItem = active;
      vm.fetchUserInfo();
    });
  },
  methods: {
    async fetchUserInfo() {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("Token not found!");
        return;
      }

      try {
        const response = await axios.post(
          `${baseURL}/user/getUserInfo/`,
          {},
          {
            headers: {
              token: token,
            },
          }
        );

        if (response.data.code === 200) {
          this.userAvatar = response.data.data.avatar || "/img/my-notion-face-transparent.png";
          localStorage.setItem("userID", response.data.data.userId);
        } else {
          console.error("Error fetching user info:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
  },
  watch: {
    "$route.path"(path) {
      if (path.includes("/community/main")) {
        this.activeItem = "main";
      } else if (path.includes("/community/blogs")) {
        this.activeItem = "blogs";
      } else if (path.includes("/community/create")) {
        this.activeItem = "create";
      } else if (path.includes("/community/my")) {
        this.activeItem = "my";
      } else if (path.includes("/community/mall")) {
        this.activeItem = "mall";
      } else if (path.includes("/community/mine")) {
        this.activeItem = "mine";
      } else if (path.includes("/community/chat")) {
        this.activeItem = "chat";
      } else if (path.includes("/community/AI")) {
        this.activeItem = "AI";
      }
    },
  },
  setup() {
    const chatStore = useChatStore();
    return { chatStore };
  },
  computed: {
    unreadCount() {
      return this.chatStore.totalUnread;
    },
  },
};
</script>

<style scoped>
@import "../assets/css/css2.css";
@import "../assets/css/css21.css";
@import "../assets/css/css22.css";
@import "../assets/css/remain.css";
@import "../assets/css/libs.min.css";
@import url("/node_modules/bootstrap-icons/font/bootstrap-icons.css");

/* 添加返回按钮样式 */
.page-header__back {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.back-btn i {
  margin-right: 5px;
}

.back-btn span {
  font-size: 14px;
}
</style>