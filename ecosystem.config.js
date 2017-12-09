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
            env:
            {
                "PORT": 8443,
                "HOST": "http://localhost:8443",
                "NODE_ENV": "development",
                "FACEBOOK_ID" : "299548697231251",
                "FACEBOOK_SECRET" : "f4f156d25ec93050376af77967ed500e",
                "KAKAO_KEY": "14d5a3ad7584cf6cf2bee86dc6f34935",
                "GOOGLE_ID": "836859697511-qlvufftcjjhmfivkeoiv0l7i7lgm41oo.apps.googleusercontent.com",
                "GOOGLE_SECRET": "_NEHSeUNPc7kEeHZZeu-DXoS"
            },
            env_production:
            {
                "PORT": 443,
                "FACEBOOK_ID": "1600126966671702",
                "FACEBOOK_SECRET": "8b9f96fa9974280b576647df96c03890",
                "KAKAO_KEY": "482579e97a7f46badd2c88a3a66ba862",
                "KAKAO_JSID": "ca71056a613942b6ebcf53801a7abb65",
                "HOST": "https://remaster.moneybrain.ai",
                "MONGOLAB_URI": "mongodb://localhost:27017/bot",
                "MONGO_RSNAME": "rs1",
                "REDIS": "172.31.26.141",
                "LB_USE": "false",
                "LB_MASTER": "false",
                "LB_SLAVE": "false",
                "LB_HOST": "",
                "LB_PORT": "",
                "NODE_ENV": "prod"
            }
        }
    ]
}
