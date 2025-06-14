<template>
  <ul class="uk-breadcrumb">
  <li><RouterLink to="#" @click.prevent="goBack"><span data-uk-icon="chevron-left"></span><span>Back</span></RouterLink></li>
  <li><span>Details</span></li>
</ul>
<h3 class="uk-text-lead">问题详情</h3>
<div v-if="loading" class="skeleton-body">
<div class="skeleton-wrapper">
  <div class="skeleton skeleton-text"></div>
  <div class="skeleton skeleton-text"></div>
  <div class="skeleton skeleton-image"></div>
  <div class="skeleton skeleton-image"></div>
</div>
<div class="skeleton skeleton-card"></div>
</div>

<div v-else class="uk-grid uk-grid-small" data-uk-grid="">
  <div class="tab-pane show active fade" id="group-tab-1" style="width: 100%;">
<div class="row g-4">
<div class="col-lg-8 vstack gap-4">
<!-- Share feed START -->
<div v-if="isExpert" class="card card-body">
<div class="d-flex mb-3">
  <!-- Avatar -->
  <div class="avatar avatar-xs me-2">
    <a href="#"> <img class="avatar-img rounded-circle" :src="userAvatar" alt=""> </a>
  </div>
  <!-- Post input -->
  <form class="w-100">
    <input class="form-control pe-4 border-0" placeholder="Share your answers..." data-bs-toggle="modal" data-bs-target="#modalCreateFeed">
  </form>
</div>
<!-- Share feed toolbar START -->
<ul class="nav nav-pills nav-stack small fw-normal">
  <li class="nav-item">
    <a class="nav-link bg-light py-1 px-2 mb-0" href="#!" data-bs-toggle="modal" data-bs-target="#feedActionPhoto"> <i class="bi bi-image-fill text-success pe-2"></i>Photo</a>
  </li>
  <li class="nav-item">
    <a class="nav-link bg-light py-1 px-2 mb-0" href="#!" data-bs-toggle="modal" data-bs-target="#feedActionVideo"> <i class="bi bi-camera-reels-fill text-info pe-2"></i>Video</a>
  </li>
  <li class="nav-item dropdown ms-xl-auto">
    <a class="nav-link bg-light py-1 px-2 mb-0" href="#" id="feedActionShare" data-bs-toggle="dropdown" aria-expanded="false">
      <i class="bi bi-three-dots"></i>
    </a>
    <!-- Dropdown menu -->
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="feedActionShare">
      <li><a class="dropdown-item" href="#"> <i class="bi bi-envelope fa-fw pe-2"></i>Create a poll</a></li>
      <li><a class="dropdown-item" href="#"> <i class="bi bi-bookmark-check fa-fw pe-2"></i>Ask a question </a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#"> <i class="bi bi-pencil-square fa-fw pe-2"></i>Help</a></li>
    </ul>
  </li>
</ul>
<!-- Share feed toolbar END -->
</div>
<!-- Share feed END -->

<!-- Card feed item START -->
<div class="card" v-if="questionData">
<!-- Card header START -->
<div class="card-header border-0 pb-0">
  <div class="d-flex align-items-center justify-content-between">
    <div class="d-flex align-items-center">
      <!-- Avatar -->
      <div class="avatar avatar-story me-2">
          <img class="avatar-img rounded-circle" 
       :src="questionData.question_user_avatar || '/img/my-notion-face-transparent.png'" 
       alt="用户头像">
      </div>
      <!-- Info -->
      <div>
        <div class="nav nav-divider">
          <h6 class="nav-item card-title mb-0"> <a href="#">{{ questionData.question_username }}</a></h6>
          <span class="nav-item small">{{ formatTime(questionData.question_time) }}</span>
        </div>
      </div>
    </div>
    <!-- Card feed action dropdown START -->
    <div class="dropdown">
      <a href="#" class="text-secondary btn btn-secondary-soft-hover py-1 px-2" id="cardFeedAction1" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-three-dots"></i>
      </a>
      <!-- Card feed action dropdown menu -->
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="cardFeedAction1">
        <li><a class="dropdown-item" href="#"> <i class="bi bi-bookmark fa-fw pe-2"></i>Save post</a></li>
        <li><a class="dropdown-item" href="#"> <i class="bi bi-person-x fa-fw pe-2"></i>Unfollow lori ferguson </a></li>
        <li><a class="dropdown-item" href="#"> <i class="bi bi-x-circle fa-fw pe-2"></i>Hide post</a></li>
        <li><a class="dropdown-item" href="#"> <i class="bi bi-slash-circle fa-fw pe-2"></i>Block</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#"> <i class="bi bi-flag fa-fw pe-2"></i>Report post</a></li>
      </ul>
    </div>
    <!-- Card feed action dropdown END -->
  </div>
</div>
<!-- Card header END -->
<!-- Card body START -->
<div class="card-body">
  <h3>{{ questionData.title }}</h3>
  <p>{{ questionData.question_content }}</p>
  <!-- Card img -->
  <img v-if="questionData.image" class="card-img" :src="questionData.image" alt="问题图片">
  <hr>
  <!-- Comment wrap START -->
      <ul class="comment-wrap list-unstyled">
        <template v-if="questionData.answers && questionData.answers.length">
<li class="comment-item" v-for="answer in questionData.answers" :key="answer.answer_id">
  <div class="d-flex">
    <div class="avatar avatar-xs">
      <img class="avatar-img rounded-circle" 
           :src="answer.answer_user_avatar || '/public/img/my-notion-face-transparent.png'" 
           alt="回答者头像"
           @click="fetchExpertData(answer.answer_user)">
    </div>
    <div class="ms-2" style="width: 100%;">
      <div class="bg-light p-3 rounded">
        <div class="d-flex justify-content-between">
          <div class="me-2" style="width: 75%;">
            <h6 class="mb-1">{{ answer.answer_username || '未知用户' }}</h6>
            <p class="small mb-0">{{ answer.answer_content }}</p>
          </div>
          <small style="text-align: right;">
            {{ formatTime(answer.answer_time) }}
            <li class="nav-item" >
              <a class="nav-link" href="#" @click="markAsAccepted(answer)" title="标记为最佳答案">
                <i :class="answer.is_accepted ? 'bi bi-bookmark-star-fill' : 'bi bi-bookmark-star'"></i>
              </a>
            </li>

          </small>
        </div>
      </div>
    </div>
  </div>
</li>
</template>
<div v-else class="text-muted p-3">暂无回答</div>
    </ul>
    <!-- Comment wrap END -->
</div>
<!-- Card body END -->
<!-- Card footer START -->
<div class="card-footer border-0 pt-0">
  <!-- Load more comments -->
  <a href="#!" role="button" class="btn btn-link btn-link-loader btn-sm text-secondary d-flex align-items-center" data-bs-toggle="button" aria-pressed="true">
    <div class="spinner-dots me-2">
      <span class="spinner-dot"></span>
      <span class="spinner-dot"></span>
      <span class="spinner-dot"></span>
    </div>
    Load more comments 
  </a>
</div>
<!-- Card footer END -->
</div>
<!-- Card feed item END -->  
</div>
<transition name="slide-fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
<div class="col-lg-4" v-if="expertData">
<!-- About START -->
<div class="card">
<!-- Title -->
<div class="card-header border-0 pb-0"style="background-image: url(/public/img/bg.jpg);height: 200px;background-position: center;background-size: cover;margin-bottom: 20px;display: flex; justify-content: center; align-items: center;">       
  <img
    :src="expertData.avatar || '/public/img/my-notion-face-transparent.png'"
    style="width: 100px; position: relative; top: 40%; border: 3px solid #fff; border-radius: 50%;"
    alt="专家头像"
  />
</div>
<!-- Card body START -->
<div class="card-body position-relative pt-0">
  <h5 class="card-title" style="text-align: center;">{{ expertData.username }}</h5>

  <p>{{ expertData.introduction }}</p>
  <!-- info -->
  <ul class="list-unstyled mt-3 mb-0">
    <li class="mb-2"> <i class="bi bi-calendar-date fa-fw pe-1"></i> 总计回答： <strong> {{ expertData.total_answers }} </strong> </li>
    <li class="mb-2"> <i class="bi bi-heart fa-fw pe-1"></i> 被采纳: <strong> {{ expertData.accepted_answers }} </strong> </li>
  </ul>
</div>
<!-- Card body END -->
</div>
<!-- About END -->
</div>
</transition>
</div>
</div>
</div>
<div class="modal fade" id="modalCreateFeed" tabindex="-1" aria-labelledby="modalLabelCreateFeed" aria-hidden="true">
<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
<div class="modal-content">
<!-- Modal feed header START -->
<div class="modal-header">
<h5 class="modal-title" id="modalLabelCreateFeed">Answer</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<!-- Modal feed header END -->

<!-- Modal feed body START -->
<div class="modal-body">
<!-- Add Feed -->
<div class="d-flex mb-3">
<!-- Avatar -->
<div class="avatar avatar-xs me-2">
<img class="avatar-img rounded-circle" :src="userAvatar" alt="">
</div>
<!-- Feed box  -->
<form class="w-100" >
<textarea v-model="answerContent" class="form-control pe-4 fs-3 lh-1 border-0" rows="4" placeholder="Share your answers..." autofocus></textarea>
</form>
</div>
<!-- Feed rect START -->
<div class="hstack gap-2">
<a class="icon-md bg-success bg-opacity-10 text-success rounded-circle" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Photo"> <i class="bi bi-image-fill"></i> </a>
<a class="icon-md bg-info bg-opacity-10 text-info rounded-circle" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Video"> <i class="bi bi-camera-reels-fill"></i> </a>
</div>
<!-- Feed rect END -->
</div>
<!-- Modal feed body END -->

<!-- Modal feed footer -->
<div class="modal-footer row justify-content-between">
<!-- Select -->
<div class="col-lg-3">
</div>
<!-- Button -->
<div class="col-lg-8 text-sm-end">
<button type="button" class="btn btn-danger-soft me-2" data-bs-dismiss="modal" aria-label="Close"> <i class="bi bi-x-circle-fill"></i> Cancel</button>
<button type="button" class="btn btn-success-soft" @click="submitAnswer">Post</button>
</div>
</div>
<!-- Modal feed footer -->

</div>
</div>
</div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute ,useRouter} from 'vue-router';
import axios from 'axios';
import dayjs from 'dayjs';
import { baseURL } from '@/config/apiConfig';

import { ElMessage } from 'element-plus';
const isExpert=localStorage.getItem('identify') === '3'
const isFarmer=localStorage.getItem('identify') === '1'
const route = useRoute();
const router = useRouter();
const userAvatar=ref('/public/img/my-notion-face-transparent.png');
const expertData = ref(null);
const questionId = route.params.question_id;
const questionData = ref(null);
const loading = ref(true);
const token=localStorage.getItem('authToken')
const answerContent=ref('')
// 获取问题详情
const fetchQuestionDetails = async () => {
try {
const response = await axios.get(`${baseURL}/question/searchQuestion/?questionId=${questionId}`, {
headers: {
'token': token
}
});


if (response.data.code === 200) {
questionData.value = response.data.data;
// 过滤无效回答（answer_id为null）
if (questionData.value.answers) {
questionData.value.answers = questionData.value.answers.filter(
answer => answer.answer_id !== null
);
}
}
} catch (error) {
console.error('获取数据失败:', error);
} finally {
loading.value = false;
}
};
//专家回答问题
const submitAnswer = async () => {
if (!answerContent.value.trim()) { // 使用 .value 访问 ref 的值
ElMessage.error('回答内容不能为空！');
return;
}

try {
const response = await fetch(`${baseURL}/question/answerQuestion/`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'token': token 
},
body: JSON.stringify({
questionId: questionId, 
content: answerContent.value
})
});

if (response.ok) {
ElMessage.success('回答提交成功！');
loading.value = true;

fetchQuestionDetails();
loading.value = false;

answerContent.value = '';
document.getElementById('modalCreateFeed').classList.remove('show'); 
document.body.classList.remove('modal-open');
document.querySelector('.modal-backdrop')?.remove();
} else {
const errorData = await response.json();
ElMessage.error(`提交失败: ${errorData.message || '未知错误'}`);
}
} catch (error) {
console.error('提交错误:', error);
ElMessage.error('提交失败，请检查网络连接');
}
};
//农户标记回答为最佳回答
const markAsAccepted = async (answer) => {
if (isFarmer) {
try {
const response = await axios.post(`${baseURL}/question/acceptedAnswer/`, null, {
params: { answerId: answer.answer_id },
headers: { 'token': token }
});

if (response.data.code === 200) {
answer.is_accepted = true;
answer.is_accepted += 1;
} else {
ElMessage.error('标记失败，请稍后再试');
}
} catch (error) {
console.error('标记失败:', error);
ElMessage.error('请求失败，请检查网络连接');
}
} else {
ElMessage.warning('无权限');
}
};
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
if (response.data.code === 200) {
userAvatar.value = response.data.data.avatar || '/public/img/my-notion-face-transparent.png';
} else {
console.error('Error fetching user info:', response.data.message);
}
} catch (error) {
console.error('Error fetching user info:', error);
}
}
//获取专家个人信息
const fetchExpertData = async (expertId) => {
try {
const response = await fetch(`${baseURL}/question/searchExpertAnswerNumberAndAcceptedNumber/?expertId=${expertId}`,{
  headers:{
    'token':token
  }
}); 
const data = await response.json();

if (data.code === 200) {
expertData.value = {
total_answers: data.data.totalAnswers,
accepted_answers: data.data.acceptedAnswers,
username: data.data.username,
avatar: data.data.avatar,
introduction: data.data.introduction,
};
} else {
console.error('获取专家数据失败:', data.message);
}
} catch (error) {
console.error('请求失败:', error);
}
};
//路由返回
const goBack = () => {
router.back();
}
//格式化时间
const formatTime = (timeString) => {
return timeString ? dayjs(timeString).format('YYYY/M/D HH:mm') : '未知时间';
};
//动画钩子
const beforeEnter = (el) => {
el.style.transform = 'translateX(100%)'; // 初始位置在右边
el.style.opacity = 0;
};
const enter = (el, done) => {
el.offsetHeight; // 触发 reflow
el.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
el.style.transform = 'translateX(0)'; // 向左滑动到正常位置
el.style.opacity = 1;
done();
};
const leave = (el, done) => {
el.style.transition = 'transform 1s ease-in, opacity 1s ease-in';
el.style.transform = 'translateX(100%)'; // 离开时滑出右边
el.style.opacity = 0;
done();
};
onMounted(() => {
fetchQuestionDetails();
if(isExpert){
fetchUserInfo();
}
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
@import '../assets/css/libs.min.css';
@import '../assets/css/remain.css';
@import url('/node_modules/bootstrap-icons/font/bootstrap-icons.css');
@media (min-width: 992px) {
.col-lg-3{
-webkit-box-flex: 0;
-ms-flex: 0 0 auto;
flex: 0 0 auto;
width: 25%;
}
}
textarea.form-control{
min-height: calc(1.5em + 1rem + 20px)
}
.skeleton-body{
display: flex;
flex-wrap: wrap;
width: 100%;
}
.skeleton-wrapper {
display: flex;
flex-direction: column;
gap: 1rem;
width: 100%;
}

.skeleton {
background-color: #e0e0e0;
animation: pulse 1.5s infinite ease-in-out;
border-radius: 4px;
}
.skeleton-text {
height: 20px;
width: 100%;
}
.skeleton-image {
height: 250px;
width: 100%;
}
@media (max-width: 992px) {
.skeleton-body {
flex-direction: column;
gap: 0.3rem;
}
.skeleton-wrapper{
-webkit-box-flex: 0;
-ms-flex: 0 0 auto;
flex: 0 0 auto;
height: 600px;
max-width: 100%;
}
.skeleton-card{
-webkit-box-flex: 0;
-ms-flex: 0 0 auto;
flex: 0 0 auto;
height: 300px;
width: 100%;
}
}
@media (min-width: 992px) {
.skeleton-body {
flex-direction: row;
gap: 3rem;
}
.skeleton-card{
-webkit-box-flex: 0;
-ms-flex: 0 0 auto;
flex: 0 0 auto;
height: 400px;
min-width: 25%;
}
.skeleton-wrapper{
-webkit-box-flex: 0;
-ms-flex: 0 0 auto;
flex: 0 0 auto;
height: 600px;
width: 70%;
}
}
@keyframes pulse {
0% {
background-color: #e0e0e0;
}
50% {
background-color: #f0f0f0;
}
100% {
background-color: #e0e0e0;
}
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: transform 1s ease-out, opacity 1s ease-out;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100%); /* 初始位置在右边 */
  opacity: 0;
}
</style>
