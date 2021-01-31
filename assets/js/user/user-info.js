$(function() {
    const { layer, form } = layui

    function initUserInfo() {
        axios.get('/my/userinfo').then(res => {

            const { data } = res
            if (res.status !== 0) {
                return layer.msg('请求失败')
            }
            form.val('edit-userinfo', data)
        })
    }
    initUserInfo()

    form.verify({
        nick: [/^\w{1,16}$/, '昵称长度必须在1~16位之间']
    })
    $('.edit-userInfo').submit(function(e) {
        e.preventDefault()
        axios.post('/my/userinfo', $(this).serialize()).then(res => {
            if (res.status !== 0) {
                return layer.msg('修改信息失败')
            }
            window.parent.getPersonInfo()
        })
    })
    $('#reset-btn').click(function(e) {
        e.preventDefault()
        initUserInfo()
    })
})