$(function() {
    const { form } = layui
    let index
    getCateList()
        //页面一开始就获取服务器数据并渲染页面，封装一个函数便于后续调用
    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            if (res.status !== 0) {
                return layer.msg('获取文章列表失败')
            }
            //使用模板引擎添加至页面
            const htmlStr = template('tpl', res)
                // $('.cateTable').empty()
                // $('.cateTable').append(htmlStr)
            $('tbody').html(htmlStr)
        })
    }
    //点击添加后，弹出模态框
    $('.add-btn').click(function() {
            index = layer.open({
                type: 1,
                title: '添加文章分类',
                content: $('.add-form-container').html(),
                area: ['500px', '250px']
            });
        })
        //添加数据至服务器并渲染页面
        //这里没有直接给add-form添加，是因为，我们本质上要给弹出层添加提交事件，但是弹出层里面表单是页面加载完成后再添加到页面的，所以使用事件委托的方法绑定事件
    $(document).on('submit', '.add-form', function(e) {
        e.preventDefault()
        axios.post('/my/article/addcates', $(this).serialize()).then(res => {
            if (res.status !== 0) {
                return layer.msg('添加文章失败')
            }
            layer.close(index)
            getCateList()
        })
    })

    //点击编辑后弹出模态框，并获取服务器信息渲染input框
    //因为列表中的内容是页面加载完成后再添加进去的，所以直接绑定事件无法生效，需要委托事件
    $(document).on('click', '.edit-btn', function() {
            index = layer.open({
                type: 1,
                title: '修改文章分类',
                content: $('.edit-form-container').html(),
                area: ['500px', '250px']
            });

            let id = $(this).data('id')

            axios.get(`/my/article/cates/${id}`).then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章失败')
                }
                form.val('edit-form', res.data);
            })


        })
        //点击修改功能
    $(document).on('submit', '.edit-form', function(e) {
        e.preventDefault()
        axios.post('/my/article/updatecate', $(this).serialize()).then(res => {
            if (res.status !== 0) {
                return layer.msg('修改文章失败')
            }
            layer.msg('修改文章成功')
            layer.close(index)
            getCateList()
        })
    })

    //点击删除功能
    $(document).on('click', '.del-btn', function() {
        let id = $(this).data('id')
        layer.confirm('确认是否删除', {
            title: '提示',
            btn: ['是', '否'] //可以无限个按钮

        }, function(index, layero) {
            axios.get(`/my/article/deletecate/${id}`).then(res => {
                console.log(id);
                if (res.status !== 0) {
                    return layer.msg('删除文章失败')
                }
                layer.msg('删除文章成功')
                layer.close(index)
                getCateList()
            })
        }, function(index) {
            layer.close(index)
            getCateList()
        });
    })
})