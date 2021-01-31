$(function() {
    const $image = $('#image')

    $image.cropper({
        //指定长宽比
        aspectRation: 1,
        crop: function(event) {
            console.log(event.detail.x)
            console.log(event.detail.y)
        },
        preview: '.img-preview'
    })
    $('#upload-btn').click(function() {
        $('#file').click()
    })
    $('#file').change(function() {
        console.log(this.files);
        if (this.files.length == 0) {
            return

        }
        //将上传的图片转为URL格式
        const imgUrl = URL.createObjectURL(this.files[0])
            //第一种:cropper自带的替换方法
        $image.cropper('replace', imgUrl)
            //第二种:教材中的方法
            //先销毁原图片，再新加一个图片，然后再次初始化
            // $image.cropper('destory').prop('src', imgUrl).cropper({
            //     aspectRation: 1,
            //     preview: '.img-preview'
            // })
    })
    $('#save-btn').click(function() {
        const dataUrl = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/jpeg')
        console.log(dataUrl);
        //声明一个空对象，
        const search = new URLSearchParams()
            //添加url值
        search.append('avatar', dataUrl)
            //这里传参的时候不适用{}传参，是因为我们传的参数的格式不对，axios默认的格式是JSON格式，但是这次传的是图片，格式应该是x-www-from-urlencoded,根据axios官方文档，需要使用URLSearchParams构造函数
        axios.post('/my/update/avatar', search).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('更换头像失败')
            }
            layer.msg('更换头像成功')
            window.parent.getPersonInfo()
        })

    })
})