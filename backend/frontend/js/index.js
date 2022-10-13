$(function() {

    // 首页打开时更新文章列表

    if (global_ev_token) {
        update_articles_list()
    }
    else {
        gotoLoginPage()
    }

    function gotoLoginPage() {
        location.assign('./login.html?act=signin')
    }
    
    function update_articles_list() {

        ajax_load_articles((res) => {
            if (res.status === 1) {
                gotoLoginPage()
            } else {
                var htmlStr = template('ev-tpl-item', res)
                $('.ev-article-list').html(htmlStr)
            }
        })
    }

    function ajax_load_articles(cb) {

        var ajaxData = {}
        ajaxData.pagesize = 20
        ajaxData.pagenum = 0

        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: ajaxData,
            headers: {
                'Accept': 'application/json',
                'Authorization': global_ev_token
            },
            success : (res) => cb(res)
        })
    }

    $('.ev-article-list').click((e) => {
        e.preventDefault()

        var target = $(e.target).parents('li')
        if (target) {
            var article_id = target.attr('data-id')
            sessionStorage.setItem('ev-view-article-id', article_id)
            location.assign('./article.html')
        }
    })
})