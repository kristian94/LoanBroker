const url = 'amqp://datdb.cphbusiness.dk';
const colors = require('colors');

const messager = require('../modules/messager');
const consumer = new messager.Consumer(url, {
    queue: 'log'
});

consumer.read(logMsg);

function logMsg(msg){
    
    const obj = JSON.parse(msg.content.toString());

    const stamp = formatStamp(obj.isoStamp);
    const appName = !!obj.appName ? obj.appName : '';
    const msgString = obj.msgString;

    (!!appName) ? console.log(`${stamp} @(${appName}): `.green + msgString.yellow) :
                  console.log(`${stamp}: `.green + msgString.yellow);
}

function formatStamp(stamp){
    const index = stamp.indexOf('T');
    return stamp.substring(index+1, index+9);
}