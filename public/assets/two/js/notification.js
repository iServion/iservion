/**
 * Using for notification
 */

$(function () {
    if ($(".notification-data").length) {
        var token = $("meta[name=usertoken]").attr("content") || "";
        if (token) {
            ajaxPost('/notification-data', {}, function (datas) {
                var data = datas.data || [];
                var count = datas.count || 0;
                $(".znotification-badge").html(count);
                var content = '';

                data.forEach(function (item) {
                    var link = item.link ? `/znotification/${item.token}` : "#";
                    content += `<a href="${link}">
                                        <div class="item">
                                            <div class="img">
                                                <img src="${item.avatar}" alt="noti">
                                            </div>
                                            <div class="text">
                                                <h4>${item.title}</h4>
                                                <small>${item.ago}</small>
                                            </div>
                                        </div>
                                    </a>`
                });
                $(".notification-list").html(content);
            });
        }
    }
});


