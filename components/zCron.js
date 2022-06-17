var cron = require('node-cron');
var connection = require('./../config/connection');
var zSSH = require('./zSSH2');
var Util = require('./Util');


let timedays = '30 10,15 * * *'; //setiap hari jam 10.30 dan 15.30
let time_10_minutes = '0 */10 * * * *'; //setiap 10 menit

var checkServer = async() => {
    try {
        let servers = await connection.results({
            table : "server",
            where : {
                alert : 1
            }
        });
        if(servers.length) {
            servers.forEach(async(server) => {
                console.log("cron server " +server.title)
                zSSH.open(server, async (conn, err) =>{
                    if(err) {
                        console.log("ada error")
                         await connection.update({
                             table : "server",
                             data : {
                                 status : 0
                             },
                             where :{
                                 id : server.id
                             }
                        });

                        //blast to all users
                        var users = await  connection.results({
                            table : "zuser",
                            where : {
                                active : 1
                            }
                        });
                        var message = `Server ${server.title} is down`;
                            users.forEach(async (user) => {
                            var data = {
                                company_id : user.company_id,
                                user_id : user.id,
                                updated_by : 1,
                                created_by : 1,
                                created_at : Util.now(),
                                updated_at : Util.now(),
                                title : message,
                                description : message,
                                status : 0,
                                status_label : "Down",
                                table : "server",
                                id_data : server.id,
                                link : `/server/view/${server.id}`,
                                token : "server_down"
                            }
                                await connection.insert({
                                table : "znotification",
                                data : data
                            });

                        });
                        //continue;
                    } else {
                        await connection.update({
                            table : "server",
                            data : {
                                status : 1
                            },
                            where :{
                                id : server.id
                            }
                        });
                    }
                });
            });
        }
    } catch(err) {
        console.log(err)
    }
}


var keptAliveService = async() => {
    var results = await connection.results({
        table : "services",
        where : {
            kept_alive : 1
        }
    });

    for(var i = 0; i< results.length;i++){
        var server = await connection.result({
            table : "server",
            where : {
                id : results[i].server_id,
                status : 1
            }
        });

        if(server.id) {
            //checks status server
            await zSSH.exec(server, `systemctl start  ${results[i].title}`, function(data) {
            });
        }
    }
}

var myTasks = {}
myTasks.tasks1 = cron.schedule(time_10_minutes, async() => {
    var query = await connection.query(connection.describeTable("server"));
    if(query.length) {
        await checkServer();
        await keptAliveService();
    }

}, {
    scheduled: true
});

module.exports = myTasks;