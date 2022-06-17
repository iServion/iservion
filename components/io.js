var io = require('socket.io')();
var siofu = require("socketio-file-upload");
const fs = require('fs-extra');
var Util = require('./Util');
const uuid = require("uuid");


//room = token
var socketArray = [];

io.on('connection', function (socket) {

    socket.emit('sessiondata', socket.handshake.session);
    // Set session data via socket
    socket.on('login', function() {
        //console.log('Received login message');
        socket.handshake.session.user = {
            username: 'OSK'
        };
        //console.log('socket.handshake session data is %j.', socket.handshake.session);

        // socket.handshake.session.save();
        //emit logged_in for debugging purposes of this example
        socket.emit('logged_in', socket.handshake.session);
    });
    // Unset session data via socket
    socket.on('checksession', function() {
       // console.log('Received checksession message');
        // console.log('socket.handshake session data is %j.', socket.handshake.session);
        socket.emit('checksession', socket.handshake.session);
    });
    // Unset session data via socket
    socket.on('logout', function() {
        console.log('Received logout message');
        delete socket.handshake.session.user;
        // socket.handshake.session.save();
        //emit logged_out for debugging purposes of this example
        //console.log('socket.handshake session data is %j.', socket.handshake.session);

        socket.emit('logged_out', socket.handshake.session);
    });

    socket.on('room', function(room) {
        socket.join(room);
    });

    socket.on("upload", async function (data) {
        console.log("upload socket")
        var token = socket.handshake.session.user.token;
        var dir = dirRoot+"/public/assets/"+token;
        var filename = data.filename;
        fs.ensureDir(dir, err => {
            console.log(err); // => null
        });

        dir = dir + data.state_dir;
        fs.ensureDir(dir, err => {
            console.log(err); // => null
        });

        var oldPath = dirRoot+"/public/assets/temp/"+token+"/"+ filename;
        var newPath = dir+"/"+filename;

        fs.rename(oldPath, newPath, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!');
            var contents = Util.getFiles(dir, token);
            socket.emit("directorylist", contents);
        });
    });


    //for upload file using socket io
    if(socket.handshake.session.user) {
        var dir = dirRoot+"/public/assets/temp/"+socket.handshake.session.user.token;
        var token = socket.handshake.session.user.token;
        fs.ensureDir(dir, err => {
            console.log(err); // => null
        });


        var uploader = new siofu();
        uploader.uploadValidator = function(event, callback){
            // asynchronous operations allowed here; when done,
            let files = fs.readdirSync(dir);
            let goNext = true;
            var name = event.file.name;
            if(files.indexOf(name) > -1){
                goNext = false;
            }
            if (goNext) {
                callback(true);
            } else {
                callback(false);
            }
        };

        uploader.on("saved", function(event){
            //console.log(event.file);
            event.file.clientDetail.base = event.file.base;
            event.contentList = Util.getFiles(dir, token);
        });
        uploader.on("error", function(data){
            console.log("Error: "+data.memo);
            console.log(data.error);
        });
        uploader.on("start", function(event){
            if (/\.exe$/.test(event.file.name)) {
                console.log("Aborting: " + event.file.id);
                uploader.abort(event.file.id, socket);
            }
        });
        uploader.dir = dir;
        uploader.listen(socket);
        //uploader.maxFileSize = 2000;

    }

});

io.socketArray = socketArray;

module.exports = io;