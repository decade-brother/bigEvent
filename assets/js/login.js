$(function() {
    //为link的a标签添加点击事件，点击切换
    $('.link a').click(function() {
            $('.layui-form').toggle()
        })
        //解构赋值获取layui对象的form属性
    const { form, layer } = layui
    form.verify({
            pass: [
                /^\w{6,13}$/,
                '密码保证在6到13位之间'
            ],
            //确认密码
            samePass: function(value) {
                if (value !== $('#password').val()) {
                    return '两次密码不一致'
                }
            }
        })
        //为注册表单添加提交事件
    $('#reg-form').submit(function(e) {
            //阻止默认行为
            e.preventDefault()
                //发起ajax请求
            axios.post('/api/reguser', $(this).serialize()).then(res => {
                if (res.status != 0) {
                    return layer.msg('注册失败')
                }
                //请求成功后，触发a标签点击事件，跳转到登录框
                $('#reg-form>.link>a').click()
            })
        })
        //为登录表单绑定提交事件 
    $('#login-form').submit(function(e) {
        //阻止默认行为
        e.preventDefault()
            //发起ajax请求
        axios.post('/api/login', $(this).serialize()).then(res => {
            if (res.status != 0) {
                return layer.msg('登录失败')
            }
            //登录成功后把返回的token值放到本地存储中
            localStorage.setItem('token', res.token)
                //然后跳转页面
            location.href = './index.html'
        })
    })
})