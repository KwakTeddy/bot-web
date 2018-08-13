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
            merge_logs : true,
            log_date_format : "YYYY-MM-DD HH:mm Z",
            watch: false,
            env_localhost:
            {
                "PORT": 8443,
                "HOST": "http://localhost:8443",
                "FACEBOOK_ID" : "299548697231251",
                "FACEBOOK_SECRET" : "f4f156d25ec93050376af77967ed500e",
                "KAKAO_KEY": "14d5a3ad7584cf6cf2bee86dc6f34935",
                "GOOGLE_ID": "836859697511-qlvufftcjjhmfivkeoiv0l7i7lgm41oo.apps.googleusercontent.com",
                "GOOGLE_SECRET": "_NEHSeUNPc7kEeHZZeu-DXoS",
                "NODE_ENV": "development"
            },
            env_development:
            {
                "PORT": 443,
                "HOST": "https://remaster.moneybrain.ai",
                "FACEBOOK_ID" : "299548697231251",
                "FACEBOOK_SECRET" : "f4f156d25ec93050376af77967ed500e",
                "KAKAO_KEY": "14d5a3ad7584cf6cf2bee86dc6f34935",
                "GOOGLE_ID": "836859697511-qlvufftcjjhmfivkeoiv0l7i7lgm41oo.apps.googleusercontent.com",
                "GOOGLE_SECRET": "_NEHSeUNPc7kEeHZZeu-DXoS",
                "NODE_ENV": "development"
            },
            env_production:
            {
                "PORT": 443,
                "FACEBOOK_ID": "1557169960967403",
                "FACEBOOK_SECRET": "282b2a30ec8115f364833a5d48b60cf6",
                "KAKAO_KEY": "25009b49de426e1ad0b8da2631b52cc5",
                "KAKAO_JSID": "f1eb73f3491e5c1e1178b3b8c12b10e5",
                "HOST": "https://playchat.ai",
                "MONGOLAB_URI": "mongodb://172.31.14.78:27017/bot",
                "MONGO_RSNAME": "rs1",
                "REDIS": "172.31.26.141",
                "LB_USE": "false",
                "LB_MASTER": "false",
                "LB_SLAVE": "false",
                "LB_HOST": "",
                "LB_PORT": "",
                "NODE_ENV": "production"
            }
        }
    ]
}
