/**
 * Using for activity
 */

$(function () {
    if($(".message-list").length) {
        var token = $("meta[name=usertoken]").attr("content") || "";
        if (token) {
            ajaxPost('/activity-data', {}, function (datas) {
                var data = datas.data || [];
                var count = datas.count || 0;
                $(".zactivity-badge").html(count);
                var content = '';

                data.forEach(function (item) {
                    var link = item.link ? `/znotification/${item.token}` : "#";
                    content += `<a href="#">
                                        <div class="item">
                                            <div class="img">
                                                <img src="${item.avatar}" alt="">
                                            </div>
                                            <div class="text">
                                                <h4>${item.title}</h4>
                                                <small>${item.description}</small>
                                            </div>
                                            <div class="date ms-auto">
                                                <small>${item.ago}</small>
                                            </div>
                                        </div>
                                    </a>`
                });
                $(".message-list").html(content);
            });
        }
    }
});


