const messager = require('../modules/messager');
const logger = require('../modules/logger')('credit-score-enriched(tester)');

const queue = 'get-banks-test';

const consumer = new messager.Consumer('amqp://datdb.cphbusiness.dk', {
    queue
});

consumer.read(function(msg, parsed){
    if(msg === null || msg === undefined){
        logger.log('ERROR: msg was undefined or null');
    }else{
        logger.log('recieved msg: ' + JSON.stringify(parsed));
        logger.log('YAY');
    }
});

console.log(`listening on queue ${queue}`);

