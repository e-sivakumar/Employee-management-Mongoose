const { createLogger, transports, format } = require("winston");
const httpContext = require("express-http-context");

const info = createLogger({
    transports:[
        new transports.File({
            filename: "info_log",
            level: "info",
            format: format.combine(format.timestamp(), format.json())
        })
    ],
    defaultMeta:{
        get txnId() {
            return httpContext.get("x_txn_id");
        },
        get userId() {
            return httpContext.get("x_user_id")
        },
        get xApiName() {
            return httpContext.get("x_api_name")
        },
        module: "logger"
    }
});

const error = createLogger({
    transports:[
        new transports.File({
            filename: "error_log",
            level: "error",
            format: format.combine(format.timestamp(), format.json())
        })
    ],
    defaultMeta: {
        get txnId() {
            return httpContext.get("x_txn_id");
        },
        get userId() {
            return httpContext.get("x_user_id")
        },
        get xApiName() {
            return httpContext.get("x_api_name")
        },
        module: "logger"
    }
})

module.exports = {info, error}