var nodemailer = require('nodemailer');
var ejs = require('ejs')
var Util = require('./Util');
var debug = require("./../components/debug");
var io = require("./../components/io");
var moment = require("moment")

var MAIL = {}
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var transporter = nodemailer.createTransport({
    host: 'sintret.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'office@sintret.com',
        pass: 'admin12356'
        //pass: 'payroll12356'
    }
});

var mailOptions = {
    from: 'office@sintret.com', // sender address (who sends)
    to: 'sintret@gmail.com,', // list of receivers (who receives)
    subject: 'Hello ', // Subject line
    text: '', // plaintext body
    html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
};

MAIL.send = function (options) {
    options = options || {}
    var withOptions = {};
    withOptions.from = options.hasOwnProperty("from") ? options.from : mailOptions.from;
    withOptions.to = options.hasOwnProperty("to") ? options.to : mailOptions.to;
    withOptions.subject = options.hasOwnProperty("subject")  ? options.subject : mailOptions.subject;
    withOptions.text = options.hasOwnProperty("text") ? options.text : mailOptions.text;
    withOptions.html = options.hasOwnProperty("html")  ? options.html : mailOptions.html;

    // send mail with defined transport object
    transporter.sendMail(withOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }

        console.log('Message sent: ' + info.response);
    });
}

MAIL.forgotPassword = (datas,options) => {
    ejs.renderFile(dirRoot + "/views/layouts/email/forgot_password.ejs", {data:datas,Util:Util }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            options = options || {}
            var withOptions = {};
            withOptions.from = options.hasOwnProperty("from") ? options.from : mailOptions.from;
            withOptions.to = options.hasOwnProperty("to") ? options.to : mailOptions.to;
            withOptions.subject = options.hasOwnProperty("subject")  ? options.subject : "Forgot Password";
            withOptions.html = data;
            transporter.sendMail(withOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }

                console.log('Message sent: ' + info.response);
            });
        }
    });
}

MAIL.register = (datas, options) => {
    ejs.renderFile(dirRoot + "/views/layouts/email/register.ejs", {data:datas,Util:Util }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            options = options || {}
            var withOptions = {};
            withOptions.from = options.hasOwnProperty("from") ? options.from : mailOptions.from;
            withOptions.to = options.hasOwnProperty("to") ? options.to : mailOptions.to;
            withOptions.subject = options.hasOwnProperty("subject")  ? options.subject : "Aktifasi Keanggotaan";
            withOptions.html = data;
            transporter.sendMail(withOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }

                console.log('Message sent: ' + info.response);
            });
        }
    });
}


MAIL.gmail = (req, res, data, email) => {
    let obj = {"USERNAME":"aptiwise@gmail.com","PASSWORD":"bjyoflszgblenlep","TO":"andif@injani.com","SUBJECT":"Test gmail Subject widget cms","MESSAGE":"Test gmail test message cms"}

    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: obj.USERNAME,
            pass: obj.PASSWORD
        }
    });


    ejs.renderFile(dirRoot + "/views/layouts/email/approval.ejs", {data:data,Util:Util }, function (err, html) {
        if (err) {
            console.log(err);
        } else {

            var mailOptions = {
                from: obj.USERNAME,
                to: email,
                subject: data.subject,
                html: html
            }


            mail.sendMail(mailOptions, function(error, info){
                if (error) {
                    debug(req,res,error)
                    io.to(res.locals.token).emit("warning", "email not sent to "+ email +" : " + error.toString())
                } else {
                    console.log('Email sent: ' + info.response);
                    io.to(res.locals.token).emit("message", "email sent to "+ email +" : " + info.response)
                }
            });


        }
    });
}


module.exports = MAIL;