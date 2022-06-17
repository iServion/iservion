var token = $("meta[name=usertoken]").attr("content") || "";
var socketUrl = $("meta[name=socketurl]").attr("content") || "";
if (token) {
    //var socket = io(socketUrl, {query: 'auth_token=' + token});
    var socket = io();
    socket.on('error', function (err) {
        //toastr.error(JSON.stringify(err),"Error on Socket");
        //throw new Error(err);
        toastr.error(err, "Error!");
    });

    socket.on('connect', function () {
        socket.emit('room', token);
    });

    socket.on("disconnect", () => {
        toastr.info("server disconnect, relax just a minute...");
    });

    socket.on('message', function (msg) {
        toastr.info(msg)
    });

    socket.on('success', function (msg) {
        toastr.success(msg)
    });

    socket.on('onlines', function (datas) {
        var html = '';
        if (datas != undefined && datas.length) {
            for (var i = 0; i < datas.length; i++) {
                html+= '<li class="list-group-item"><img src="'+datas[i].image+'" class="img-circle" width="30px"> '+datas[i].fullname+'<span class="fa fa-circle pull-right text-success"></span></li>';

            }
        }
        $("#online-users").html(html)
    });

    socket.on('import', function (datas) {
        $("#resultsforimport").html(JSON.stringify(datas))
    });

    socket.on('warning', function (datas) {
        toastr.info(datas, "Error!");
    });

    socket.on('errormessage', function (datas) {
        toastr.error(datas, "Error!");
    });

    socket.on('errorgenerator', function (datas) {
        toastr.error(datas, "Error!");
        $("#results").hide();
        $("#modalpopup").hide();
    });
    socket.on('loading', function (datas) {
        toastr.info("Please wait..");
        $("#modalpopup").show();
        setTimeout(function () {
            $("#modalpopup").hide();
        }, 3000);
    });

    socket.on('generatortodo', function (datas) {

        $("#table").val(datas.table);
    });
    
    socket.on("directorylist", function (data) {
        $(".content-list").html(data);
    });

    $("#main-logout").on('click', function () {
        socket.emit('logout', 'logout')
    });


    socket.on("sessiondata", function(data) {
        //console.info("sessiondata event received. Check the console");
        //console.info("sessiondata is ", data);
    })

    socket.on("logged_in", function(data) {
        //console.info("logged_in event received. Check the console");
        //console.info("sessiondata after logged_in event is ", data);
    })
    socket.on("logged_out", function(data) {
        console.info("logged_out event received. Check the console");
        console.info("sessiondata after logged_out event is ", data);
    })
    socket.on("checksession", function(data) {
       // console.info("checksession event received. Check the console");
       // console.info("sessiondata after checksession event is ", data);
    })

    socket.on('box-message', function (msg) {
        toastr.info(msg);
        $(".box-message").show();
        $(".box-message").append(msg);
    });

}
