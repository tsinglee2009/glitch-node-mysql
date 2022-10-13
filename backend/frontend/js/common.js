$(function () {

    // 全局变量
    global_ev_token = localStorage.getItem('token')

    global_ev_resize_exec = function (jqObj, offset = 0) {

        resize_item()

        window.onresize = function(){
            resize_item()
        }

        function resize_item() {
            // 动态修改不生效 ？
            jqObj.css('min-height', (getClientHeight() - 144 - offset) + 'px')
        }
    }

    // 局部更新 更新右上角头像区域
    global_ev_update_user_field = function(username, avatar) {
        if (username) {
            $('#dropdown-name-item').html(`Signed in as<br>${username}`)
        }
        if (avatar) {
            $('#ev-ico-user-avatar').attr('src', avatar)
        }
    }

    // 读取登录状态
    if (global_ev_token) {
        $('#ev-mode-default').addClass('hide')
        $('#ev-mode-user').removeClass('hide')
    }
    else {
        $('#ev-mode-default').removeClass('hide')
        $('#ev-mode-user').addClass('hide')
    }

    if (global_ev_token) {
        $.ajax({
            type: 'get',
            url: 'http://127.0.0.1/my/userinfo',
            headers: {
                'Accept': 'application/json',
                'Authorization': global_ev_token
            },
            success: (res) => {
                // token 已过期
                if (res.status === 1) {
                    deleteToken()
                    alert('登录信息已过期，请重新登录！')
                    location.assign('./login.html')
                }
                else {
                    var drop_name_item = $('#dropdown-name-item')
                    drop_name_item.html(`Signed in as<br>${res.data.nickname || res.data.username}`)
                    drop_name_item.attr('href', 'javascript:;')
                    drop_name_item.css('cursor', 'default')
                }
            }
        })
    }

    // 登出
    $('#dropdown-signout-item').click((e) => {
        e.preventDefault()
        deleteToken()
        location.assign('./index.html')
    })

    // 删除token
    function deleteToken() {
        global_ev_token = undefined
        localStorage.removeItem('token')
    }

    // 可视范围的高度
    function getClientHeight() {

        var clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        }
        else {
            var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        }
        return clientHeight;
    }
})