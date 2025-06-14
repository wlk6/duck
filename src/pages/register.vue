<template>
  <div class="register">
    <div class="register-container">
      <div class="form-header">
        <h2>创建账号</h2>
        <p>开启您的美好旅程</p>
      </div>
      <form @submit.prevent="handleRegister" class="floating-form">
        <!-- 居中内容容器 -->
        <div class="form-center">
          <!-- 用户名 -->
          <div class="input-group">
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              required 
              maxlength="20"
            style="border-radius: 12px;">
            <label for="username">用户名</label>
            <span class="highlight"></span>
          </div>

          <!-- 邮箱 -->
          <div class="input-group">
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required
            style="border-radius: 12px;">
            <label for="email">邮箱地址</label>
            <span class="highlight"></span>
          </div>

          <!-- 验证码 -->
          <div class="input-group verification-wrapper">
            <div class="verification-inner">
              <input 
                type="text" 
                id="verificationCode" 
                v-model="verificationCode" 
                required 
                maxlength="6"
              style="border-radius: 12px;">
              <label for="verificationCode">验证码</label>
              <button
                type="button"
                @click="sendVerificationCode"
                class="send-code-btn"
                :disabled="isSending"
              >
                {{ isSending ? `重新发送(${countdown}s)` : '获取验证码' }}
              </button>
            </div>
            <span class="highlight"></span>
          </div>

          <!-- 密码 -->
          <div class="input-group">
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              required 
              minlength="6" 
              maxlength="20"
            style="border-radius: 12px;">
            <label for="password">密码</label>
            <span class="highlight"></span>
          </div>

          <!-- 确认密码 -->
          <div class="input-group">
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              required 
              minlength="6" 
              maxlength="20"
            style="border-radius: 12px;">
            <label for="confirmPassword">确认密码</label>
            <span class="highlight"></span>
          </div>

          <!-- 用户身份 -->
          <div class="radio-select">
            <p>选择用户身份：</p>
            <div class="radio-container">
              <label class="custom-radio">
                <input type="radio" value="1" v-model="selectedOption">
                <span class="radio-button"></span>
                农户
              </label>
              <label class="custom-radio">
                <input type="radio" value="2" v-model="selectedOption">
                <span class="radio-button"></span>
                公司
              </label>  
              <label class="custom-radio">
                <input type="radio" value="3" v-model="selectedOption">
                <span class="radio-button"></span>
                专家
              </label>   
            </div>
          </div>

          <!-- 地区选择 -->
          <div class="input-group cascader-wrapper">
            <el-cascader
              size="large"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
              placeholder="地区"
            ></el-cascader>
          </div>

          <!-- 错误信息 -->
          <div class="error-message" v-if="errorMsg">{{ errorMsg }}</div>

          <!-- 提交按钮 -->
          <button type="submit" class="submit-btn">
            <span>立即注册</span>
            <i class="arrow-icon"></i>
          </button>

          <!-- 底部链接 -->
          <div class="form-footer">
            <span>已有账号？</span>
            <RouterLink to="/login">立即登录</RouterLink>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { regionData } from 'element-china-area-data'
import { codeToText } from 'element-china-area-data'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { baseURL } from '@/config/apiConfig';

export default defineComponent({
name: 'register',
setup() {
const router = useRouter()
const username = ref('')
const email = ref('')
const verificationCode = ref('')
const password = ref('')
const confirmPassword = ref('')
const options = ref(regionData)
const selectedOptions = ref([])
const selectedOption = ref('1')
const isSending = ref(false)
const errorMsg = ref('')
const countdown = ref(0)

const handleChange = () => {
  var province = "";
  var city = "";
  var district = "";

        for (let i = 0; i < selectedOptions.value.length; i++) {
          province = codeToText[selectedOptions.value[0]];
          city=codeToText[selectedOptions.value[1]];
          district=codeToText[selectedOptions.value[2]];
        }
}
const sendVerificationCode = async () => {
if (!email.value) {
errorMsg.value = '请输入邮箱地址';
return;
}

if (isSending.value) return;

isSending.value = true;
countdown.value = 60;

try {
const response = await axios.post(`${baseURL}/SendCode/`, {
email: email.value,
},{
  headers: {
        'Content-Type': 'application/json'
      }
});
console.log('验证码发送成功:', response.data);
errorMessage('验证码已发送，请查收邮箱');
const timer = setInterval(() => {
if (countdown.value > 0) {
countdown.value--;
} else {
clearInterval(timer);
isSending.value = false;
}
}, 1000);
} catch (error) {
console.error('验证码发送失败:', error);
errorMessage('验证码发送失败，请稍后重试');
isSending.value = false;
}
};

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage('两次输入的密码不一致');
    return;
  }
  if (selectedOptions.value.length !== 3) {
    errorMsg.value = '请选择完整的地区（省、市、区）';
    return;
  }

  const registerData = {
    username: username.value,
    email: email.value,
    code: verificationCode.value,
    password: password.value,
    verifyPassword: confirmPassword.value,
    identify: selectedOption.value, // 用户身份
    province: codeToText[selectedOptions.value[0]], // 省
    city: codeToText[selectedOptions.value[1]], // 市
    district: codeToText[selectedOptions.value[2]], // 区
  };

  console.log('准备注册，发送数据:', registerData); 

  try {
    const response = await axios.post(`${baseURL}/user/register/`, registerData);
    console.log('注册成功，返回数据:', response.data);
    // errorMessage(response.data.message || '注册成功！')
    router.push('/login');

  } catch (error) {
    console.error('注册失败:', error);
    errorMessage(error.response?.data?.message || '注册失败，请稍后重试')
  }
};
const errorMessage = (text) => {
  errorMsg.value = text;
  setTimeout(() => {
    errorMsg.value = '';
  }, 3000);
};


return {
username,
email,
verificationCode,
password,
confirmPassword,
options,
selectedOptions,
selectedOption,
isSending,
errorMsg,
countdown,
errorMessage,
handleChange,
sendVerificationCode,
handleRegister,
}
},
})
</script>

<style scoped>
/* 基础布局 */
.register {
  display: flex;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3e2d2 100%);
  justify-content: center;
  align-items: center;
}

.register-container {
  width: 94%;
  max-width: 600px;
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

/* 头部样式 */
.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h2 {
  color: #2c3e50;
  font-size: clamp(24px, 3vw, 32px);
  margin-bottom: 12px;
}

.form-header p {
  color: #95a5a6;
  font-size: clamp(14px, 1.8vw, 16px);
}

/* 表单容器 */
.floating-form {
  display: flex;
  justify-content: center;
}

.form-center {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

/* 输入组样式 */
.input-group {
  position: relative;
  width: 100%;
  margin-bottom: 28px;
}

.input-group input {
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.25s ease;
  background: transparent;
}

.input-group label {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 0 6px;
  color: #95a5a6;
  font-size: 16px;
  transition: all 0.25s ease;
  pointer-events: none;
}

/* 验证码特殊布局 */
.verification-wrapper {
  position: relative;
}

.verification-inner {
  position: relative;
  width: 100%;
}

.send-code-btn {
  position: absolute;
  right: -25px;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 16px;
  background: #e8fef4;
  color: #0b6e34;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  z-index: 2;
}

/* 单选按钮组 */
.radio-select {
  width: 100%;
  margin: 24px 0;
}

.radio-container {
  display: flex;
  justify-content: space-between;
  max-width: 400px;
  margin: 12px auto 0;
}

.custom-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.25s ease;
}

/* 级联选择器 */
.cascader-wrapper ::v-deep(.el-cascader) {
  width: 100%;
  height: 52px;
  font-size: 16px;
}

.cascader-wrapper ::v-deep(.el-input__inner) {
  height: 52px !important;
  padding-left: 20px !important;
  border-radius: 12px !important;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(to right, #0a9627, #054422);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-top: 20px;
}

/* 错误信息 */
.error-message {
  width: 100%;
  color: #f56c6c;
  text-align: center;
  padding: 12px;
  margin: 16px 0;
  border-radius: 8px;
  background: #fff0f0;
}

/* 底部链接 */
.form-footer {
  text-align: center;
  margin-top: 28px;
  color: #95a5a6;
  font-size: 15px;
}

.form-footer a {
  color: #035d2f;
  font-weight: 600;
  margin-left: 8px;
}

/* 交互状态 */
.input-group input:focus,
.input-group input:valid {
  border-color: #34dbca;
  outline: none;
}

.input-group input:focus + label,
.input-group input:valid + label {
  top: 0;
  font-size: 14px;
  color: #34dbae;
}

.send-code-btn:hover {
  background: #d0fdea;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(10, 150, 39, 0.3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .register-container {
    padding: 35px 25px;
  }

  .radio-container {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .custom-radio {
    width: 120px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .register-container {
    width: 96%;
    padding: 30px 20px;
    border-radius: 16px;
  }

  .send-code-btn {
    position: static;
    width: 100%;
    margin-top: 12px;
    transform: none;
    padding: 12px;
    font-size: 15px;
  }

  .verification-inner {
    display: flex;
    flex-direction: column;
  }

  .cascader-wrapper ::v-deep(.el-cascader) {
    height: 48px;
  }

  .submit-btn {
    font-size: 16px;
    padding: 14px;
  }
}

@media (max-width: 320px) {
  .input-group input {
    padding: 12px 16px;
    font-size: 15px;
  }

  .input-group label {
    font-size: 15px;
    left: 16px;
  }
}
</style>