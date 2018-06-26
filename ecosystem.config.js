module.exports =
{
    apps :
    [
        {
            name: "playchat",
            script: "./server.js",
            instances : "1",
            exec_mode : "cluster",

            error_file : "err.log",
            out_file : "out.log",
            retain : "all",
            workerInterval : 60*60*10,
            max_size : '1000M',
            merge_logs : true,
            rotateInterval : '* * 23 * * *',

            log_date_format : "YYYY-MM-DD HH:mm Z",
            watch: false,
            env:
            {
                "PORT": 8443,
                "HOST": "http://localhost:8443",
                "FACEBOOK_ID" : "299548697231251",
                "FACEBOOK_SECRET" : "f4f156d25ec93050376af77967ed500e",
                "KAKAO_KEY": "14d5a3ad7584cf6cf2bee86dc6f34935",
                "GOOGLE_ID": "836859697511-qlvufftcjjhmfivkeoiv0l7i7lgm41oo.apps.googleusercontent.com",
                "GOOGLE_SECRET": "_NEHSeUNPc7kEeHZZeu-DXoS",
                "REDIS": "13.125.126.30",
                "NODE_ENV": "development"
            },
            env_remaster:
            {
                "PORT": 443,
                "HOST": "https://remaster.moneybrain.ai",
                "FACEBOOK_ID" : "299548697231251",
                "FACEBOOK_SECRET" : "f4f156d25ec93050376af77967ed500e",
                "KAKAO_KEY": "14d5a3ad7584cf6cf2bee86dc6f34935",
                "GOOGLE_ID": "836859697511-qlvufftcjjhmfivkeoiv0l7i7lgm41oo.apps.googleusercontent.com",
                "GOOGLE_SECRET": "_NEHSeUNPc7kEeHZZeu-DXoS",
                "REDIS": "52.79.198.109",
                "NODE_ENV": "remaster"
            },
            env_development:
            {
                //"PORT": 8443,
                "PORT": 443,
                //"HOST": "http://localhost:8443",
                "HOST": "https://remaster.moneybrain.ai",
                //"REDIS": "127.0.0.1",
                "REDIS": "172.31.5.26",
                "FACEBOOK_ID" : "299548697231251",
                "FACEBOOK_SECRET" : "f4f156d25ec93050376af77967ed500e",
                "KAKAO_KEY": "14d5a3ad7584cf6cf2bee86dc6f34935",
                "GOOGLE_ID": "836859697511-qlvufftcjjhmfivkeoiv0l7i7lgm41oo.apps.googleusercontent.com",
                "GOOGLE_SECRET": "_NEHSeUNPc7kEeHZZeu-DXoS",

                //"LOG_ROTATING_ACTIVE":'true',
                //"LOG_LEVEL":'debug',
                //"LOG_ROTATING_VERBOSE":'true',

                "NODE_ENV": "development"
            },
            env_production:
            {
                "PORT": 443,

                // for Facebook Test
                //"FACEBOOK_ID" : "299548697231251",
                //"FACEBOOK_SECRET" : "f4f156d25ec93050376af77967ed500e",

                "FACEBOOK_ID": "1557169960967403",
                "FACEBOOK_SECRET": "282b2a30ec8115f364833a5d48b60cf6",
                "KAKAO_KEY": "25009b49de426e1ad0b8da2631b52cc5",
                "KAKAO_JSID": "f1eb73f3491e5c1e1178b3b8c12b10e5",
                "GOOGLE_ID": "567723322080-pofpo61olppueufq2r57j2cufgb65tg3.apps.googleusercontent.com",
                "GOOGLE_SECRET": "cM_Rcn6dxCNeipINWI8K2QG7",
                "HOST": "https://playchat.ai",
                "REDIS": "172.31.26.141",
                "MONGOLAB_URI": "mongodb://172.31.14.78:27017/bot",
                "MONGO_RSNAME": "rs1",

                "LOG_ROTATING_ACTIVE":'true',
                "LOG_LEVEL":'warning',

                "NODE_ENV": "production"
            }
        }
    ]
}
