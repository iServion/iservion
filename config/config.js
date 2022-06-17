var env = process.env.NODE_ENV || 'development';
var ecosystem = require("./../ecosystem.config.js");
var port = ecosystem.apps[0].env.PORT;
const config = require('dotenv').config();
var url = env == "production" ? process.env.APP_URL : 'http://localhost:' + port;

module.exports = {
    app: {
        port: process.env.NODE_ENV || port,
        sessionName: 'monitoring',
        title: 'Monitoring',
        description: "Monitoring ",
        brand: "Monitoring",
        pagination: [20, 50, 100, 200, 500],
        //please input your domain url for production
        get socketUrl() {
            return url;
        },
        //socketio or websocket
        socket: 'socketio',
        thousandSeparator: '.',
        get url() {
            return url;
        },
        port:port,
        pm2: ecosystem.apps[0].name,
        debug: true,
        afterLogin: "/zdashboard"
    },
    layouts: {
        name: 0,
        frameworkcss: "bootstrap5",
        form_css: "bootstrap"
    },
    contacts: {
        phone: '6281575068530',
        telp: '62215372005',
        email: 'info@cmsqu.com',
        address: 'Jl. Palmerah Barat No.41 Jakarta Pusat',
        zip: '15323',
        country: 'Indonesia',
        logo: `${url}/img/logo.png`
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${url}/auth/google/callback`,
        shortUrl: process.env.GOOGLE_SHORT_URL,
        key: process.env.GOOGLE_KEY
    },
    recaptcha: {
        siteKey: '6LcmfuwUAAAAALn5f_CTrEKd7Bb4F5ijSjtGIdem',
        secretKey: '6LcmfuwUAAAAAEML-8n_wJpSEadR_Npm3UVirENx'
    },
    //PLEASE DO NOT EXPOSE THIS KEYS FOR API
    keys: {
        jwt: 'jwtmyapp',
        secret: 'appmaker_pg_secret',
        hash : 'appmaker_hash'
    },
    //FOR GENERATOR CONFIG
    generator: require("./config_generator"),
    environment: env
}
