<template>
  <main>
    <div class="container">
      <div class="row g-4">
        <div class="col-md-8 col-lg-6 vstack gap-4">
          <div class="card">
            <div class="card-header border-0 pb-0">
              <h1 class="h4 card-title mb-0">Create a page</h1>
            </div>
            <div class="card-body">
              <form class="row g-3" @submit.prevent="handleSubmit">
                <div class="col-12">
                  <div data-uk-form-custom="" class="uk-form-custom">
                    <input 
                    type="file"
                    @change="handleFileUpload"
                    accept="image/*"
                    style="display: none"
                    ref="fileInput">
                    <button class="uk-button uk-button-default" type="button" tabindex="-1" @click="$refs.fileInput.click()">
                      <i class="ico_attach-circle"></i><span>Attach File</span></button>
                    <div class="mt-2" style="min-width: 200px; min-height: 200px;max-width: 300px;max-height: 300px;">
                      <img 
                        :src="formData.coverImage || defaultImage" 
                        alt="Cover Preview"
                        class="img-thumbnail"
                        style="width: 100%;height: 100%;"
                      >
                    </div>
                  </div>                </div>
                
                <div class="col-sm-6 col-lg-4">
                  <label class="form-label">标题</label>
                  <input
                    v-model="formData.displayName"
                    type="text"
                    class="form-control"
                    placeholder="Page name (Required)"
                  >
                </div>

                <div class="col-sm-6 col-lg-4">
                  <label class="form-label">类别</label>
                  <select class="form-select js-choice" @change="updateCategory">
                  <option   value="1">养殖技术</option>
                    <option value="2">品种交流</option>
                    <option value="3">市场动态</option>
                    <option value="4">经验分享</option>
                    <option value="5">设施建设</option>
                    <option value="6">饲料与营养</option>
                    <option value="7">环保与可持续发展</option>
                    <option value="8">休闲娱乐</option>
                    <option value="9">合作与资源</option>
                    <option value="10">科技创新与应用</option>
                  </select>
                </div>
                
                <div class="col-12">
                  <label class="form-label">About page</label>
                  <textarea
                    v-model="formData.description"
                    class="form-control"
                    placeholder="Description (Required)"
                    @keydown.enter.prevent="handleEnter"
                  ></textarea>
                </div>

                <div class="col-12 text-end">
                  <button type="submit" class="btn btn-primary mb-0">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount ,watch} from 'vue';
import { ElMessage,ElNotification} from 'element-plus';
import { baseURL } from '@/config/apiConfig';

import Choices from 'choices.js';

const defaultImage = ref('https://eb118-file.cdn.bcebos.com/upload/87293d1278324deca9cdd4335095ac39_1134932423.png');
const token=localStorage.getItem('authToken')
const formData = reactive({
  displayName: '',
  category: '1',
  description: '',
  coverImage: ''
});
let choicesInstance = null;
 
// 文件上传处理
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const uploadFormData = new FormData();
  uploadFormData.append('image', file);

  try {
    const response = await fetch(`${baseURL}/upload`, {
      method: 'POST',
      body: uploadFormData 
    });
    const result = await response.json();
    if (result.code === 200) {
      formData.coverImage = result.data; 
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
const updateCategory = (event) => {
  formData.category = event.target.value;
};
const categorySelectRef = ref(null);
onMounted(() => {
  if (categorySelectRef.value) {
    choicesInstance.on('change', (value) => {
      formData.category = value.value; 
    });
  }
});

onBeforeUnmount(() => {
  if (choicesInstance) {
    choicesInstance.destroy();
  }
});

const handleSubmit = async () => {
  if (!formData.displayName || !formData.description) {
    ElMessage.error('标题和内容不能为空');
    return;
  }
  const processedContent = formData.description
    .replace(/\n/g, '\\n') 
    .replace(/\r/g, ''); 

  const postData = {
    title: formData.displayName,
    content: processedContent,
    categoryId: formData.category,
    coverUrl: formData.coverImage ? formData.coverImage : undefined
  };
 
  try {
    const response = await fetch(`${baseURL}/post/publishPost/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token':token
      },
      body: JSON.stringify(postData)
    });
    const result = await response.json();
    console.log('Post submitted result:', result);
    if(result.code==200)
      ElMessage.success('发布成功');
    else
      ElMessage.error('发布失败')
  } catch (error) {
    console.error('Post submission failed:', error);
    ElMessage.error('发布失败');

  }
};
const handleEnter = (event) => {
  const textarea = event.target;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  formData.description = 
    formData.description.substring(0, start) + 
    '\n' + 
    formData.description.substring(end);
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = start + 1;
  }, 0);
};
// watch(() => formData.description, (newVal) => {
//   formData.description = newVal.replace(/\r?\n/g, '\\n');
// });
</script>

<style scoped>
@import url('../assets/css/choices.min.css');
@import url('../assets/css/style.css');
@import '../assets/css/libs.min.css';
@import '../assets/css/remain.css';

.img-thumbnail {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
}
</style>