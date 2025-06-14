<template>
  <div id="app">
    <Loading v-if="isLoading" />
    <RouterView v-show="!isLoading"></RouterView>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import Loading from '@/components/Loading.vue';

const isLoading = ref(true);
const router = useRouter();

router.beforeEach(() => {
  isLoading.value = true;
});

router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500); 
});

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    isLoading.value = false;
  }
});
</script>