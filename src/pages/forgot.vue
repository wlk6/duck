<template>
    <div class="forgotVue">
      <div class="register-container">
        <div class="form-header">
          <h2>重置密码</h2>
        </div>
        <form @submit.prevent="handleRegister" class="floating-form">
          <div class="input-group">
            <input type="email" id="email" v-model="email" required style="border-radius: 12px;"/>
            <label for="email">邮箱地址</label>
            <span class="highlight"></span>
          </div>
          <div class="input-group verification-group">
            <input type="text" id="verificationCode" v-model="code" required maxlength="6" style="border-radius: 12px;"/>
            <label for="verificationCode">验证码</label>
            <button
    type="button"
    @click="sendVerificationCode"
    class="send-code-btn"
    :disabled="isSending"
  >
    {{ isSending ? `重新发送(${countdown}s)` : '获取验证码' }}
  </button>
  
            <span class="highlight"></span>
          </div>
          <div class="input-group">
            <input type="password" id="password" v-model="newpassword" required minlength="6" maxlength="20" style="border-radius: 12px;"/>
            <label for="password">密码</label>
            <span class="highlight"></span>
          </div>
          <div class="input-group">
            <input type="password" id="confirmPassword" v-model="repassword" required minlength="6" maxlength="20" style="border-radius: 12px;"/>
            <label for="confirmPassword">确认密码</label>
            <span class="highlight"></span>
          </div>
          <div class="error-message" v-if="errorMsg">{{ errorMsg }}</div>
          <button type="submit" class="submit-btn" @click="handleSubmit">
            <span>修改密码</span>
            <i class="arrow-icon"></i>
          </button>
        </form>
      </div>
    </div>
  </template>
  
  
  <script>
  import { defineComponent, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import { baseURL } from '@/config/apiConfig';

  export default defineComponent({
  name: 'forgot',
  setup() {
  const router = useRouter()
  const email = ref('')
  const code = ref('')
  const newpassword = ref('')
  const repassword = ref('')
  const isSending = ref(false)
  const errorMsg = ref('')
  const countdown = ref(0)
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
  const handleSubmit = async (event) => {
  event.preventDefault();
  const request = {
    email: email.value,
    code: code.value,
    newPassword: newpassword.value,
    confirmPassword: repassword.value
  }
  console.log(request)
  try {
    const response = await axios.post(`${baseURL}/user/changePassword/`, request);
    if (response.data.code == 200) {
      console.log("修改成功")
  window.location.href = '/login';

    } else {
    }
  } catch (error) {
    console.error('提交失败:', error);
  }
};
  const errorMessage = (text) => {
    errorMsg.value = text;
    setTimeout(() => {
      errorMsg.value = '';
    }, 3000);
  };
  
  
  return {
  email,
  code,
  newpassword,
  repassword,
  isSending,
  errorMsg,
  countdown,
  handleSubmit,
  errorMessage,
  sendVerificationCode,
  }
  },
  })
  </script>
  
  <style scoped>
  ::v-deep(.el-cascader) {
    width: 513.2px;
    height: 50px;
    font-size: 16px;
    background: transparent;
    transition: all 0.3s ease;
  }
  .radio-select{
    display: flex;
    position: relative;
  }
  .radio-select div{
    width: 60%;
    display: flex;
    justify-content: space-evenly;
  }
  .radio-select p{
    font-size: 18px;
    align-items: center;
  }
  .custom-radio {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 35px;
    cursor: pointer;
    font-size: 16px;
    user-select: none;
  }
  
  .custom-radio input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
  
  .radio-button {
    position: absolute;
    top: 10;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
    border-radius: 50%;
  }
  
  .custom-radio:hover input ~ .radio-button {
    background-color: #ccc;
  }
  
  .custom-radio input:checked ~ .radio-button {
    background-color: #0b9929;
  }
  
  .custom-radio input:checked ~ .radio-button:after {
    content: "";
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: white;
  }
  .forgotVue {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3e2d2 100%);
    padding: 20px;
  }
  
  .register-container {
    width: 100%;
    max-width: 480px;
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
  
  .form-header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .form-header h2 {
    color: #2c3e50;
    font-size: 32px;
    margin-bottom: 10px;
    font-weight: 700;
  }
  
  .form-header p {
    color: #95a5a6;
    font-size: 16px;
  }
  
  .floating-form .input-group {
    position: relative;
    margin-bottom: 30px;
  }
  .error-message {
      color: #f56c6c;
      font-size: 14px;
      text-align: center;
      margin-bottom: 20px;
  }
  .input-group input {
    width: 100%;
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s ease;
    background: transparent;
  }
  
  .input-group label {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    padding: 0 5px;
    color: #95a5a6;
    font-size: 16px;
    transition: all 0.3s ease;
    pointer-events: none;
  }
  
  .input-group input:focus,
  .input-group input:valid {
    border-color: #34dbca;
  
  }
  
  .input-group input:focus + label,
  .input-group input:valid + label {
    top: 0;
    font-size: 14px;
    color: #34dbae;
  }
  
  .verification-group {
    display: flex;
    gap: 10px;
  }
  
  .verification-group input {
    flex: 1;
  }
  
  .send-code-btn {
    padding: 0 20px;
    background: #e8fef4;
    color: #0b6e34;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }
  
  .send-code-btn:hover {
    background: #d0fdea;
  }
  
  .submit-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(to right, #0a9627, #054422);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
  }
  
  .arrow-icon {
    border: solid white;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(-45deg);
  }
  
  .form-footer {
    text-align: center;
    margin-top: 20px;
    color: #95a5a6;
  }
  
  .form-footer a {
    color: #035d2f;
    text-decoration: none;
    margin-left: 5px;
    font-weight: 600;
  }
  
  .form-footer a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 480px) {
    .register-container {
        padding: 20px;
    }
    
    .form-header h2 {
        font-size: 24px;
    }
    
    .input-group input {
        padding: 12px;
    }
  }
  
  @media (max-width: 768px) {
    .register-container {
        max-width: 400px;
        padding: 30px;
    }
  
    .form-header h2 {
        font-size: 28px;
    }
  
    .form-header p {
        font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .register-container {
        padding: 20px;
        margin: 10px;
        max-width: 100%;
    }
    
    .form-header h2 {
        font-size: 24px;
    }
    
    .form-header p {
        font-size: 14px;
    }
  
    .input-group input {
        padding: 12px;
        font-size: 14px;
    }
  
    .input-group label {
        font-size: 14px;
    }
  
    .verification-group {
        flex-direction: column;
        gap: 5px;
    }
  
    .send-code-btn {
        width: 100%;
        padding: 12px;
    }
  
    .submit-btn {
        padding: 12px;
        font-size: 16px;
    }
  }
  
  @media (max-width: 320px) {
    .register-container {
        padding: 15px;
    }
  
    .form-header h2 {
        font-size: 20px;
    }
  
    .input-group {
        margin-bottom: 20px;
    }
  }
  </style>