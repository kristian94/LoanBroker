const messager = require('../modules/messager');
const creditScore = require('./modules/creditScore');
const logger = require('../modules/logger')('Credit Score');

const consumer = new messager.Consumer('amqp://datdb.cphbusiness.dk', {
    queue: 'credit-score'
});

const publisher = new messager.Publisher('amqp://datdb.cphbusiness.dk', {
    queue: ''
});

consumer.read(msgIn => {
    creditScore.enhanceMsgWithScore(msgIn).then(msgOut => {
        // logger.log('Credit Score')
        logger.log(msgOut);

    });
});

// const publisher = new messager.Publisher('amqp://datdb.cphbusiness.dk', {
//     exchange: 'test-get-banks'
// });

function asJson(string){
    if(typeof string === 'string'){
        return JSON.toJSON(string);
    }else if(string !== null && typeof string === 'object'){
        return string
    }else{
        throw new error('input was not a string or object');
    }

}