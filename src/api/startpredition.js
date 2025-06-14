import request from '@/config/apicopy';

export const predition = (count, ageCode) => {
    const token = localStorage.getItem('authToken');
  // 设置请求头，包含 token
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'token':  `${token}`
    }
  };

  // 构造请求体
  const body = {
    count: count,
    ageCode: ageCode
  };

  // 发起 POST 请求到新的接口地址
  return request.post('http://118.178.172.251:8080/analysis/allDuck', body, config);
};