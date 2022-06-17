/**
 * Using for activity
 */

$(function () {
    if($(".zactivity").length) {
        var token = $("meta[name=usertoken]").attr("content") || "";
        if(token) {

            ajaxPost('/activity-list',{

            }, function (data) {

                var l = data.length;
                $(".zactivity-badge").html(data.count);
                $(".zactivity-count").html(data.count + " Activity");
                $(".zactivity-content").html(data.content);

            });
        }

        $(".zactivity").on("click", function () {
            ajaxPost("/activity-list?id=all")
        });
    }
});


