import request from '@/config/apicopy';
export const allduck = (count, ageCode) => {
    const token = localStorage.getItem('authToken');

    // 设置请求头为 multipart/form-data
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'token': `${token}`
        }
    };
    const requestBody = {
       count: count,
       ageCode: ageCode
    };

    // 发起 POST 请求到新的接口地址
    return request.post('http://121.196.228.176:8080/analysis/allDuck',  JSON.stringify(requestBody), config);
}