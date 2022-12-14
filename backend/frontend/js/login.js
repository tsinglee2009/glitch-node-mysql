$(function() {

    // 页面切换： 注册 和 登录
    if (location.search === '?act=signup') {
        $('.ev-signup').removeClass('hide')
        $('.ev-signin').addClass('hide')
    }
    else {
        $('.ev-signin').removeClass('hide')
        $('.ev-signup').addClass('hide')
    }

    // 登录事件
    $('#ev-btn-signin').click((e) => {
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $('#ev-form-signin').serialize(),
            success: (res) => {
                // 登录失败
                if (res.status === 1) {
                    alert(res.message)
                }
                // 登录成功
                else {
                    global_ev_token = res.token
                    localStorage.setItem('token', res.token)
                    gotoHomePage()
                }
            }
        })
    })

    // 注册事件
    $('#ev-btn-signup').click((e) => {
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/api/regUser',
            data: $('#ev-form-signup').serialize(),
            success: (res) => {
                // 注册失败
                if (res.status === 1) {
                    alert('账号或密码格式错误！\n' + res.message)
                }
                // 注册成功
                else {
                    // 自动登录
                    login_inback()
                }
            }
        })
    })

    // 回到首页
    function gotoHomePage() {
        location.assign('./index.html')
    }

    // 注册成功后，自动登录
    function login_inback() {
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $('#ev-form-signup').serialize(),
            success: (res) => {
                // 登录失败
                if (res.status === 1) {
                    alert(res.message)
                }
                // 登录成功
                else {
                    global_ev_token = res.token
                    localStorage.setItem('token', res.token)
                    gotoHomePage()
                }
            }
        })
    }
})