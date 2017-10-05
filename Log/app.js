const url = 'amqp://datdb.cphbusiness.dk';
const messager = require('../modules/messager');
const consumer = new messager.Consumer(url, {
    queue: 'log'
})

consumer.read(logMsg);

function logMsg(msg){
    const stamp = getStamp();
    const msgContent = msg.content.toString();

    console.log(`${stamp} | ${msgContent}`);
}

function getStamp(){
    const now = new Date();
    return dateString(now);

    function dateString(date){
        const h = date.getHours();
        const m = date.getMinutes();
        const s = date.getSeconds();

        return `${twoDigits(h)}:${twoDigits(m)}:${twoDigits(s)}`;
    }

    function twoDigits(input){
        const oneDigit = input.toString().length == 1;
        return oneDigit ? `0${input}`
                        : input;
    }
}

