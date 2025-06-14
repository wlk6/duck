import request from '@/config/apicopy';
export const sendImage = (formdata) => {

    // 设置请求头为 multipart/form-data
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    };
    // 发起 POST 请求到新的接口地址
    return request.post('http://121.196.228.176:8080/detection/detect_ducks/',formdata,config);
}