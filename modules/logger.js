const url = 'amqp://datdb.cphbusiness.dk';
const messager = require('./messager');
const publisher = new messager.Publisher(url, {
    queue: 'log'
});

function Logger(options = {}){
    this.appName = options.appName || '';
}

function buildLogObj(msgString){
    const appName = this.appName;
    const isoStamp = new Date().toISOString();

    return {
        isoStamp,
        appName,
        msgString
    };
}

Logger.prototype.log = function (msgString) {
    const logObj = buildLogObj.call(this, msgString);
    publisher.send(JSON.stringify(logObj));
};

module.exports = appName => {
    return new Logger({
        appName
    })
};