$(function() {
    
    var articleCateId = 0
    var articleTitle = ''
    var articleContent = ''
    var articleCover = undefined

    // 编辑现有文章
    var editor_article_cate_id
    var editor_article_id = sessionStorage.getItem('ev-edit-article-id') || -1
    // clear after read it
    sessionStorage.removeItem('ev-edit-article-id')

    // 读取编辑状态，当前编辑的文章id是
    if (editor_article_id !== -1) {

        // 获取文章内容
        $.ajax({
            type: 'get',
            url: `/my/article/${editor_article_id}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': global_ev_token
            },
            success: (res) => {
                if (res.status === 1) {
                    alert(res.message)
                }
                else {
                    // 初始化编辑器内容
                    init_editor_by_data(res.data)
                }
            }
        })

    }

    // 初始化编辑器内容
    function init_editor_by_data(data) {
        // 标题
        $('#ev-ipt-title').val(data.title)
        // 内容
        ev_ckeditor.setData(data.content)
        // 封面图片
        $('.ev-modal-cover-img').attr('src', data.cover_img)
        $('.ev-modal-cover').addClass('ev-modal-img-picked')
        // 文章分类
        editor_article_cate_id = data.cate_id
    }

    // 保存按钮
    $('#ev-btn-save').click((e) => {
        e.preventDefault()

        articleTitle = $('#ev-ipt-title').val()
        articleContent = ev_ckeditor.getData()

        // save article

        if (articleTitle !== '' && articleContent !== '') {
            // open modal
            $('#exampleModal').modal('show')
            // set title
            $('#ev-modal-title').html(articleTitle)
            // update dropdown
            load_cates()
        }
    })

    // 上传文件
    $('#ev-btn-uploader').click((e) => {
        $('#ev-file-updater').click()
        
        // 将上传的图片显示到页面上
        $(document).on("change", "#ev-file-updater", function () {
            var fileObj = $('#ev-file-updater')[0];
            var reader = new FileReader();
            // 转换成功后的操作，img.src即为转换后的DataURL
            reader.onload = function(e) {
                if (reader.readyState === 2) { //加载完毕后赋值
                    $('.ev-modal-cover-img').attr('src', e.target.result)
                    // 切换为图片
                    $('.ev-modal-cover').addClass('ev-modal-img-picked')
                }
            }
            reader.readAsDataURL(fileObj.files[0]);
            articleCover = fileObj.files[0]
        })
    })

    // 分类按钮点击事件
    $('#ev-cates-container').click((e) => {

        var target = $(e.target)

        articleCateId = Number(target.attr('data-id'))
        $('#ev-dropdown-text').html(target.html())

        if (articleCateId === -1) {
            $('#ev-modal-new-cates').removeClass('hide')
        } else {
            $('#ev-modal-new-cates').addClass('hide')
        }
    })

    // 点击添加分类
    $('#ev-btn-add-cate').click((e) => {
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $('#ev-modal-new-cates').serialize(),
            headers: {
                'Accept': 'application/json',
                'Authorization': global_ev_token
            },
            success : (res) => {
                if (res.status === 1) {
                    alert(res.message)
                }
                else {
                    $('#ev-modal-new-cates')[0].reset()
                    load_cates()
                }
            }
        })
    })

    // 发布文章
    $('#ev-modal-pub').click((e) => submit_new_article(true))
    // 存为草稿
    $('#ev-modal-save').click((e) => submit_new_article(false))

    // 加载所有文章分类
    function load_cates() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            headers: {
                'Accept': 'application/json',
                'Authorization': global_ev_token
            },
            success : (res) => {
                if (res.status === 1) {
                    alert(res.message)
                }
                else {
                    // 4. 调用 template函数
                    var htmlStr = template('ev-tpl-cates', res)
                    // 5. 渲染HTML
                    $('#ev-cates-container').html(htmlStr)
                    // init dropdown
                    var selectItem = null
                    if (editor_article_cate_id != -1) {
                        selectItem =$('#ev-cates-container').find(`[data-id=${editor_article_cate_id}]`)
                    }
                    if(!selectItem) {
                        selectItem = $('#ev-cates-container').find('li a:eq(0)')
                    }
                    articleCateId = selectItem.attr('data-id')
                    $('#ev-dropdown-text').html(selectItem.html())
                    $('#ev-modal-new-cates').addClass('hide')
                }
            }
        })
    }

    // 提交新文章 pub=已发布
    function submit_new_article(pub) {

        var formData = new FormData()
        formData.append('title', articleTitle)
        formData.append('cate_id', articleCateId)
        formData.append('content', articleContent)
        formData.append('state', pub ? '已发布' : '草稿')
        formData.append('cover_img', articleCover)

        console.log(articleCover)

        var postUrl

        if (editor_article_id === -1) {
            postUrl = '/my/article/add'
        }
        else {
            postUrl = '/my/article/edit'
            formData.append('Id', editor_article_id)
        }

        // 更新文章 or 发布文章
        $.ajax({
            type: 'post',
            url: postUrl,
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            headers: {
                'Accept': 'application/json',
                'Authorization': global_ev_token
            },
            success : (res) => {

                if (res.status === 1) {
                    alert(res.message)
                }
                else {
                    // open modal
                    $('#exampleModal').modal('hide')
                    //
                    alert('上传成功！！！！！！')
                }
            }
        })
    }

})