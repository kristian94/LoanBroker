const messager = require('../modules/messager');
const creditScore = require('./modules/creditScore');
const logger = require('../modules/logger')('credit-score');

const queueIn = 'credit-score';
const queueOut = 'get-banks-test';

const consumer = new messager.Consumer('amqp://datdb.cphbusiness.dk', {
    queue: queueIn
});

const publisher = new messager.Publisher('amqp://datdb.cphbusiness.dk', {
    queue: queueOut
    // queue: 'get-banks'
});

consumer.read(onRead);

function onRead(msgIn){
    console.log(msgIn);
    if(msgIn === null || msgIn === undefined){
        logger.log('ERROR: msgIn was undefined or null');
    }else{
        const parsedMsg = JSON.parse(msgIn.content.toString());
        logger.log('recieved msg (parsed): ' + JSON.stringify(parsedMsg));

        creditScore.enhanceMsgWithScore(parsedMsg).then(msgOut => {
            logger.log('Sending enhanced message to rule base: ' + JSON.stringify(parsedMsg));

            publisher.send(msgOut)
        });
    }
}

console.log(`credit score | queueIn: ${queueIn}, queueOut: ${queueOut}`);

console.log('credit score running');
logger.log('credit score running');
