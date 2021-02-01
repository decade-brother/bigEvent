$(function() {
    const { form } = layui

    let state = ''
    getCateList()

    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            if (res.status !== 0) {
                return layer.msg('获取文章列表失败')
            }
            res.data.forEach(item => {
                    $('#cast-sel').append(`<option value="${item.Id}">${item.name}</option>`)
                })
                //有些时候，你的有些表单元素可能是动态插入的。这时 form 模块 的自动化渲染是会对其失效的。虽然我们没有双向绑定机制（因为我们叫经典模块化框架，偷笑.gif） 但没有关系，你只需要执行 form.render(type, filter); 方法即可。
            form.render(); //更新全部
        })
    }
    initEditor()

    const $image = $('#image')

    $image.cropper({
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    })

    $('#choose-btn').click(function() {
        $('#file').click()
    })
    $('#file').change(function() {
        const imgUrl = URL.createObjectURL(this.files[0])

        $image.cropper('replace', imgUrl)
    })

    $('.publish-form').submit(function(e) {
        e.preventDefault()
        const fd = new FormData(this)

        fd.forEach(item => {
            console.log(item);
        })

        fd.append('state', state)


        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(blob => {
            console.log(blob);
            fd.append('cover_img', blob)

            publishArticle(fd)
        })
    })
    $('.last-row button').click(function() {
        console.log($(this).data('state'));
        state = $(this).data('state')
    })

    function publishArticle(fd) {
        axios.post('/my/article/add', fd).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('发布文章失败')
            }
            layer.msg('发布文章成功')
            window.parent.$('#article-list').click()
            location.href = './list.html'
        })
    }
})