$(function() {

    const { form, laypage } = layui
    getCateList()
        //1.页面一加载就发送请求，获取服务器数据，渲染所有分类下拉菜单
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
    //2.定义一个对象，用来放置第一次发送请求，渲染table的参数
    const query = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    renderList()
        //3.页面一加载就发送请求 ，获取文章列表，添加到table内
    function renderList() {
        axios.get('/my/article/list', { params: query }).then(res => {
            console.log(res);

            template.defaults.imports.dateFormat = function(date) {
                return moment(date).format('YYYY/MM/DD HH:mm:ss')
            };
            var htmlStr = template('tpl', res)
            $('tbody').html(htmlStr)

            //4.页面一加载过程中，也需要加载分页器等一系列页面样式
            renderPage(res.total)
        })
    }
    //页面的下面一部分渲染
    function renderPage(total) {
        //对页面的下面分页进行渲染
        laypage.render({
            elem: 'pagination', //注意，这里的 test1 是 ID，不用加 # 号

            count: total, //数据总数，从服务端得到
            limit: query.pagesize,
            limits: [2, 3, 4, 5],
            curr: query.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                //每次修改每页的显示数，或者当前第几页，都要向对象内重新赋值再去调用table渲染函数
                query.pagenum = obj.curr,
                    query.pagesize = obj.limit
                    //首次不执行
                    //页面一加载的时候，我们已经手动加载过一次渲染table，所以不需要再次渲染
                if (!first) {
                    renderList()
                }
            }
        });
    }
    //5.页面的form筛选表单提交后，根据筛选条件重新渲染页面
    $('.layui-form').submit(function(e) {
            e.preventDefault()
                //获取下拉菜单选取的值，放在查询对象中
            const cate_id = $('#cast-sel').val()
            const state = $('#state').val()
            console.log(cate_id);
            console.log(state);
            query.cate_id = cate_id
            query.state = state

            //优化操作，当发送筛选请求之后，必须选择第一页
            query.pagenum = 1
                //再次调用table渲染函数
            renderList()
        })
        //6.点击删除，当页面点击删除后，要删除服务器内的数据，并且重新渲染到页面上
    $(document).on('click', '.del-btn', function() {
        let id = $(this).data('id')
        layer.confirm('确认是否删除', {
            title: '提示',
            btn: ['是', '否'] //可以无限个按钮

        }, function(index, layero) {
            axios.get(`/my/article/delete/${id}`).then(res => {
                console.log(id);
                if (res.status !== 0) {
                    return layer.msg('删除文章失败')
                }
                layer.msg('删除文章成功')
                    //对删除功能的优化，当页面处于最后一页且页面只有一个的时候，删除之后，table应该会跳转到上一个页面，然后渲染上个页面的数据，但是实际上，它会跳转到上一个页面，但是还是渲染当前页面，于是我们需要手动修改，判断：当我们处于最后页面的并且删除最后一个的时候，即此时页面上只有一个删除按钮，获取删除按钮，且length为1的时候，我们删除后手动跳转，渲染页面的参数query.pagenum减一，但若是这样操作，如果我们只有一个页面，那么不可能减到0，所以多一个判断：且当前页面不是一的时候，即query.pagenum !==1;
                    //此页面数据渲染的核心在于将请求参数放在一个对象中，每次渲染页面时候更改对象的属性值进行不同的渲染效果
                if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                    query.pagenum--
                }
                renderList()
                layer.close(index)
            })
        }, function(index) {
            layer.close(index)
            renderList()
        });
    })

    //7.点击编辑，跳转到编辑页面
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id')

        location.href = `./edit.html?id=${id}`
        window.parent.$('#edit-list').click()
    })
})