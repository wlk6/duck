<template>
    <div class="card h-100" >
      <div class="position-relative">
        <img v-if="question.image" :src="question.image" class="img-fluid rounded-top" alt="问题图片" >
        <div v-if="question.is_answerd === 1" class="badge bg-success text-white mt-2 me-2 position-absolute top-0 end-0">
          已回答
        </div>
      </div>
      <div class="card-body position-relative pt-0">
        <h6 class="mt-3 text-truncate">{{ question.title }}</h6>
        <p class="content-truncate">{{ question.content }}</p>
        <p class="mb-0 small">
          <i class="bi bi-calendar-check pe-1"></i>
          {{ formatDate(question.question_time) }}
        </p>
        
        <div class="d-flex mt-3 justify-content-between">
          <router-link :to="`/community/details/${question.question_id}`" 
                     class="btn btn-sm btn-outline-success w-100">
            <i class="fa-solid fa-thumbs-up me-1"></i> 查看详情
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({
    question: {
      type: Object,
      required: true
    }
  })
  
  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  </script>
  
  <style scoped>
  @import url('../assets/css/choices.min.css');
@import url('../assets/css/style.css');
@import '../assets/css/libs.min.css';
@import '../assets/css/remain.css';
/* @import url('../assets/css/dropzone.css'); */
@import url('/node_modules/bootstrap-icons/font/bootstrap-icons.css');
  .content-truncate {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 3em;
  }
  
  .text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .img-fluid {
    max-height: 200px;
    object-fit: cover;
    width: 100%;
  }
  </style>