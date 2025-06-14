import { createRouter, createWebHistory } from 'vue-router';

// 导入所有的组件
import Home from '@/pages/index.vue';
import Login from '@/pages/login.vue';
import Register from '@/pages/register.vue';
import Forgot from '@/pages/forgot.vue';
import Loading from '@/components/Loading.vue';
import Personal from '@/pages/personal.vue';
import Homeview from '@/view/homeview.vue';
import EditPassword from '@/view/editpassword.vue';
import Edit from '@/view/edit.vue';
import Community from '@/pages/community.vue';
import CommunityMain from '@/view/communitymain.vue';
import CommunityBlogs from '@/view/communityblogs.vue';
import CommunityCreate from '@/view/communitycreate.vue';
import CommunityMy from '@/view/communitymy.vue';
import CommunityMall from '@/view/communitymall.vue';
import MyCommunity from '@/view/mycommunity.vue';
import CommunityDetails from '@/view/communitydetails.vue';
import Chat from '@/view/chat.vue';
import Post from '@/view/post.vue';
import AI from '@/view/communitAI.vue';
import marketVue from '@/pages/market.vue';
import watchVue from '@/pages/watch.vue';
import DuckCare from '@/pages/duckcare.vue';
import DuckSize from '@/pages/ducksize.vue';
import DuckFeed from '@/pages/feed.vue';
import DuckAnalysis from '@/pages/analysis.vue';
import DuckpriTracker from '@/pages/duckpricetracker.vue';
import DuckHelp from '@/pages/help.vue';
import { component } from 'vue/types/umd';
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/forgot',
    name: 'forgotVue',
    component: Forgot
  },
  {
    path:'/loading',
    component: Loading
  },
  {
    path:'/duckcare',
      redirect: '/duckcare/ducksize',
    component: DuckCare,
    children:[
      {
        path:'/duckcare/ducksize',
        component: DuckSize
      },
      {
        path:'/duckcare/duckfeed',
        component: DuckFeed
      },
      {
        path:'/duckcare/duckanalysis',
        component: DuckAnalysis
      },
      {
        path:'/duckcare/duckpricetracker',
        component:DuckpriTracker
      },
      {
        path:'/duckcare/help',
        component:DuckHelp
      }
      // {
      //   path:'/mine/myduck/:id/edit',
      // }
    ]
  },
  {
    path: '/mine',
    component: Personal,
    redirect: '/mine/homeview',
    children: [
      {
        path: 'homeview',
        component: Homeview
      },
      {
        path: 'editpassword',
        component: EditPassword
      },
      {
        path: 'edit',
        component: Edit
      }
    ]
  },
  {
    path:'/community',
    component: Community,
    redirect:'/community/main',
    children: [
      {
        path: 'main',
        component: CommunityMain,
        beforeEnter: (to, from, next) => {
          // 检查是否存在 token
          const token = localStorage.getItem('authToken'); // 或 sessionStorage.getItem('token')
      
          // 如果存在 token，允许进入
          if (token) {
            next();
          } else {
            if (from.name) {
              next('/login');
            } else {
              next();
            }
          }
        }
      },
      {
        path: 'blogs',
        component: CommunityBlogs
      },
      {
        path: 'create',
        component: CommunityCreate
      },
      {
        path: 'my',
        component: CommunityMy
      },
      {
        path: 'mall',
        component: CommunityMall
      },
      {
        path: 'mine',
        component: MyCommunity
      },
      {
        path: 'details/:question_id',
        component: CommunityDetails
      },
      {
        path: 'chat',
        component: Chat,
        props: (route) => ({ query: route.query })
      },
      {
        path:'AI',
        component:AI
      }
    ]
  },
  {
    path: '/post/:postId',
    name: 'Post',
    component: Post,
    props: true
  },
  {
    path:'/market',
    component:marketVue
  },
  {
    path:'/watch',
    component:watchVue
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
