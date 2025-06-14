<template>

    <body class="page-home">
        <div class="page-wrapper">
            <header class="page-header">
                <div class="page-header__inner">
                    <div class="page-header__sidebar">
                        <div class="page-header__menu-btn"><button class="menu-btn ico_menu is-active"></button></div>
                        <div class="page-header__logo"><img src="/src/img/logo.png" alt="logo"><span class="page-header__logo_text">COMMUNITY</span></div>
                    </div>
                    <div class="page-header__content">
                        <div class="page-header__search">
                            <div class="search">
                                <div class="search__input"><i class="ico_search"></i><input type="search" name="search" placeholder="Search"></div>
                                <div class="search__btn"><button type="button"><i class="ico_microphone"></i></button></div>
                            </div>
                        </div>
                        <div class="page-header__action"><a class="action-btn" href="#"><i class="ico_message"></i><span></span></a><a class="action-btn" href="#"><i class="ico_notification"></i><span></span></a><router-link class="profile" to="/mine"><img class="avatar-img rounded-circle" :src="userAvatar" alt="">
                        </router-link></div>
                    </div>
                </div>
            </header>
            <main>
                <div class="container">
                    <div class="row g-4">
                        <div class="col-lg-3">
                            <div class="d-flex align-items-center d-lg-none">
                                <button class="border-0 bg-transparent" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSideNavbar" aria-controls="offcanvasSideNavbar">
                                    <i class="btn btn-primary fw-bold fa-solid fa-sliders-h"></i>
                                    <span class="h6 mb-0 fw-bold d-lg-none ms-2">详情</span>
                                </button>
                            </div>
  
                            <nav class="navbar navbar-expand-lg mx-0">
                                <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasSideNavbar">
                                    <div class="offcanvas-header">
                                        <button type="button" class="btn-close text-reset ms-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                    </div>
                                    <div class="offcanvas-body d-block px-2 px-lg-0">
                                        <div class="card overflow-hidden">
                                            <div class="h-50px" style="background-image:url(/src/image/bg/01.jpg); background-position: center; background-size: cover; background-repeat: no-repeat;"></div>
                                            <div class="card-body pt-0">
                                                <div class="text-center">
                                                    <div class="avatar avatar-lg mt-n5 mb-3">
                                                        <a href="#!"><img class="avatar-img rounded border border-white border-3" :src="authorAvatar" alt=""></a>
                                                    </div>
                                                    <h5 class="mb-0" style="display: flex; justify-content: center;">
                                                      <p>{{ author.username }}</p>
                                                      <p :style="{ color: author.userType === 1 ? 'grean' : (author.userType === 2 ? '#f6cd06' : (author.userType === 3 ? 'blue' : '')) }">
                                                        <i class="bi bi-patch-check"></i>
                                                      </p>
                                                    </h5>

                                                    <small>{{author.affiliation}}</small>
                                                    <p class="mt-3">{{ author.introduce }}</p>
                                                    <div class="hstack gap-2 gap-xl-3 justify-content-center">
                                                        <div>
                                                            <h6 class="mb-0">{{ author.postTotal }}</h6>
                                                            <small>文章</small>
                                                        </div>
                                                        <div class="vr"></div>
                                                        <div>
                                                            <h6 class="mb-0">{{ author.fanTotal }}</h6>
                                                            <small>粉丝</small>
                                                        </div>
                                                        <div class="vr"></div>
                                                        <div>
                                                            <h6 class="mb-0">{{ author.followTotal }}</h6>
                                                            <small>关注</small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr>
                                                <ul class="nav nav-link-secondary flex-column fw-bold gap-2">
                                                  <li class="nav-item">
  <router-link 
    class="nav-link" 
    :to="{ path: '/community/chat', query: { userId: post.userId, username: post.username, avatar: authorAvatar } }"
  >
    <img class="me-2 h-20px fa-fw" src="../image/icon/chat-outline-filled.svg" alt="">
    <span>私信</span>
  </router-link>
</li>
                                                    <li class="nav-item">
                                                        <a class="nav-link" href="#"> <img class="me-2 h-20px fa-fw" src="../image/icon/person-outline-filled.svg" alt=""><span>举报 </span></a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="card-footer text-center py-2" >
                                                <a class="btn btn-primary-soft ms-auto w-100" href="#" data-bs-toggle="modal" data-bs-target="#modalCreateGroup" @click.prevent="toggleFollow" :style="{ backgroundColor: isFollowing ? '#16ec0f1a' : '#107a0e', color: isFollowing ? '#107a0e' : '#fff' }"> <i :class="[
                                                      'pe-1', 
                                                      isFollowing ? 'bi bi-person-check-fill' : 'fa-solid fa-plus'
                                                    ]"
                                                  ></i>
                                                  {{ isFollowing ? '已关注' : '关注' }}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>
                        <div class="col-md-8 vstack gap-4">
                            <div class="card">
                                <div class="card-body">
                                     <div class="cover" style="width: 100%;height: 400px;border-radius: 0.4rem;">
                                      <img 
                                        :src="post.cover || 'https://eb118-file.cdn.bcebos.com/upload/87293d1278324deca9cdd4335095ac39_1134932423.png'" 
                                        style="width: 100%;height: 100%;border-radius: 0.4rem;"> 
                                     </div>
                                    <div class="d-flex my-3">
                                        <div>
                                          <a href="#" class="badge bg-danger bg-opacity-10 text-danger mb-2 fw-bold">{{ post.type }}</a>
                                            <h1 class="h4">{{ post.title }} </h1>
                                            <ul class="nav nav-stack gap-3 align-items-center">
                                            <li class="nav-item">
                                              <div class="nav-link">
                                                by <a href="#" class="text-reset btn-link">{{ post.username }}</a>
                                              </div>
                                            </li>
                                            <li class="nav-item"> <i class="bi bi-calendar-date pe-1"></i>{{ post.time }}</li>
                                          </ul>
                                            <template v-for="(paragraph, index) in post.content" :key="index">
                                              <p :class="{ 'mt-4': index === 0 }" v-if="paragraph">
                                                <span v-if="index === 0" class="dropcap">{{ paragraph[0] }}</span>
                                                {{ index === 0 ? paragraph.slice(1) : paragraph }}
                                              </p>
                                            </template>
                                        </div>
                                        <div class="dropdown ms-auto">
                                            <a href="#" class="text-secondary" :class="{ 'show': isDropdownOpen }" id="feedVideoActionEdit" data-bs-toggle="dropdown" :aria-expanded="isDropdownOpen.toString()"
                                            @click="handleDropdownToggle">
                                                <i class="bi bi-three-dots"></i>
                                            </a>
                                            <ul class="dropdown-menu dropdown-menu-end" :class="{ 'show': isDropdownOpen }" aria-labelledby="feedVideoActionEdit">
                                              <li>
                                                  <a class="dropdown-item" href="#" @click.prevent="toggleCollect">
                                                    <i :class="['bi', isCollected ? 'bi-bookmark-fill' : 'bi-bookmark', 'fa-fw', 'pe-1']"></i>
                                                    收藏（{{totalFavorites}}）
                                                  </a>
                                                </li>
                                                <li><a class="dropdown-item" href="#" @click="copyCurrentPageUrl"> <i class="bi bi-link-45deg fa-fw pe-1"></i> 复制链接 </a></li>
                                                <li><a class="dropdown-item" href="#"> <i class="bi bi-x-circle fa-fw pe-1"></i> Hide post</a></li>
                                                <li><a class="dropdown-item" href="#"> <i class="bi bi-slash-circle fa-fw pe-1"></i> Block</a></li>
                                                <li>
                                                    <hr class="dropdown-divider">
                                                </li>
                                                <li><a class="dropdown-item" href="#"> <i class="bi bi-flag fa-fw pe-1"></i> Report post</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <ul class="nav nav-stack small mt-4">
                                      <li class="nav-item">
                                        <a class="nav-link" :class="{ 'active': postLikes.isLiked }" href="#" @click.prevent="togglePostLike">
                                          <i :class="['bi', postLikes.isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up', 'pe-1']"></i>
                                          Liked ({{ postLikes.likeCount }})
                                        </a>
                                      </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#"> <i class="bi bi-chat-fill pe-1"></i>Comments ({{ totalComments }})</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#!"> <i class="bi bi-eye-fill pe-1"></i>458M Views</a>
                                        </li>
                                        <li class="nav-item ms-sm-auto">
                                            <div class="dropdown">
                                                <a href="#" class="text-secondary" id="feedvideoActionShare" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i class="bi bi-reply-fill fa-flip-horizontal pe-1"></i>Share (3K)
                                                </a>
                                                <!-- Dropdown menu -->
                                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="feedvideoActionShare">
                                                    <li><a class="dropdown-item" href="#"> <i class="bi bi-envelope fa-fw pe-1"></i> Send via Direct Message</a></li>
                                                    <li><a class="dropdown-item" href="#"> <i class="bi bi-bookmark-check fa-fw pe-1"></i> Bookmark </a></li>
                                                    <li><a class="dropdown-item" href="#"> <i class="bi bi-link fa-fw pe-1"></i> Copy link to post</a></li>
                                                    <li><a class="dropdown-item" href="#"> <i class="bi bi-share fa-fw pe-1"></i> Share post via …</a></li>
                                                    <li><a class="dropdown-item" href="#"> <i class="bi bi-code-slash fa-fw pe-1"></i> Embed</a></li>
                                                    <li>
                                                        <hr class="dropdown-divider">
                                                    </li>
                                                    <li><a class="dropdown-item" href="#"> <i class="bi bi-pencil-square fa-fw pe-1"></i> Share to News Feed</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                    </ul>
                                    <div class="d-flex my-3">
  <div class="avatar avatar-xs me-2">
    <img class="avatar-img rounded-circle" :src="userAvatar" alt="avatar">
  </div>
  <form class="position-relative w-100" @submit.prevent="submitComment">
    <div v-if="selectedComment" class="text-muted small mb-1">
      <button type="button" @click="cancelReply" class="btn btn-link btn-sm p-0 ms-2">取消</button>
    </div>
    <div class="position-relative w-100">
  <textarea 
    v-model="newComment" 
    class="form-control pe-4 bg-light" 
    rows="3" 
    :placeholder="replyPlaceholder"
    style="padding-right: 80px;"
  ></textarea>
  <button 
    type="submit" 
    class="btn btn-primary btn-sm position-absolute" 
    style="bottom: 10px; right: 10px;"
  ><i class="bi bi-send"></i>
    发送
  </button>
</div>
  </form>
</div>
                                    <ul class="comment-wrap list-unstyled">
    <li 
      v-for="comment in commentsList" 
      :key="comment.commentId" 
      class="comment-item"
    >
      <!-- 顶级评论 -->
      <div class="d-flex position-relative">
        <div class="avatar avatar-xs">
          <img 
            class="avatar-img rounded-circle" 
            :src="comment.avatar" 
            :alt="comment.username"
            style="width: 100%;height: 100%;"
          >
          <img :src="comment.avatarIcon" style="width:20px;height: 20px;position: relative;bottom:90%;left:75%">
        </div>
        <div class="ms-2 wide"  @click="handleReply(comment)">
          <div class="bg-light rounded-start-top-0 p-3 rounded">
            <div class="d-flex justify-content-between">
              <div class="d-flex">
                <h6 class="mb-1">{{ comment.username }}</h6>
                <small class="ms-2">{{ formatTime(comment.commentTime) }}</small>
              </div>
              <div @click.stop="toggleCommentLike(comment)">
            <img :src="comment.isLiked ? '/img/like_fill.png' : '/img/like.png'" style="width: 20px;">
            <small>{{ comment.likeCount }}</small>
          </div>
            </div>
            <p class="small mb-0">{{ comment.content }}</p>
          </div>
        </div>
      </div>
  
      <!-- 子评论（递归渲染） -->
      <ul 
        v-if="comment.children && comment.children.length" 
        class="comment-item-nested list-unstyled"
      >
        <li 
          v-for="child in comment.children" 
          :key="child.commentId" 
          class="comment-item"
        >
          <div class="d-flex">
            <div class="avatar avatar-xs">
              <img 
                class="avatar-img rounded-circle" 
                :src="child.avatar" 
                :alt="child.username"
              >
          <img :src="child.avatarIcon" style="width:20px;height: 20px;position: relative;bottom:90%;left:75%">
              
            </div>
            <div class="ms-2 wide"  @click="handleReply(comment)">
              <div class="bg-light rounded-start-top-0 p-3 rounded">
                <div class="d-flex justify-content-between">
                  <div class="d-flex">
                    <h6 class="mb-1">{{ child.username }}</h6>
                    <h6 style="color: #676A79;"><i class="bi bi-caret-right-fill"></i>{{ comment.username }}</h6>
                    <small class="ms-2">{{ formatTime(child.commentTime) }}</small>
                  </div>
                  <div @click.stop="toggleCommentLike(child)">
            <img :src="child.isLiked ? '/img/like_fill.png' : '/img/like.png'" style="width: 20px;">
            <small>{{ child.likeCount }}</small>
          </div>
                </div>
                <p class="small mb-0">{{ child.content }}</p>
              </div>
            </div>
          </div>
          <!-- 三级评论 -->
          <ul
              v-if="child.children && child.children.length"
              class="comment-item-nested list-unstyled" style="padding-left: 0!important;"
            >
              <li
                v-for="grandChild in child.children"
                :key="grandChild.commentId"
                class="comment-item"
              >
                <div class="d-flex">
                  <div class="avatar avatar-xs">
                    <img
                      class="avatar-img rounded-circle"
                      :src="grandChild.avatar"
                      :alt="grandChild.username"
                    />
          <img :src="grandChild.avatarIcon" style="width:20px;height: 20px;position: relative;bottom:90%;left:75%">

                  </div>
                  <div class="ms-2 wide"  @click="handleReply(comment)">
                    <div class="bg-light rounded-start-top-0 p-3 rounded">
                      <div class="d-flex justify-content-between">
                        <div class="d-flex">
                          <h6 class="mb-1">{{ grandChild.username }}</h6>
                    <h6 style="color: #676A79;"><i class="bi bi-caret-right-fill"></i>{{ child.username }}</h6>

                          <small class="ms-2">{{ formatTime(grandChild.commentTime) }}</small>
                        </div>
                        <div @click.stop="toggleCommentLike(grandChild)">
            <img :src="grandChild.isLiked ? '/img/like_fill.png' : '/img/like.png'" style="width: 20px;">
            <small>{{ grandChild.likeCount }}</small>
          </div>
                      </div>
                      <p class="small mb-0">{{ grandChild.content }}</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
        </li>
      </ul>
    </li>
  </ul>
                                <div class="card-footer border-0 py-0">
                                        <a href="#" role="button" class="btn btn-link btn-link-loader btn-sm text-secondary d-flex align-items-center" data-bs-toggle="button" aria-pressed="true"@click="loadMoreComments">
                                            <div class="spinner-dots me-2">
                                                <span class="spinner-dot"></span>
                                                <span class="spinner-dot"></span>
                                                <span class="spinner-dot"></span>
                                            </div>
                                            加载更多评论
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
  
                    </div>
                </div>
  
            </main>
        </div>
    </body>
  </template>
  <script>
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import { onMounted, ref ,computed,nextTick,onBeforeUnmount} from 'vue';
  import { ElNotification } from 'element-plus';
  import { Dropdown } from 'bootstrap'
  import { baseURL } from '@/config/apiConfig';

  const userAvatar = ref('/img/my-notion-face-transparent.png');
  const authorAvatar = ref('/img/my-notion-face-transparent.png');
  const newComment = ref('');
  export default {
    props:{
      postId: {
      type: String,
      required: true,
    }
    },
    setup(props) {
      const route = useRoute();
      const postId = props.postId || route.params.postId;
      const commentsList = ref([]);
      const totalFavorites = ref("");
      const isCollected = ref(false);
      const token = localStorage.getItem('authToken'); 
      const totalComments=ref("");
      const page = ref(1);
      const pageSize = 4;
      const selectedComment = ref(null);
      const isFollowing = ref(0);
      const isDropdownOpen = ref(false);
      const author=ref({
        username:'',
        avatar:'/img/my-notion-face-transparent.png',
        introduce:null,
        affiliation:null,
        postTotal:'0',
        userType:'1',
        followTotal:'0',
        fanTotal:'0',
        isFollowed:'0'
      })
      const post = ref({
        title: '',
        cover: null,
        type: '',
        username: '',
        time: '',
        content: [],
        userId:''
      });
      const postLikes = ref({
        isLiked: false,
        likeCount: 0
      });
      //获取帖子点赞量
      const fetchPostLikeStatus = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/operate/countLike/`,
      {
        targetType: 1,
        targetId: postId
      },
      {
        headers: {
          'token': token,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.code === 200) {
      postLikes.value = {
        isLiked: response.data.data.is_liked === 1,
        likeCount: formatNumber(response.data.data.collect_count)
      };
    }
  } catch (error) {
    console.error('获取点赞状态失败:', error);
  }
      };
      //帖子点赞操作
      const togglePostLike = async () => {
        try {
          const endpoint = postLikes.value.isLiked ? 'cancelLike' : 'addLike';
          const response = await axios.post(
            `${baseURL}/operate/${endpoint}/`,
            {
              targetType: 1,
              targetId: postId
            },
            {
              headers: {
                'token': token,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data.code === 200) {
            postLikes.value.isLiked = !postLikes.value.isLiked;
            postLikes.value.likeCount = formatNumber(
              postLikes.value.isLiked 
                ? parseInt(postLikes.value.likeCount) + 1 
                : parseInt(postLikes.value.likeCount) - 1
            );
          }
        } catch (error) {
          console.error('操作失败:', error);
        }
      };
      //评论点赞操作
      const toggleCommentLike = async (comment) => {
  try {
    const endpoint = comment.isLiked ? 'cancelLike' : 'addLike';
    const response = await axios.post(
      `${baseURL}/operate/${endpoint}/`,
      {
        targetType: 2,
        targetId: comment.commentId
      },
      { headers: { 'token': token } }
    );

    if (response.data.code === 200) {
      comment.isLiked = !comment.isLiked;
      comment.likeCount = formatNumber(
        comment.isLiked 
          ? parseInt(comment.likeCount) + 1 
          : parseInt(comment.likeCount) - 1
      );
    }
  } catch (error) {
    console.error('操作失败:', error);
  }
      };
      //获取帖子详情
      const fetchPostDetail = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/post/postInfo/?postId=${postId}`,{
        headers:{
          'token':token
        }
      }
    );
    if (response.data.code === 200) {
      const { title, cover, type, username, content, time ,userId} = response.data.data;
      const typeMapping = {
        'strategy': '养殖技术',
        'contact': '品种交流',
        'mall': '市场动态',
        'share': '经验分享',
        'infrastructure': '设施建设',
        'nourish': '饲料与营养',
        'protection': '环保与可持续发展',
        'fun': '休闲娱乐',
        'resource': '合作与资源',
        'application': '科技创新与应用'
      };
      let displayType = typeMapping[type] || type;
      post.value = {
        title,
        cover,
        type:displayType,
        username,
        time,
        content,
        userId
      };
    }
  } catch (error) {
    console.error('获取帖子详情失败:', error);
  }
      };
      // 数量格式化
      const formatNumber = (num) => {
        if (num >= 1000000) {
          return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
          return (num / 1000).toFixed(1) + 'K';
        }
        return num;
      };
      //收藏量
      const fetchFavorites = async () => {
        try {
          const response = await axios.get(
            `${baseURL}/operate/countCollect/`,
            {
              params: {
                postId: postId
              },
              headers: {
                'token': token,
                'Content-Type': 'application/json'
              }
            }
          );
          if (response.data.code === 200) {
            totalFavorites.value = formatNumber(response.data.data.collect_count); 
            isCollected.value = response.data.data.is_collected === 1;
          }
        } catch (error) {
          console.error('获取收藏总数失败:', error);
        }
      };
      //收藏操作
      const toggleCollect = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const endpoint = isCollected.value ? 'cancelCollect/' : 'addCollect/';
        
        const response = await axios.post(
          `${baseURL}/operate/${endpoint}`,
          { postId },
          { headers: { 'token': token ,
            'Content-Type': 'application/x-www-form-urlencoded',
          } }
        );

        if (response.data.code === 200) {
          isCollected.value = !isCollected.value;
          await fetchFavorites(); // 刷新收藏数
          ElNotification({
            title: '成功',
            message: isCollected.value ? '收藏成功！' : '已取消收藏',
            type: 'success',
          });
        }
      } catch (error) {
        ElNotification({
          title: '操作失败',
          message: '请稍后重试',
          type: 'error',
        });
        console.error('收藏操作失败:', error);
      }
      };
    // 复制链接功能
const copyCurrentPageUrl = async () => {
  try {
    // 获取当前页面的完整 URL
    const currentUrl = window.location.href;
    
    // 尝试使用现代 API 复制到剪贴板
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(currentUrl);
      showNotification('success', '链接已成功复制到剪贴板！');
    } 
    // 兼容处理（针对不支持 navigator.clipboard 的浏览器）
    else {
      // 创建一个临时textarea元素
      const textarea = document.createElement('textarea');
      textarea.value = currentUrl;
      textarea.style.position = 'fixed'; // 防止页面滚动
      textarea.style.opacity = '0'; // 隐藏元素
      
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy'); // 使用旧的复制 API
      
      document.body.removeChild(textarea); // 移除临时元素
      showNotification('success', '链接已成功复制到剪贴板！');
    }
  } catch (error) {
    console.error('复制链接失败:', error);
    showNotification('error', '复制链接失败，请手动复制：' + window.location.href);
  }
};

// 显示通知的辅助函数
const showNotification = (type, message) => {
  ElNotification({
    title: type === 'success' ? '成功' : '错误',
    message,
    type: type,
    duration: 3000 // 3秒后自动消失
  });
};
      // 添加时间格式化函数
      const formatTime = (timeString) => {
        const date = new Date(timeString);
        return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      };
      //获取评论
      const fetchComments = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/comment/getComment/`,
      { postId: postId, page: page.value, size: pageSize },
      { headers: { 'token': token } }
    );

    const newComments = response.data.data.list || [];

    // 为每个评论获取点赞信息
    const processComment = async (comment) => {
      try {
        comment.avatar = comment.avatar || '/img/my-notion-face-transparent.png';
        const likeResponse = await axios.post(
          `${baseURL}/operate/countLike/`,
          { targetType: 2, targetId: comment.commentId },
          { headers: { 'token': token } }
        );

        comment.isLiked = likeResponse.data.data.is_liked === 1;
        comment.likeCount = formatNumber(likeResponse.data.data.collect_count);
        comment.avatarIcon = getAvatarIcon(comment.roleName);
        // 递归处理子评论
        if (comment.children) {
          for (const child of comment.children) {
            await processComment(child);
            child.avatar = child.avatar || '/img/my-notion-face-transparent.png';
          }
        }
      } catch (error) {
        console.error('获取评论点赞失败:', error);
      }
    };

    // 并行处理所有评论
    await Promise.all(newComments.map(processComment));

    commentsList.value = page.value === 1 
      ? newComments 
      : [...commentsList.value, ...newComments];

  } catch (error) {
    console.error('请求评论失败:', error);
  }
      };
      //加载更多评论
      const loadMoreComments = () => {
      page.value++;
      fetchComments();
    };
      //获取评论数
      const fetchCommentsCount = async () => {
        try {
          const response = await axios.get(
            `${baseURL}/comment/countCollect/`,
            {
              params: {
                postId: postId
              },
              headers: {
                'token': token,
                'Content-Type': 'application/json'
              }
            }
          );
          if (response.data.code === 200) {
            totalComments.value = formatNumber(response.data.data); 
          }
        } catch (error) {
          console.error('获取评论总数失败:', error);
        }
      };
      //用户身份
      const getAvatarIcon = (roleName) => {
  switch (roleName) {
    case 'farmer':
      return '/img/prove1.png';
    case 'company':
      return '/img/prove2.png';
    case 'expert':
      return '/img/prove3.png';
    default:
      return '';
  }
};
      //计算placeholder
      const replyPlaceholder = computed(() => 
      selectedComment.value 
        ? `回复 ${selectedComment.value.username}` 
        : '添加评论...'
    );
    //获取用户信息
        const fetchUserInfo = async() =>{
    console.log(token);
    if (!token) {
    console.error('Token not found!');
    return;
    }
    try {
    const response = await axios.post(
    `${baseURL}/user/getUserInfo/`,
    {}, 
    {
    headers: {
    'token': token
    }
    }
    );     
    console.log(response.data);
    if (response.data.code === 200) {
      
    userAvatar.value = response.data.data.avatar || '/img/my-notion-face-transparent.png';
    console.log(userAvatar.value)
    await nextTick(() => {
            console.log('DOM 更新完毕');
          });
    } else {
    console.error('Error fetching user info:', response.data.message);
    }
    } catch (error) {
    console.error('Error fetching user info:', error);
    }
    }
    // 发送评论
    const submitComment = async () => {
      console.log(newComment.value);
  if (!newComment.value.trim()) return;
  if (!token) {
    ElNotification({ title: '未登录', message: '请先登录', type: 'error' });
    return;
  }
  try {
    const payload = {
      postId: postId,
      content: newComment.value.trim(),
      parentCommentId: selectedComment.value?.commentId || "0", // 确保拼写正确
      rootCommentId: selectedComment.value?.rootCommentId || "0"
    };
    console.log("发送请求体:", payload);
    const response = await axios.post(
      `${baseURL}/comment/sendComment/`,
      payload,
      {
        headers: {
          'token': token,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 200) {
      ElNotification({
        title: '成功',
        message: '评论已发送',
        type: 'success'
      });
      newComment.value = '';
      selectedComment.value = null;
      await fetchComments();
      await fetchCommentsCount();
    }
  } catch (error) {
    ElNotification({
      title: '发送失败',
      message: '请检查网络或重试',
      type: 'error'
    });
    console.error('评论提交失败:', error);
  }
    };
    // 取消回复
    const cancelReply = () => {
      selectedComment.value = null;
    };
    // 添加回复方法
    const handleReply = (comment) => {
      selectedComment.value = {
        commentId: comment.commentId,
        rootCommentId: comment.rootCommentId === "0" 
          ? comment.commentId 
          : comment.rootCommentId,
        username: comment.username
      };
    };
    //获取作者信息
    const fetchAuthorInfo = async() =>{
      const userId = post.value.userId;
    if (!userId) {
      console.error('未获取到用户ID');
      return;
    }
    if (!token) {
    console.error('Token not found!');
    return;
    }
    try {
    const response = await axios.get(
    `${baseURL}/user/AutorInfo/?userId=${userId}`,
    {
    headers: {
    'token': token
    }
    }
    );     
    console.log(response.data);
    if (response.data.code === 200) {
      const {
        userType,
        avatar,
        type,
        username,
        introduce,
        postTotal,
        affiliation,
        fanTotal,
        followTotal,
        isFollowed,
        userId
      } = response.data.data;
      author.value = {
        userType,
        avatar,
        type,
        username,
        introduce,
        postTotal,
        affiliation,
        fanTotal,
        followTotal,
        isFollowed,
        userId
      };
      isFollowing.value = response.data.data.isFollowed === 1 ? 1 : 0;
    authorAvatar.value = response.data.data.avatar || '/img/my-notion-face-transparent.png';
    console.log(userAvatar.value)
    await nextTick(() => {
            console.log('DOM 更新完毕');
          });
    } else {
    console.error('Error fetching user info:', response.data.message);
    }
    } catch (error) {
    console.error('Error fetching user info:', error);
    }
    }
    //对作者的关注操作
    const toggleFollow = async () => {
  try {
    const endpoint = isFollowing.value ? 'unfollow' : 'follow';
    const response = await axios.post(
      `${baseURL}/user/${endpoint}`,
      `followingId=${post.value.userId}`,
      {
        headers: {
          'token': token,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data.code === 200) {
      isFollowing.value = !isFollowing.value;
      ElNotification({
        title: '成功',
        message: isFollowing.value ? '关注成功' : '已取消关注',
        type: 'success'
      });
      await fetchAuthorInfo();
    }
  } catch (error) {
    ElNotification({
      title: '操作失败',
      message: error.response?.data?.message || '请求出错',
      type: 'error'
    });
  }
};
// 下拉框
const handleDropdownToggle = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
      onMounted(async() => {
        fetchFavorites();
        fetchComments();
        fetchCommentsCount();
        fetchUserInfo();
        await fetchPostDetail();
        await fetchAuthorInfo();
        fetchPostLikeStatus();
      });
      return { 
        postId, 
        commentsList,
        totalFavorites,
        isCollected,
        totalComments,
        replyPlaceholder,
        userAvatar,
        newComment,
        isFollowing,
        toggleFollow,
        submitComment,
        togglePostLike,
        authorAvatar,
        selectedComment,
        author,
        cancelReply,
        handleReply,
        toggleCollect,
        formatTime,
        copyCurrentPageUrl,
        loadMoreComments,
        post,
        postLikes,
        toggleCommentLike,
        handleDropdownToggle,
        isDropdownOpen
      };
    }
  };
  </script>
  <style scoped>
    @import '@/assets/css/css2.css';
    @import '@/assets/css/css21.css';
    @import '@/assets/css/css22.css';
    @import '@/assets/css/remain.css';
    @import '@/assets/css/libs.min.css';
    @import url('@/assets/css/choices.min.css');
    @import url('@/assets/css/style.css');
    @import url('@/assets/css/all.min.css');
    @import url('/node_modules/bootstrap-icons/font/bootstrap-icons.css');
    main {
        margin-top: 100px;
        background-color: transparent;
    }
    a{
      text-decoration: none;
    }
    .bg-danger{
      background-color: #d6293e1a !important;
    }
    .text-danger{
      color: #d6293e!important;
  
    }
    p{
      color: #676a79;
    }
    textarea.form-control {
    min-height: calc(1.5em + 1rem + 2px);
  }
  
  .ms-2 small{
      color: #676a79;
      font-size: 10px;
  }
  .wide{
      width: 100%;
  }
  .bg-light{
      /* background-color:#EEF0F2!important; */
      border-radius: 0.4rem !important;
      margin-bottom: 20px;
  }
  .justify-content-between{
      width: 100%;
  }
  @media (min-width: 992px) {
    .col-lg-3[data-v-12178962] {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 auto;
        flex: 0 0 auto;
        width: 25%;
    }
}
img[data-v-12178962]:not([src]) {
    visibility: visible;
}
@media (max-width: 576px) {
  .position-absolute {
    bottom: 5px;
    right: 5px;
    padding: 3px 8px;
    font-size: 10px;
  }
  textarea {
    padding-right: 60px;
  }
}
.btn-primary-soft {
  transition: all 0.3s ease;
}
.btn-primary-soft:hover {
  transform: scale(1.02);
}

</style>