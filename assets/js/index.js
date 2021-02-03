//解构赋值layer
const { layer } = layui

function getPersonInfo() {
    //发送请求
    axios.get('/my/userinfo').then(res => {

        //判断是否请求成功
        if (res.status !== 0) {
            return layer.msg('获取用户信息失败')
        }
        //结构赋值data
        const { data } = res
        //判断name值，如果有nickname即返回nickname，如果没有即返回username
        let name = data.nickname || data.username

        $('.nickname').text(`欢迎 ${name}`)
            //判断返回值是否由图片的src
        if (data.user_pic) {
            //如果有，就设置给头像，并把字体头像隐藏
            $('.avatar').prop('src', data.user_pic).show()
            $('.text-avatar').hide()
            $('.nickname').show()
        } else {
            //否则隐藏头像，显示字体头像
            $('.avatar').hide()
            $('.text-avatar').text(name[0].toUpperCase()).show()
            $('.nickname').show()
        }
    })
}
//调用函数
getPersonInfo()
    // 给推出按钮绑定点击事件
$('.loginOut').click(function() {
    layer.confirm('确认退出吗?', { icon: 3, title: '提示' }, function(index) {
        //点击之后，清楚本地加载的token
        localStorage.removeItem('token')
            //页面跳转至登录页面
        location.href = './login.html'
        layer.close(index);
    });
    // //点击之后，清楚本地加载的token
    // localStorage.removeItem('token')
    //     //页面跳转至登录页面
    // location.href = './login.html'
}) 