$(function() {

    global_ev_resize_exec($('#ev-resizable'))

    // 右上角菜单
    $('#ev-your-profile').click(() => selectGroup('#userinfo'))
    $('#ev-your-articles').click(() => selectGroup('#articles'))
    // 选中位置
    selectGroup(location.hash || '#userinfo')

    // 设置项事件
    $('.ev-sub-item').click((e) => {
        e.preventDefault()
        selectGroup(e.target.id.replace('ev-sub-item', ''))
    })

    function selectGroup(target) {
        if (!target) return
        try {
            targetItem = $('#ev-sub-item-' + target.slice(1))
            targetField = $('#ev-field-' + target.slice(1))
        }
        catch(e) {
            return
        }
        if (!targetItem || !targetField) return

        // 1. clear
        // focus
        $('#ev-sub-item-userinfo').removeClass('focus')
        $('#ev-sub-item-avatar').removeClass('focus')
        $('#ev-sub-item-password').removeClass('focus')
        $('#ev-sub-item-cates').removeClass('focus')
        $('#ev-sub-item-articles').removeClass('focus')
        // active
        $('#ev-field-userinfo').removeClass('show')
        $('#ev-field-avatar').removeClass('show')
        $('#ev-field-password').removeClass('show')
        $('#ev-field-cates').removeClass('show')
        $('#ev-field-articles').removeClass('show')
        // 2. show
        targetItem.addClass('focus')
        targetField.addClass('show')

        if (targetField.attr('id') === 'ev-field-avatar') onload_avatar() // 用户头像修改
        else if (targetField.attr('id') === 'ev-field-cates') handle_load_cates() // 文章类别
        else if (targetField.attr('id') === 'ev-field-articles') onload_articles() // 文章列表
    }

    // 1. 修改用户信息
    $('#ev-btn-update-userinfo').click((e) => {
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $('#ev-form-userinfo').serialize(),
            headers: {
                'Accept': 'application/json',
                'Authorization': global_ev_token
            },
            success : (res) => {
                if (res.status === 1) {
                    alert('您输入的昵称或邮箱不合规范！')
                }
                else {
                    global_ev_update_user_field($('#ipt-nickname').val())
                    $('#ev-form-userinfo')[0].reset()
                }
            }
        })
    })

    // 2. 修改头像
    function onload_avatar() {

        var avatar_cropper = $('#ev-avatar-image');
        // 初始化头像裁剪区域
        get_user_pic((pic) => update_avatar_cropper(pic))

        $('#ev-btn-avatar-uploader').change((e) => {
            // 上传按钮选择完成
            read_image_base64(e.target, (str) => {
                if (null !== str) {
                    update_avatar_cropper(str)
                }
            })
        })

        $('#ev-btn-avatar-confirm').click((e) => {
            e.preventDefault()
            e.stopPropagation()
            // get result
            var imgData = avatar_cropper.cropper("getCroppedCanvas").toDataURL();
            // console.log(imgData)
            update_avatar(imgData, (msg) => {
                if (msg) alert(msg)
                else {
                    // 更新头像显示
                    $('.ev-ico-user').attr('src', imgData)
                }
            })
        })

        function update_avatar_cropper(pic) {

            avatar_cropper.cropper('destroy')
                          .attr('src', pic || './images/default_avatar.png')
                          .css('max-width', '100%')

            avatar_cropper.cropper({
                aspectRatio: 1,
                preview: '.ev-avatar-rectangle,.ev-avatar-circle',
                crop: function(event) {
                    // console.log(event.detail.x);
                    // console.log(event.detail.y);
                    // console.log(event.detail.width);
                    // console.log(event.detail.height);
                    // console.log(event.detail.rotate);
                    // console.log(event.detail.scaleX);
                    // console.log(event.detail.scaleY);
                }
            });
        }

        function update_avatar(imgData, cb) {

            var formData = new FormData()
            var imgFile = convert_base64_to_file(imgData)
            formData.append('avatar', imgFile)
            
            $.ajax({
                type: 'post',
                url: '/my/update/avatar',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': global_ev_token
                },
                success: (res) => {
                    console.log(res)
                    if (res.status === 1) {
                        return cb(res.message)
                    } else {
                        return cb(null)                        
                    }
                }
            })
        }
        
        function get_user_pic(cb) {
            $.ajax({
                type: 'get',
                url: '/my/userinfo',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': global_ev_token
                },
                success: (res) => {
                    if (res.status === 1) {
                        alert(res.message)
                        cb(null)
                    } else {
                        cb(res.data.user_pic)
                    }
                }
            })
        }

        function read_image_base64(target, cb) {
            // 判断浏览器是否支持filereader
            if(typeof FileReader=='undifined') {
                alert('抱歉，你的浏览器不支持 FileReader')
                return cb(null)
            }
            // 判断获取的是否为图片文件
            var file = target.files[0];
            if(!/image\/\w+/.test(file.type)) {
                alert("请确保文件为图像文件");
                return cb(null)
            }
            // 读取图片内容
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                return cb(e.target.result)
            }
            // window.URL.createObjectURL
            // var uploadedImageURL = window.URL.createObjectURL(file);
        }

        function convert_base64_to_file(imgData) {
            var arr = imgData.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) u8arr[n] = bstr.charCodeAt(n);
            return new File([u8arr], 'user_avatar.png', {type: 'image/jpeg'});
        }
    }

    // 3. 修改密码
    $('#ev-btn-edit-pwd').click((e) => {
        e.preventDefault()

        var pwd = $('#ev-newPwd').val()
        var pwd2 = $('#ev-confirmPwd').val()

        if (pwd === pwd2)
        {
            $.ajax({
                type: 'post',
                url: '/my/updatepwd',
                data: $('#ev-form-pwd').serialize(),
                headers: {
                    'Accept': 'application/json',
                    'Authorization': global_ev_token
                },
                success : (res) => {
                    if (res.status === 1) {
                        alert(res.message)
                    }
                    else {
                        $('#ev-form-pwd')[0].reset()
                    }
                }
            })
        }
        else {
            alert('两次输入的新密码不一致！')
        }
    })

    // 4. 文章类别
    function ajax_load_cates(cb) {
        // 加载已有文章类别信息
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            headers: {
                'Accept': 'application/json',
                'Authorization': global_ev_token
            },
            success : (res) => cb(res)
        })
    }
    // 文章管理的类别处理
    function handle_load_cates() {

        ajax_load_cates((res) => {

            if (res.status === 1) {
                alert(res.message)
            }
            else {
                // 4. 调用 template函数
                var htmlStr = template('ev-tpl-cates', res)
                // 5. 渲染HTML
                $('#ev-cates-container').html(htmlStr)

                // 默认分类隐藏操作按钮
                var opt = $('#ev-cates-container').find(`[data-cate-name="未分类"]`)
                if (opt) opt.find('button').addClass('hide')
            }
        })
    }
    // 添加新的类别
    $('#ev-btn-add-cate').click((e) => {
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $('#ev-form-add-cates').serialize(),
            headers: {
                'Accept': 'application/json',
                'Authorization': global_ev_token
            },
            success : (res) => {
                if (res.status === 1) {
                    alert(res.message)
                }
                else {
                    $('#ev-form-add-cates')[0].reset()
                    handle_load_cates()
                }
            }
        })
    })
    // 监听类别操作
    $('#ev-cates-container').click((e) => {

        var target = $(e.target)

        // 更新类型
        if (target.hasClass('ev-btn-cate-edit')) {
            
            var tr = target.parents('.ev-cates-tr-editor')

            if (tr.hasClass('edit')) {
                target.html('编辑')
                tr.removeClass('edit')

                var oldName = tr.find('span:eq(0)').html()
                var oldAlias = tr.find('span:eq(1)').html()

                var id = target.parent().attr('data-cate-id')
                var name = tr.find('input:eq(0)').val()
                var alias = tr.find('input:eq(1)').val()

                if (oldName !== name.trim() || oldAlias !== alias.trim()) {

                    var editStr = `id=${id}&name=${name}&alias=${alias}`

                    $.ajax({
                        type: 'post',
                        url: '/my/article/updatecate',
                        data: editStr,
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': global_ev_token
                        },
                        success : (res) => {
                            if (res.status === 1) {
                                alert(res.message)
                            }
                            else {
                                tr.find('span:eq(0)').html(name)
                                tr.find('span:eq(1)').html(alias)
                                console.log(res)
                            }
                        }
                    })
                }
            }
            else {
                tr.find('input:eq(0)').val(tr.find('span:eq(0)').html())
                tr.find('input:eq(1)').val(tr.find('span:eq(1)').html())
                target.html('确定')
                tr.addClass('edit')
            }
        }

        // 删除类型
        if (target.hasClass('ev-btn-cate-del')) {

            var id = target.parent().attr('data-cate-id')

            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': global_ev_token
                },
                success : (res) => {
                    if (res.status === 1) {
                        alert(res.message)
                    }
                    else {
                        var tr = target.parents('.ev-cates-tr-editor')
                        tr.addClass('hide')
                    }
                }
            })
        }
    })

    // 5. 文章列表 分类管理

    var dropdown_cate_id
    var dropdown_state

    // 更新文章列表
    function onload_articles() {
        handle_articles_cates()
        update_articles_list()
    }

    function update_articles_list() {

        ajax_load_articles((res) => {
            var htmlStr = template('ev-tpl-articles', res)
            $('#ev-tpl-holder-articles').html(htmlStr)
        })
    }

    function ajax_load_articles(cb) {

        var ajaxData = {}
        ajaxData.pagesize = 5
        ajaxData.pagenum = 0
        if (dropdown_cate_id && dropdown_cate_id !== '-1')
            ajaxData.cate_id = Number(dropdown_cate_id)
        if (dropdown_state && dropdown_state !== '所有状态')
            ajaxData.state = dropdown_state

        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: ajaxData,
            traditional: true,
            headers: {
                'Accept': 'application/json',
                'Authorization': global_ev_token
            },
            success : (res) => cb(res)
        })
    }

    function handle_articles_cates() {

        ajax_load_cates((res) => {

            if (res.status === 1) {
                alert(res.message)
            }
            else {
                // 4. 调用 template函数
                var htmlStr = template('ev-tpl-cates-dropdown', res)
                // 5. 渲染HTML
                $('#ev-dropdown-article-cate').html(htmlStr)
            }
        })
    }
    // 筛选按钮
    $('#ev-btn-articles-filter').click(() => update_articles_list())
    // 文章分类下拉列表点击
    $('#ev-dropdown-article-cate').click((e) => {
        var target = $(e.target)
        var cate_id = target.attr('data-cate-id')
        if (cate_id) {
            $('#ev-dropdown-article-cate-select').html(target.html())
            dropdown_cate_id = cate_id
        }
    })
    // 文章状态下拉列表点击
    $('#ev-dropdown-article-state').click((e) => {
        var target = $(e.target)
        var state_id = target.attr('data-state')
        if (state_id) {
            dropdown_state = target.html()
            $('#ev-dropdown-article-state-select').html(dropdown_state)
        }
    })
    // 编辑文章和删除文章事件
    $('#ev-tpl-holder-articles').click((e) => {
        e.preventDefault()

        var target = $(e.target)
        var article_id = Number(target.attr('data-id'))

        // 编辑
        if (target.hasClass('ev-btn-article-edit')) {
            sessionStorage.setItem('ev-edit-article-id', article_id)
            location.assign('./editor.html')
        }
        // 删除
        else if (target.hasClass('ev-btn-article-del')) {
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + article_id,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': global_ev_token
                },
                success: (res) => {
                    if (res.status === 1) {
                        alert(res.message)
                    } else {
                        target.parents('tr').addClass('hide')
                    }
                }
            })
        }
        // 查看
        else if (target.hasClass('ev-btn-article-view')) {
            sessionStorage.setItem('ev-view-article-id', article_id)
            location.assign('./article.html')
        }
    })
})