const url = 'amqp://datdb.cphbusiness.dk';
const colors = require('colors');

const messager = require('../modules/messager');
const consumer = new messager.Consumer(url, {
    queue: 'log'
});

consumer.read(logMsg);

function logMsg(msg){

    const temp = JSON.parse(msg.content.toString()); // af en eller anden grund skal der parses 2 gange....
    const obj = JSON.parse(temp);

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