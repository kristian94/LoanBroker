#!/usr/bin/env node

// var amqp = require('amqplib/callback_api');
//
// amqp.connect('amqp://datdb.cphbusiness.dk', function(err, conn) {
//     conn.createChannel(function(err, ch) {
//         var ex = 'logssseeeeetest';
//
//         ch.assertExchange(ex, 'fanout', {durable: false});
//
//         ch.assertQueue('', {exclusive: true}, function(err, q) {
//             console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
//             ch.bindQueue(q.queue, ex, '');
//
//             ch.consume(q.queue, function(msg) {
//                 console.log(" [x] %s", msg.content.toString());
//             }, {noAck: true});
//         });
//     });
// });


const messager = require('../modules/messager');
const logger = require('../modules/logger')('credit-score-enriched(tester)');

const queue = 'recip-test';

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
