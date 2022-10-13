$(function() {

    const view_article_id = sessionStorage.getItem('ev-view-article-id') || -1
    sessionStorage.removeItem('ev-view-article-id')

    // 内容高度
    global_ev_resize_exec($('.ev-article'))

    // 显示内容
    if (view_article_id != -1) {

        // 获取文章内容
        $.ajax({
            type: 'get',
            url: `/my/article/${view_article_id}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': global_ev_token
            },
            success: (res) => {
                if (res.status === 1) {
                    alert(res.message)
                }
                else {
                    update_view_content(res.data)
                }
            }
        })
    }
    else
    {
        $('.ev-center').addClass('hide')
        alert('文章内容加载失败！')
    }

    function update_view_content(data) {

        $('.ev-center').removeClass('hide')
        $('#ev-title').html(data.title)
        $('#ev-date').html(data.pub_date)
        $('#ev-state').html(data.state)
        $('.ev-article-body').html(data.content)

        console.log(data.cate_id)

        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + data.cate_id,
            headers: {
                'Accept': 'application/json',
                'Authorization': global_ev_token
            },
            success : (res) => {
                if (res.status === 1) {
                    alert(res.message)
                } else {
                    $('#ev-cate').html(res.data.name)
                }
            }
        })
    }
})