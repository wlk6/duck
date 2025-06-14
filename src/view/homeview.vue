<template>
    <div class="personal">
    <div class="container">
      <header>
        <h1 class="greeting">Hello</h1>
      </header>
      
      <main class="content">
        <div class="name-title">
          <h2>{{ username }}</h2>
        </div>
        <div class="name-title">
          <h3>地区：{{ region }}</h3>
        </div>
        <div class="py-2">
            <h2>email：</h2>
                <h2
                        class="typewrite text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-yellow-500 md:text-2xl fadein-up"
                        ref="typewriter">
                    <span class="wrap">{{ txt }}</span>
                </h2>
            </div>
        <div class="welcome-section">
          <h2>Welcome to 通禽达理. <span class="green-dot">👋🏼</span></h2>
        </div>
      </main>
    </div>
    <div class="flex justify-center md:justify-start fadein-right">
        <img alt="avatar"
        :src="avatar || defaultAvatar"
        fetchpriority="high"
        width="300" height="300" decoding="async"
        data-nimg="1"
        class="w-10/12 md:h-auto rounded-full border-4 border-amber-200 pict">
        </div>
    </div>
  </template>

<script>
import { baseURL } from '@/config/apiConfig';

export default {
  name: 'HomeView',
  data() {
    return {
      toRotate: [""], // 初始化为空字符串数组，可能需要根据实际需求调整
      period: 2000,
      txt: '',
      loopNum: 0,
      isDeleting: false,
      username: "张三", // 初始用户名，可能需要根据登录状态动态获取
      avatar: "",
      region: "",
      defaultAvatar: "/img/my-notion-face-transparent.png"
    };
  },
  async mounted() {
    try {
      await this.fetchUserData();
      this.$nextTick(() => {
        this.tick();
      });
    } catch (error) {
      // 处理 fetchUserData 可能抛出的异常，例如网络错误或认证失败
      console.error('在 mounted 钩子中获取用户数据时出错:', error);
    }
  },
  methods: {
    async fetchUserData() {
      const token=localStorage.getItem('authToken')
      try {
        const response = await fetch(`${baseURL}/user/getUserInfo/`, {
          method:'POST',
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
          const user = result.data;
          this.username = user.username || "匿名用户";
          this.avatar = user.avatar || this.defaultAvatar;
          this.region = `${user.province} ${user.city} ${user.district}`;
          this.toRotate = [user.email || "未提供邮箱"];
        } else {
          console.error('获取用户信息失败，服务器响应代码：', result.code);
          this.toRotate = ["未获取到邮箱"];
        }
      } catch (error) {
        console.error('获取用户数据失败:', error);
        this.toRotate = ["加载用户信息时出错"];
      }
    },
    tick() {
      const typewriter = this.$refs.typewriter;
      if (!typewriter) return;

      let i = this.loopNum % this.toRotate.length;
      let fullTxt = this.toRotate[i];
      this.txt = this.isDeleting
        ? (this.txt.length > 0 ? fullTxt.substring(0, this.txt.length - 1) : fullTxt)
        : (this.txt.length < fullTxt.length ? fullTxt.substring(0, this.txt.length + 1) : fullTxt);
      typewriter.innerHTML = `<span class="wrap">${this.txt}</span>`;

      let delta = 200 - Math.random() * 100;
      if (this.isDeleting) {
        delta /= 2;
      }

      if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
      } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
      }

      setTimeout(() => {
        this.tick();
      }, delta);
    }
  },
  // 如果组件可能会在未完成动画时销毁，可以考虑在 beforeDestroy 钩子中清除 setTimeout
  beforeDestroy() {
    clearTimeout(this.timer); // 假设你在 tick 方法中用 this.timer = setTimeout(...) 存储了定时器 ID
  },
  // 注意：上面的 beforeDestroy 钩子需要您在 tick 方法中稍微修改一下，以存储定时器的 ID
  // tick 方法中的 setTimeout 调用应改为：
  // this.timer = setTimeout(() => { this.tick(); }, delta);
};
</script>
<style>
    body {
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .typewrite > .wrap {
        border-right: 0.08em solid #fff;
    }

    .wave {
        animation-name: wave-animation;
        animation-duration: 2.5s;
        animation-iteration-count: infinite;
        transform-origin: 70% 70%;
        display: inline-block
    }

    @keyframes wave-animation {
        0% {
            transform: rotate(0deg)
        }

        10% {
            transform: rotate(14deg)
        }

        20% {
            transform: rotate(-8deg)
        }

        30% {
            transform: rotate(14deg)
        }

        40% {
            transform: rotate(-4deg)
        }

        50% {
            transform: rotate(10deg)
        }

        60% {
            transform: rotate(0deg)
        }

        to {
            transform: rotate(0deg)
        }
    }

    .pict {
        box-shadow: 0px 0px 73px -9px rgb(0 255 15 / 44%);
        -webkit-box-shadow: 0px 0px 73px -9px rgb(0 255 15 / 44%);
        -moz-box-shadow: 0px 0px 73px -9px rgb(0 255 15 / 44%);
    }

    .fadein-up {
        opacity: 0;
        animation-name: fadeInUp;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        animation-delay: 500ms;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate3d(0, 15px, 0);
        }

        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }

    .fade-in-from-left {
        opacity: 0;
        animation: fadeInLeft 0.5s ease-out forwards;
        animation-delay: 500ms;
    }

    @keyframes fadeInLeft {
        0% {
            opacity: 0;
            transform: translateX(-100%);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .fadein-right {
        opacity: 0;
        animation: fadeInRight 0.5s ease-out forwards;
        animation-delay: 500ms;
    }

    @keyframes fadeInRight {
        0% {
            opacity: 0;
            transform: translateX(100%);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .fadein-bot {
        opacity: 0;
        animation: fadeInBot 0.5s forwards;
    }

    @keyframes fadeInBot {
        from {
            opacity: 0;
            transform: translate3d(0, -100%, 0);
        }

        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }

    .fadein-1 {
        animation-delay: 200ms;
    }

    .fadein-2 {
        animation-delay: 400ms;
    }

    .fadein-3 {
        animation-delay: 600ms;
    }

    .fade-500 {
        animation-delay: 500ms;
    }
    .py-2{
        color: #fff;
        display: flex;
        text-align: left;
    }
    .py-2 .wrap{
        background-image: linear-gradient(to left, #4bff00, white);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
    }
</style>
<style scoped>
  .personal{
    /* min-height: 100vh; */
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: left;
    /* background-color: #000000; */

  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: left;
    text-align: left;
    padding: 2rem;
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }
  
  .greeting {
    color: #4bff00;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    letter-spacing: 1.5px;
  }
  
  .content {
    text-align: center;
    max-width: 600px;
  }
  
  .name-title h2 {
    font-size: 2.8rem;
    margin-bottom: 0.5rem;
    color: #ffffff;
    text-align: left;
  }
  
  .name-title h3 {
    font-size: 1.8rem;
    color: #7f8c8d;
    margin-bottom: 3rem;
    text-align: left;

  }
  
  .welcome-section {
    font-size: 1.4rem;
    margin-bottom: 3rem;
    color: #ffffff;
  }
  
  .green-dot {
    vertical-align: middle;
    margin-left: 0.5rem;
  }
  
  .resume-button {
    display: inline-block;
    padding: 1rem 2.5rem;
    background-color: #27ae60;
    color: white;
    text-decoration: none;
    border-radius: 25px;
    font-size: 1.2rem;
    transition: background-color 0.3s;
    border: 2px solid transparent;
  }
  
  .resume-button:hover {
    background-color: #219a52;
    border-color: #1d8348;
  }
  
  @media (max-width: 768px) {
    .greeting {
      font-size: 2rem;
    }
    
    .name-title h2 {
      font-size: 2rem;
    }
    
    .name-title h3 {
      font-size: 1.4rem;
    }
  }
.flex img{
    border-radius: 100%;
    border:solid 3px #4bff00;
}
  </style>