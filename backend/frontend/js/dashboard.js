$(function() {

    global_ev_resize_exec($('#ev-resizable'))

    // 选中位置
    selectGroup(location.search || '#userinfo')

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
        else if (targetField.attr('id') === 'ev-field-cates') onload_cates() // 文章类别
        else if (targetField.attr('id') === 'ev-field-articles') onload_articles() // 文章列表
    }

    // 1. 修改用户信息
    $('#ev-btn-update-userinfo').click((e) => {
        e.preventDefault()

        var dataStr = `id=${global_ev_userid}&` + $('#ev-form-userinfo').serialize()

        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: dataStr,
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
        alert('头像修改 todo ...')
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
    function onload_cates() {
        // 加载已有文章类别信息
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
                }
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
                    onload_cates()
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

    // 5. 文章列表
    function onload_articles() {

    }

})