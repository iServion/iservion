/**
 * Using for notification
 */

$(function () {
    if($(".znotification").length) {
        var token = $("meta[name=usertoken]").attr("content") || "";
        if(token) {

            ajaxPost('/notification-list',{
                
            }, function (data) {

                var l = data.length;
                var newnotification = l == 0 ? " " : l ==1 ? l+" New Notification " : l +" New Notifications";
                $(".znotification-badge").html(l);
                $(".znotification-count").html(newnotification);
                var content = '';
                data.forEach(function (item) {
                    var link = item.link ? `/znotification/${item.token}` : "#";
                    content += ` <a href="${link}"  data-id="${item.id}" class="list-group-item">
 <div class="row g-0 align-items-center">
 <div class="col-2">
 <i class="text-danger" data-feather="alert-circle"></i>
 </div>
 <div class="col-10">
 <div class="text-dark">${item.title}</div>
 <div class="text-muted small mt-1">${item.description}</div>
 <div class="text-muted small mt-1">${item.updated_at}</div>
 </div>
 </div>
 </a>`;
                });
                $(".znotification-content").html(content);
            });
        }

        $(".znotification").on("click", function () {
            ajaxPost("/notification-list?id=all")
        });
    }
});


