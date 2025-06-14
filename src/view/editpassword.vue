<template>
    <div class="change-password">
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
                  :before-close="closeModal">
                  <span>修改成功，请重新登录！</span>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button type="primary" @click="confirmModal">确认</el-button>
                    </span>
                  </template>
                </el-dialog>
								<div class="contact-wrap">
									<h3 class="mb-4 text-center">修改密码</h3>
									<div id="form-message-warning" class="mb-4 w-100 text-center"></div> 
				      		<div id="form-message-success" class="mb-4 w-100 text-center">
				            修改成功，请重新登录！
				      		</div>
									<form @submit.prevent="handleSubmit" method="POST" id="contactForm" name="contactForm" class="contactForm">
										<div class="row">
											<div class="col-md-12"> 
												<div class="form-group">
													<input type="email" class="form-control"v-model="email" name="email" id="email" placeholder="邮箱">
												</div>
											</div>
											<div class="col-md-12"> 
												<div class="form-group" style="display: flex;">
													<input type="text" class="form-control" v-model="code" name="code" id="code" placeholder="验证码">
												<button class="sendcode"
												:disabled="isSending"
												@click="sendVerificationCode" type="button">
												{{ isSending ? `重新发送(${countdown}s)` : '获取验证码' }}</button>
												</div>
											</div>
											<div class="col-md-12">
												<div class="form-group">
													<input type="password" class="form-control" v-model="newpassword" name="newpassword" id="newpassword" placeholder="新密码">
												</div>
											</div>
											<div class="col-md-12">
												<div class="form-group">
													<input type="password" class="form-control" v-model="repassword" name="repassword" id="repassword" placeholder="确认密码">
												</div>
											</div>
											<div class="col-md-12">
												<div class="form-group">
													<input type="submit" value="修改密码" data-modal="modal-5"class="btn btn-primary md-trigger" @click="handleSubmit">
													<div class="submitting"></div>
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
import { ref } from 'vue';
import axios from 'axios';
import { baseURL } from '@/config/apiConfig';

const isSending = ref(false)
const email = ref('')
const code = ref('')
const newpassword = ref('')
const repassword = ref('')
const countdown = ref(0)
const showModal = ref(false);
const token=localStorage.getItem('authToken')
const sendVerificationCode = async () => {
  if (isSending.value) return;

  isSending.value = true;
  countdown.value = 60;

  try {
    const response = await axios.post(`${baseURL}/SendCode/`, {
      email: email.value,
    });
    console.log('验证码发送成功:', response.data);
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
    const response = await axios.post(`${baseURL}/user/loginChangePassword/`, request,{
      headers:{
        'token':token
      }
    });
    if (response.data.code == 200) {
      console.log("修改成功")
      showModal.value = true;
    } else {
    }
  } catch (error) {
    console.error('提交失败:', error);
  }
};

const closeModal = () => {
  showModal.value = false;
};

const confirmModal = () => {
  closeModal();
  window.location.href = '/login';
};
</script>
  <style scoped>
@import '../assets/style.css';
#code{
	width: 80%;
}
textarea{
  background-color: #fff;
}
.sendcode{
    font-size: 16px;
    color:#79bc64;
    width: 20%;
    background: #fff;
    border: none;
    height: 50px;
    font-weight: 700;
    transition: .3s ease;
    -webkit-transition: .3s ease;
    -moz-transition: .3s ease;
    -ms-transition: .3s ease;
    -o-transition: .3s ease;
    border-radius: 22px;
}
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
 
.modal-content {
    background: white;
    padding: 20px;
	width: 300px;
    border-radius: 5px;
    text-align: center;
}
</style>