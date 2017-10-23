#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const client = require("./modules/client");

const messager = require('../modules/messager');
const logger = require('../modules/logger')('GetBanks');



const queueIn = 'get-banks-test';
const queueOut = 'recip-test';


const consumer = new messager.Consumer('amqp://datdb.cphbusiness.dk', {
    queue: queueIn
});


const publisher = new messager.Publisher('amqp://datdb.cphbusiness.dk', {
    queue: queueOut
});

consumer.read(onRead);

function onRead(msgIn){
    console.log(msgIn);
    if(msgIn === null || msgIn === undefined){
        logger.log('ERROR: msgIn was undefined or null');
    }else{
        const parsedMsg = JSON.parse(msgIn.content.toString());
        logger.log('recieved msg (parsed): ' + JSON.stringify(parsedMsg));
        client.enhanceMsgWithRules(parsedMsg).then(msgOut => {
            logger.log('Sending enhanced message to recipient list');
            publisher.send(msgOut)
        })

    }
}


