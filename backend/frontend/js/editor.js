$(function() {
    
    var articleCateId = 0
    var articleTitle = ''
    var articleCover = undefined

    $('#ev-btn-save').click((e) => {
        e.preventDefault()

        articleTitle = $('#ev-ipt-title').val()

        // if (!strTitle || !strContent) return

        // save article

        // set title
        $('#ev-modal-title').html(articleTitle)
        // update dropdown
        load_cates()

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
                    var first_item = $('#ev-cates-container').find('li a:eq(0)')
                    articleCateId = first_item.attr('data-id')
                    $('#ev-dropdown-text').html(first_item.html())
                    $('#ev-modal-new-cates').addClass('hide')
                }
            }
        })
    }

    // 提交新文章 pub=已发布
    function submit_new_article(pub) {

        var strContent = CKEDITOR.ClassicEditor.ev_instance.getData()

        var formData = new FormData()
        formData.append('title', articleTitle)
        formData.append('cate_id', articleCateId)
        formData.append('content', strContent)
        formData.append('state', pub ? '已发布' : '草稿')
        formData.append('cover_img', articleCover)

        $.ajax({
            type: 'post',
            url: '/my/article/add',
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
                    alert('上传成功！！！！！！')
                }
            }
        })
    }

})