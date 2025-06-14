<template>
    <div>
      <h3 class="uk-text-lead">社区</h3>
      <div data-uk-filter="target: .js-filter">
        <ul class="uk-subnav uk-subnav-pill">
          <li class="uk-active" data-uk-filter-control=""><a href="#">全部</a></li>
          <li data-uk-filter-control="[data-type='strategy']"><a href="#">养殖技术</a></li>
          <li data-uk-filter-control="[data-type='contact']"><a href="#">品种交流</a></li>
          <li data-uk-filter-control="[data-type='mall']"><a href="#">市场动态</a></li>
          <li data-uk-filter-control="[data-type='share']"><a href="#">经验分享</a></li>
          <li data-uk-filter-control="[data-type='infrastructure']"><a href="#">设施建设</a></li>
          <li data-uk-filter-control="[data-type='nourish']"><a href="#">饲料与营养</a></li>
          <li data-uk-filter-control="[data-type='protection']"><a href="#">环保与可持续发展</a></li>
          <li data-uk-filter-control="[data-type='fun']"><a href="#">休闲娱乐</a></li>
          <li data-uk-filter-control="[data-type='resource']"><a href="#">合作与资源</a></li>
          <li data-uk-filter-control="[data-type='application']"><a href="#">科技创新与应用</a></li>
        </ul>
  
        <ul class="js-filter uk-grid-small uk-child-width-1-1 uk-child-width-1-5@xl uk-child-width-1-4@l uk-child-width-1-3@m uk-child-width-1-2@s" data-uk-grid="">
          <li v-for="post in posts" :key="post.post_id" :data-type="post.type" style="margin-bottom: 20px;">
            <div class="stream-item"style="height:100%!important">
              <div class="stream-item__box" style="height:90%!important">
                <div class="stream-item__media" data-uk-lightbox="video-autoplay: true" style="height:70%!important">
                  <!-- <a :href="post.cover" data-attrs="width: 1280; height: 720;" :data-caption="post.title"> -->
                    <img :src="post.cover" :alt="post.title" style="height:100%!important;width: 100%;">
                  <!-- </a> -->
                </div>
                <div class="stream-item__body">
                  <div class="stream-item__title">{{ post.title }}</div>
                  <div class="stream-item__nicname">{{ post.username }}</div>
                  <div class="stream-item__time">{{ formatTime(post.update_time) }}</div>
                  <router-link :to="`/post/${post.post_id}`">点击前往</router-link>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="uk-text-center uk-margin" style="align-items:center;display:flex;justify-content:center">
          <a href="#" role="button" class="btn btn-link btn-link-loader btn-sm text-secondary d-flex align-items-center" data-bs-toggle="button" aria-pressed="true"@click="loadMore"
          :disabled="!hasMore || isLoading">
              <div class="spinner-dots me-2">
                  <span class="spinner-dot"></span>
                  <span class="spinner-dot"></span>
                  <span class="spinner-dot"></span>
              </div>
              {{ isLoading ? '加载中...' : '点击加载更多' }}
          </a>
        </div>

      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted} from 'vue';
  import axios from 'axios';
  import { baseURL } from '@/config/apiConfig';

  const posts = ref([]);
  const filterType = ref('');
  const currentPage = ref(1);
  const isLoading = ref(false);
  const hasMore = ref(true);
  const pageSize = 8;
  const filteredPosts = computed(() => {
    if (filterType.value === '') {
      return posts.value;
    } else {
      return posts.value.filter(post => post.type === filterType.value);
    }
  });
  
  const fetchPosts = async (page = 1) => {
    if (isLoading.value || !hasMore.value) return;
    isLoading.value = true;
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await axios.get(`${baseURL}/post/getAllPost/`, {
        params: { page, size:pageSize },
        headers: { 'token': token }
      });
      if (response.data.code === 200) {
        const newPosts = response.data.data.list;
        if (newPosts.length === 0) {
        hasMore.value = false;
      } else {
        posts.value = [...posts.value, ...newPosts];
        currentPage.value = page;
      }
      } 
    } catch (error) {
      console.error('Error fetching posts:', error);
    }finally {
    isLoading.value = false;
  }
  };
  const loadMore = () => {
  fetchPosts(currentPage.value + 1);
};
  const handleFilterType = (type) => {
    filterType.value = type;
  };
  
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  onMounted(() => {
  fetchPosts(1);
});
  </script>
  
<style scoped>
@import '../assets/css/css2.css';
@import '../assets/css/css21.css';
@import '../assets/css/css22.css';
@import '../assets/css/remain.css';
@import '../assets/css/libs.min.css';
@import url('../assets/css/choices.min.css');
@import url('../assets/css/style.css');
@import url('../assets/css/all.min.css');
@import url('/node_modules/bootstrap-icons/font/bootstrap-icons.css');
</style>