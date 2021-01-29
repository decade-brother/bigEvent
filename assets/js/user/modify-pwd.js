$(function() {
    const { form, layer } = layui
    form.verify({
        pass: [/^\w{6,13}$/, '密码必须6到13位，且不能有空格'],
        confirmPass: function(val) {
            if (val !== $('#newPwd').val()) {
                return '两次密码输入不一致'
            }
        }

    })
    $('.edit-userPwd').submit(function(e) {
        e.preventDefault()
        axios.post('/my/updatepwd', $(this).serialize()).then(res => {
            if (res.status !== 0) {
                return layer.msg('修改密码失败')
            }
            return layer.msg('修改密码成功')
        })
    })
})