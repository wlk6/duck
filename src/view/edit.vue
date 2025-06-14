<template>
  <div class="edit-profile">
    <section class="ftco-section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-12">
            <div class="wrapper">
              <div class="row justify-content-center">
                <div class="col-lg-8">
                  <el-dialog
                    v-model="showModal"
                    title="修改成功"
                    width="30%"
                    :before-close="closeModal"
                  >
                    <span>修改成功！</span>
                    <template #footer>
                      <span class="dialog-footer">
                        <el-button type="primary" @click="confirmModal" v-model="showModal">确认</el-button>
                      </span>
                    </template>
                  </el-dialog>
                  <div class="contact-wrap">
                    <h3 class="mb-4 text-center">修改个人信息</h3>
                    <div class="profile-info" >
                      <div class="avatar-section"@click="triggerAvatarInput">
                        <img 
                        :src="avatarPreview || userInfo.avatar"  
                        alt="Avatar" 
                        class="avatar" />
                        <input type="file" 
                        ref="avatarInputFile" 
                        @change="handleAvatarUpload"
                         accept="image/*" 
                         style="display: none;" />
                      </div>
                    </div>
                    <form @submit.prevent="handleSubmit" class="contactForm">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <input
                              type="file"
                              id="avatar"
                              @change="handleAvatarUpload"
                              accept="image/*"
                            />
                            <img
                              v-if="avatarPreview"
                              :src="avatarPreview"
                              alt="Avatar Preview"
                              class="avatar-preview"
                               style="display: none;"
                            />
                          </div>
                        </div>

                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="region">地区</label>
                            <el-cascader
                              v-model="selectedRegionCodes"
                              :options="regionOptions"
                              placeholder="请选择地区"
                              @change="handleRegionChange"
                              style="width: 90%;height: 50px;"
                            ></el-cascader>
                          </div>
                        </div>

                        <!-- 简介 -->
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="introduce">简介</label>
                            <textarea
                              id="introduce"
                              v-model="introduce"
                              class="form-control"
                              placeholder="请输入简介"
                            ></textarea>
                          </div>
                        </div>

                        <!-- 单位 -->
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="affiliation">单位</label>
                            <input
                              type="text"
                              id="affiliation"
                              v-model="affiliation"
                              class="form-control"
                              placeholder="请输入单位"
                            />
                          </div>
                        </div>

                        <!-- 提交按钮 -->
                        <div class="col-md-12">
                          <div class="form-group">
                            <button type="submit" class="btn btn-primary">提交修改</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { regionData, codeToText } from 'element-china-area-data';
import { baseURL } from '@/config/apiConfig';

// 用户信息
const userInfo = ref({
  username: '',
  avatar: '',
  province: '',
  city: '',
  district: '',
  introduce: '',
  affiliation: '',
});

const avatarPreview = ref('');
const selectedRegionCodes = ref([]);
const introduce = ref('');
const affiliation = ref('');
const showModal = ref(false);
const regionOptions = ref(regionData);
const avatarInputFile = ref(null);
const triggerAvatarInput = () => {
  avatarInputFile.value.click();
};
const confirmModal = () => {
  showModal.value = false;
};
const token = localStorage.getItem('authToken');
const fetchUserInfo = async () => {
  try {
    const response = await axios.post(`${baseURL}/user/getUserInfo/`,null,{
      headers: {
        'token': token,
        'Content-Type': 'application/json'
      }
    });
    if (response.data.code === 200) {
      const userData = response.data.data;
      userData.avatar = userData.avatar || '/public/img/my-notion-face-transparent.png';
      userInfo.value = userData;
      introduce.value = userInfo.value.introduce;
      affiliation.value = userInfo.value.affiliation;
      selectedRegionCodes.value = findRegionCodes(
        userInfo.value.province,
        userInfo.value.city,
        userInfo.value.district
      );
      selectedRegionCodes.value = userInfo.value.province
      console.log(selectedRegionCodes.value)
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败');
  }
};
// 根据地区文本查找对应的代码
const findRegionCodes = (provinceText, cityText, districtText) => {
  const province = regionData.find((item) => item.label === provinceText);
  if (!province) return [];
  
  const city = province.children?.find((item) => item.label === cityText);
  if (!city) return [province.value];
  
  const district = city.children?.find((item) => item.label === districtText);
  return district ? [province.value, city.value, district.value] : [province.value, city.value];
};

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${baseURL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (response.data.code === 200) {
      avatarPreview.value = response.data.data; 
      console.log(response.data.data);
    ElMessage.success('头像上传成功');

    }
  } catch (error) {
    ElMessage.error('头像上传失败');
  }
};

const handleRegionChange = (codes) => {
  selectedRegionCodes.value = codes;
};

const handleSubmit = async () => {
  if (selectedRegionCodes.value.length !== 3) {
    ElMessage.error('请选择完整的地区（省、市、区）');
    return;
  }

  // 动态构建请求数据，仅在头像修改时包含avatar字段
  const requestData = {
    province: codeToText[selectedRegionCodes.value[0]],
    city: codeToText[selectedRegionCodes.value[1]],
    district: codeToText[selectedRegionCodes.value[2]],
    introduce: introduce.value,
    affiliation: affiliation.value,
  };

  // 只有新上传头像时才添加avatar字段
  if (avatarPreview.value) {
    requestData.avatar = avatarPreview.value;
  }

  try {
    const response = await axios.post(
      `${baseURL}/user/changeUserInfo/`,
      requestData,
      { headers: { token: token } }
    );
    if (response.data.code === 200) {
      showModal.value = true;
      fetchUserInfo();
    }
  } catch (error) {
    ElMessage.error('修改失败');
  }
};
onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
@import '../assets/style.css';
.form-group{
  display: flex;
  justify-content: space-between;
}

input,textarea{
  background-color: #fff !important;
  color: black!important;
}
label{
  color: aliceblue;
  font-size: 18px;
}
.form-control{
  color: #606266!important;
}
#introduce,#affiliation{
  width: 90%;
}
.profile-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.info-section {
  flex: 1;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 10px;
  object-fit: cover;
}
.avatar-section {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-section:hover {
  transform: scale(1.05);
}

.avatar-section:hover::after {
  content: "点击修改";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #27550d93;
  color: white;
  font-size: 14px;
  text-align: center;
  padding: 8px 0;
  border-radius: 0 0 50% 50%;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 4px solid white;
}

.avatar-preview {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #409eff;
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.2);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 隐藏默认文件输入 */
input[type="file"] {
  display: none;
}

.contact-wrap {
  /* padding: 2.5rem; */
  border-radius: 20px;
  /* box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1); */
}

h3 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 2rem !important;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.8rem;
  color: #ffffff !important;
  font-weight: 500;
  font-size: 14px;
}

.form-control {
  width: 90%;
  padding: 12px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  transition: border-color 0.3s ease;
  font-size: 14px;
}

.form-control:focus {
  border-color: #409eff;
  outline: none;
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.btn-primary {
  width: 100%;
  padding: 12px 0;
  background: #409eff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #66b1ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.el-cascader {
  --el-cascader-menu-text-color: #606266;
  --el-cascader-menu-selected-text-color: #409eff;
}

.el-cascader :deep(.el-input__inner) {
  height: 48px;
  border-radius: 8px;
}
</style>