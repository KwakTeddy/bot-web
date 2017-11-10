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
                "NODE_ENV": "development"
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
