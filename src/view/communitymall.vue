<template>
    <main>
        <section class="pt-5 pb-0 position-relative" style="background-image: url(../image/bg/07.jpg); background-repeat: no-repeat; background-size: cover; background-position: top center;">
    <div class="bg-overlay bg-dark opacity-8"></div>
      <!-- Container START -->
      <div class="container">
        <div class="py-5">
          <div class="row position-relative">
            <div class="col-lg-9 mx-auto">
              <div class="text-center">
                <!-- Title -->
                <h1 class="text-white">Find content that interests you</h1>
                <p class="text-white">Let’s discover the farming-related issues that interest you nearest to you.</p>
              </div>
              <div class="mx-auto bg-mode shadow rounded p-4 mt-5">
                <!-- Form START -->
                <form class="row align-items-end g-4" @submit.prevent="filterQuestions">
                  <!-- Duration -->
                  <div class="col-sm-6 col-lg-3">
                    <label class="form-label">选择专家（可选）</label>
                    <v-select
        v-model="selectedFilter.expert"
        :options="filterExpertOptions"
        label="label"
        :reduce="expert => expert.value"
        placeholder="选择专家"
        :clearable="false"
      >
        <template #option="{ label, value }">
          <span v-if="value === 'all'">全部</span>
          <span v-else-if="value === 'public'">公开</span>
          <span v-else>{{ label }}</span>
        </template>
      </v-select>
                  </div>
                  <!-- Date -->
                  <div class="col-sm-6 col-lg-3">
                    <label class="form-label">回答状态</label>
                    <select class="form-select" v-model="selectedFilter.status">
        <option value="all">全部</option>
        <option value="1">已回答</option>
        <option value="0">未回答</option>
      </select>
                  </div>
                  <div class="col-sm-6 col-lg-3">
                    <button class="btn btn-primary w-100" type="submit">筛选</button>
                  </div>
                </form>
                <!-- Form END -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> 
    <div class="container">
      <div class="row g-4">
        <div class="col-md-8 col-lg-6 vstack gap-4">

          <!-- Card START -->
          <div class="card h-100">
            <!-- Card header START -->
            <div class="card-header d-sm-flex align-items-center text-center justify-content-sm-between border-0 pb-0">
              <h1 class="h4 card-title">Discover Questions</h1>
              <a v-if="!isExpert" class="btn btn-primary-soft" href="#" data-bs-toggle="modal" data-bs-target="#modalCreateEvents">
                <i class="fa-solid fa-plus pe-1"></i> 提问
              </a>
            </div>
            <!-- Card header END -->

            <!-- Card body START -->
            <div class="card-body">
                <div class="row g-4 text-center">
                    <template v-if="answeredQuestions.length>0||unansweredQuestions.length>0">
                      <div class="col-sm-6 col-xl-4" v-for="question in allQuestions" :key="question.question_id">
                        <QuestionCard :question="question" />
                      </div>
                    </template>
                    <template v-else>
                      <div class="my-sm-5 py-sm-5">
            <i class="display-1 text-muted bi bi-calendar2-event"> </i>
            <h4 class="mt-2 mb-3 text-body">No questions found</h4>
            <button v-if="!isExpert"class="btn btn-primary-soft btn-sm" data-bs-toggle="modal" data-bs-target="#modalCreateEvents"> Click here to add </button>
          </div>
                    </template>
                  </div>
            </div>
            <!-- Card body END -->
          </div>
          <!-- Card END -->
        </div>
      </div>
    </div>
    </main>
    <div class="modal fade" id="modalCreateEvents" tabindex="-1" aria-labelledby="modalLabelCreateEvents" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalLabelCreateEvents">提问</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form class="row g-4" @submit.prevent="submitQuestion">
          <div class="col-12">
            <label class="form-label">标题</label>
            <input type="text" class="form-control" v-model="form.title" placeholder="Event name here">
          </div>
          <div class="col-12">
  <label class="form-label">选择专家（可选）</label>
  <v-select 
    v-model="selectedExpert"
    :options="expertOptions"
    label="username"
    :filterable="true"
    placeholder="搜索专家..."
    :clearable="true"
    style="height: 40px;"
  ></v-select>
</div>
          <div class="col-12">
            <label class="form-label">内容</label>
            <textarea class="form-control"  v-model="form.content" rows="2" placeholder="Content here"></textarea>
          </div>
          <div class="mb-3">
  <label class="form-label">上传附件</label>
  <div class="dropzone dropzone-default card shadow-none" data-dropzone='{"maxFiles":2}'>
    <div class="dz-message">
      <i class="bi bi-file-earmark-text display-3"></i>
      <p>将图片拖放到此处或单击上传.</p>
    </div>
  </div>
</div>

          <!-- Dropzone photo END -->
        </form>
        <!-- Form END -->
      </div>
      <!-- Modal feed body END -->
      <!-- Modal footer -->
      <!-- Button -->
      <div class="modal-footer">
        <button type="button" class="btn btn-danger-soft me-2" data-bs-dismiss="modal"> 取消</button>
        <button type="button" class="btn btn-success-soft" @click="submitQuestion">发布</button>
      </div>
    </div>
  </div>
</div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import QuestionCard from '../components/QuestionCard.vue'
import 'vue-select/dist/vue-select.css'
import Dropzone from "dropzone";
import 'dropzone/dist/dropzone.css';
import { ElMessage,ElNotification} from 'element-plus';
import { baseURL } from '@/config/apiConfig';

const selectedFilter = ref({
  expert: 'all',
  status: 'all'
})
const filterExpertOptions = computed(() => [
  { label: '全部专家', value: 'all' },
  { label: '公共问题', value: 'public' },
  ...expertOptions.value.map(expert => ({
    label: expert.username,
    value: expert.user_id
  }))
])
const userIdentify = ref(localStorage.getItem('identify'))
const isFarmer = computed(() => userIdentify.value === '1')
const isExpert = computed(() => userIdentify.value === '3')
const questions = ref([])
const expertOptions = ref([])
const selectedExpert = ref(null)
const token=localStorage.getItem('authToken')
const form = ref({
  title: '',
  content: '',
  image: null
})
// 获取问题数据
const fetchQuestions = async () => {
  try {
    let apiUrl = '';
    const params = {};

    // Handle All + All
    if (selectedFilter.value.expert === 'all' && selectedFilter.value.status === 'all') {
      apiUrl = `${baseURL}/question/searchAllQuestions/`;
    }

    // Handle All + Answered
    else if (selectedFilter.value.expert === 'all' && selectedFilter.value.status === '1') {
      apiUrl = `${baseURL}/question/searchAllAnsweredQuestion/`;
    }

    // Handle All + Unanswered
    else if (selectedFilter.value.expert === 'all' && selectedFilter.value.status === '0') {
      apiUrl = `${baseURL}/question/searchAllUnAnsweredQuestion/`;
    }

    // Handle Expert + All
    else if (selectedFilter.value.expert !== 'all' && selectedFilter.value.expert !== 'public' && selectedFilter.value.status === 'all') {
      apiUrl = `${baseURL}/question/PublicSearchDirectedQuestion/`;
      params.expertId = selectedFilter.value.expert;
    }

    // Handle Expert + Answered
    else if (selectedFilter.value.expert !== 'all' && selectedFilter.value.expert !== 'public' && selectedFilter.value.status === '1') {
      apiUrl = `${baseURL}/question/PublicSearchExpertAnsweredQuestion/`;
      params.expertId = selectedFilter.value.expert;
    }

    // Handle Expert + Unanswered
    else if (selectedFilter.value.expert !== 'all' && selectedFilter.value.expert !== 'public' && selectedFilter.value.status === '0') {
      apiUrl = `${baseURL}/question/PublicSearchDirectedUnAnswer/`;
      params.expertId = selectedFilter.value.expert;
    }

    // Handle Public + All
    else if (selectedFilter.value.expert === 'public' && selectedFilter.value.status === 'all') {
      apiUrl = `${baseURL}/question/searchAllPublicQuestion/`;
    }

    // Handle Public + Answered
    else if (selectedFilter.value.expert === 'public' && selectedFilter.value.status === '1') {
      apiUrl = `${baseURL}/question/searchAllPublicAnsweredQuestion/`;
    }

    // Handle Public + Unanswered
    else if (selectedFilter.value.expert === 'public' && selectedFilter.value.status === '0') {
      apiUrl = `${baseURL}/question/searchAllPublicUnAnsweredQuestion/`;
    }

    // Request with the appropriate endpoint and params
    const response = await axios.get(apiUrl, {
      headers: { token: token },
      params: params
    });

    if (response.data.code === 200) {
      questions.value = response.data.data;
    }
  } catch (error) {
    console.error('获取问题失败:', error);
    ElNotification.error({ title: '错误', message: '获取问题列表失败' });
  }
};

const filterQuestions = () => {
  fetchQuestions()
}
const fetchExperts = async () => {
  try {
    const response = await axios.get(`${baseURL}/user/searchExpert/`,{
      headers:{
        'token':token
      }
    })
    expertOptions.value = response.data.data;
    console.log(expertOptions.value)
  } catch (error) {
    console.error('获取专家列表失败:', error)
  }
}

// 图片上传处理
const handleFileUpload = async (file) => {
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${baseURL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.code === 200) {
      form.value.image = response.data.data; 
      ElMessage.success("图片上传成功!");
    }
  } catch (error) {
    console.error('图片上传失败:', error);
    ElMessage.error('图片上传失败，请重试');
  }
}

// 提交问题
const submitQuestion = async () => {
  if (!form.value.title || !form.value.content) {
    ElMessage.error("标题和内容不能为空！");
    return;
  }
  const payload = {
    title: form.value.title,
    content: form.value.content,
    image: form.value.image
  }
  console.log('提交数据：', payload);
  try {
    if (selectedExpert.value) {
      await axios.post(`${baseURL}/question/sendDirectedQuestion/`, {
        ...payload,
        expertId: selectedExpert.value.user_id
      },{
        headers:{
          'token':token
        }
      })
    } else {
      await axios.post(`${baseURL}/question/sendPublicQuestion/`, payload,{
        headers:{
          'token':token
        }
      })
    }
    
    ElMessage.success('提交成功！')
    form.value = { title: '', content: '', image: null }
    selectedExpert.value = null
    bootstrap.Modal.getInstance(document.getElementById('modalCreateEvents')).hide()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请检查网络或内容')
  }
}

const allQuestions = computed(() => questions.value)
const answeredQuestions = computed(() => questions.value.filter(q => q.is_answerd === 1))
const unansweredQuestions = computed(() => questions.value.filter(q => q.is_answerd === 0))

onMounted(() => {
  fetchQuestions();
  fetchExperts();
  const dropzoneElement = document.querySelector('.dropzone');
  new Dropzone(dropzoneElement, {
    url: `${baseURL}/upload`,
    maxFiles: 1,
    acceptedFiles: 'image/*',
    addRemoveLinks: true,
    init: function () {
      this.on("addedfile", (file) => {
        handleFileUpload(file);
      });
    }
  });
})
</script>
<style scoped>
@import url('../assets/css/choices.min.css');
@import url('../assets/css/style.css');
@import '../assets/css/libs.min.css';
@import '../assets/css/remain.css';
@import '../assets/css/all.min.css';
@import url('/node_modules/bootstrap-icons/font/bootstrap-icons.css');
</style>