//使用axios把请求的baseURL自动添加成以下链接
axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net';

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // 这里把请求响应回来的值改成data
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});