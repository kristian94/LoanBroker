const url = 'amqp://datdb.cphbusiness.dk';
const colors = require('colors');

const messager = require('../modules/messager');
const consumer = new messager.Consumer(url, {
    queue: 'log'
});

consumer.read(logMsg);

function logMsg(msg, parsed){

    const stamp = formatStamp(parsed.isoStamp);
    const appName = !!parsed.appName ? parsed.appName : '';
    const msgString = parsed.msgString;

    (!!appName) ? console.log(`${stamp} @(${appName}): `.green + msgString.yellow) :
                  console.log(`${stamp}: `.green + msgString.yellow);
}

function formatStamp(stamp){
    const index = stamp.indexOf('T');
    return stamp.substring(index+1, index+9);
}

console.log('Log running');
