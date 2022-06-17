var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20-with-people-api').Strategy;
var config = require('./../config/config');
var Util = require('./../components/Util');
const moment = require('moment');
var zRoute = require('./../components/zRoute')

/*
 GOOGLE START LOGIN
 */

//var scoope = ['profile', 'email', 'https://www.googleapis.com/auth/plus.login', 'https://www.google.com/m8/feeds'];
//var scoope = ['profile', 'email', 'https://www.googleapis.com/auth/plus.login'];
var scoope = ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'];
var scoope = ['profile', 'email'];

passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {

        var json = {};
        json.accessToken = accessToken;
        json.refreshToken = refreshToken;
        json.profile = profile;

        var data = {};
        data.accessToken = accessToken;
        data.refreshToken = refreshToken;
        data.profile = profile;
        var tokens = {
            "accessToken": accessToken,
            "refreshToken": refreshToken
        };

        data.tokens = tokens;
        data.parameters = {"schedule": "daily"};
        data.pluginId = 1;

        return done(null, data);
    }));


router.get('/google',
    passport.authenticate('google', {
        scope: scoope,
        accessType: 'offline',
        //approvalPrompt: 'force',
        prompt: 'select_account'
    }),
    function (req, res) {
        // The request will be redirected to google.com for authentication, so this
        // function will not be called.
    });

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed'
    }),
    async function (req, res) {
        // Successful authentication, redirect home  page  with session.
        var obj = req.session.passport.user;
        var dataObj = JSON.stringify(obj);
        var email = obj.profile.emails[0]['value'];
        var photo = 'https://lut.im/7JCpw12uUT/mY0Mb78SvSIcjvkf.png';

        if (obj.profile.photos && obj.profile.photos.length) {
            var photoVal = obj.profile.photos[0].value;
            photo = photoVal.replace("?s", "");
        }

        var fullname = obj.profile.displayName;
        var fields = {}
        fields.image = photo;
        fields.fullname = fullname;
        fields.datas = JSON.stringify(obj)
        await zRoute.login(email, fields, req, res, true);
    }
);


/*
 GOOGLE END LOGIN
 */

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});


module.exports = router;