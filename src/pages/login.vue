<template>
    <div class="login">
        <div class="login-container">
            <div class="form-header">
                <h2>用户登录</h2>
                <p>欢迎回来，请登录您的账号</p>
            </div>
            <form @submit.prevent="handleLogin" class="floating-form">
                <div class="input-group">
                    <input id="username" v-model.trim="loginForm.username" 
                           type="text" autocomplete="off" 
                           @input="validateInput" required style="border-radius: 12px;"/>
                    <label for="username">用户名</label>
                    <span class="highlight"></span>
                </div>
                <div class="input-group">
                    <input id="password" v-model.trim="loginForm.password" 
                           type="password" autocomplete="off" 
                           @input="validateInput" required style="border-radius: 12px;"/>
                    <label for="password">密码</label>
                    <span class="highlight"></span>
                </div>
                <div class="error-message" v-if="errorMsg">{{ errorMsg }}</div>
                <button type="submit" class="submit-btn" :disabled="!isFormValid">
                    <span>登录</span>
                    <i class="arrow-icon"></i>
                </button>
                <div class="form-footer">
                    <span>还没有账号？</span>
                    <RouterLink to="/register">立即注册</RouterLink>
                    <RouterLink to="/forgot">忘记密码</RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'login'
};
</script>
<script setup name="Login">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { baseURL } from '@/config/apiConfig';
const router = useRouter();

const loginForm = reactive({
  username: '',
  password: '',
});

const errorMsg = ref('');
const isFormValid = ref(false);

const validateInput = () => {
  isFormValid.value = loginForm.username && loginForm.password;
  errorMsg.value = '';
};

const handleLogin = async () => {
  const xssPattern = /[<>"'{}]/g;
  if (xssPattern.test(loginForm.username) || xssPattern.test(loginForm.password)) {
    errorMessage('输入包含非法字符');
    return;
  }

  try {
    const response = await axios.post(`${baseURL}/user/login/`, {
      username: loginForm.username,
      password: loginForm.password,
    });

    if (response.data.code === 200) {
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('identify', response.data.data.user_type);
      router.push('/');
    } else {
      errorMessage(response.data.message || '登录失败，请检查凭证');
    }
  } catch (error) {
    errorMessage(error.response?.data?.message || '网络错误，请稍后重试');
  }
};

const errorMessage = (text) => {
  errorMsg.value = text;
  setTimeout(() => errorMsg.value = '', 3000);
};

onMounted(validateInput);
</script>

<style scoped>
.login {
    display: flex;
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3e2d2 100%);
}

.login-container {
    width: 90%;
    max-width: 480px;
    margin: auto;
    padding: 40px;
    background: white;
    border-radius: 20px;
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
}

.form-header p {
    color: #95a5a6;
    font-size: 16px;
}

.floating-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.input-group {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin-bottom: 30px;
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
    padding: 0 5px;
    color: #95a5a6;
    font-size: 16px;
    transition: all 0.3s ease;
    pointer-events: none;
    background: white;
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

.error-message {
    width: 100%;
    max-width: 400px;
    color: #f56c6c;
    text-align: center;
    margin: 0 auto 20px;
    font-size: 14px;
}

.submit-btn {
    width: 100%;
    max-width: 400px;
    padding: 15px;
    background: linear-gradient(to right, #0a9627, #054422);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 18px;
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
    width: 100%;
    max-width: 400px;
    margin: 20px auto 0;
    display: flex;
    justify-content: space-between;
    color: #95a5a6;
}

.form-footer a {
    color: #035d2f;
    text-decoration: none;
    font-weight: 600;
}

.form-footer a:hover {
    text-decoration: underline;
}

@media (max-width: 480px) {
    .login-container {
        padding: 25px;
        width: 95%;
    }
    
    .form-header h2 {
        font-size: 24px;
    }
    
    .input-group input {
        padding: 12px;
    }
    
    .submit-btn {
        padding: 12px;
        font-size: 16px;
    }
}
</style>