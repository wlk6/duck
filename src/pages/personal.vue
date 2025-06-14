<template>
  <div id="personal">
    <div style="display: flex;">
    <RouterLink to="/"><img src="/public/img/logo.png" style="width: 60px; margin-left: 100px;"></RouterLink>
    <div class="navigate">
      <RouterLink to="/mine/homeview" active-class="active">主页</RouterLink>
      <RouterLink to="/mine/edit" active-class="active">修改个人信息</RouterLink>
      <RouterLink to="/mine/editpassword" active-class="active">修改密码</RouterLink>
</div>
</div>
    <div class="main-content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<style scoped>
#personal {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* height: 100%; */
  background-color: #27550d;

}

.navigate {
  padding: 15px 10px; 
  display: flex;
  gap: 20px;
  align-items: center;
  text-align: center;
  margin: 0 auto;
  margin-left: 450px;
}

.navigate a {
  color: white;
  text-decoration: none;
  font-size: 16px;
  display: flex;          
  align-items: center;    
  height: 100%;          
  padding: 0 5px; 
}

.navigate a.active {
  color: #4bff00;
  font-weight: bold;
}

.main-content {
  flex: 1;
  padding: 20px;
  /* background-color: #27550d; */
}
</style>