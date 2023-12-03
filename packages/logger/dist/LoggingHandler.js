"use strict";
// LoggingHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLog = exports.SourcesEnum = void 0;
var SourcesEnum;
(function (SourcesEnum) {
    SourcesEnum["CLIENT_SENT_TO_SERVER"] = "CLIENT_SENT_TO_SERVER";
    SourcesEnum["CLIENT_RECEIVED_FROM_SERVER"] = "CLIENT_RECEIVED_FROM_SERVER";
})(SourcesEnum || (exports.SourcesEnum = SourcesEnum = {}));
var sendLog = function (messagePayload, timeStamp, source) {
    console.log("Calling sendLog");
    messagePayload.timeStamp = timeStamp;
    messagePayload.source = source;
    var requestOptions = {
        method: "POST",
        body: JSON.stringify(messagePayload),
        headers: { "Content-Type": "application/json" }
    };
    fetch("https://cs536.escglobal.co/v1/message/log", requestOptions)
        .catch(function (error) { return console.log("logging error", error); });
};
exports.sendLog = sendLog;
