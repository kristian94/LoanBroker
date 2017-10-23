const soap = require('soap');
const http = require('http');
const messager = require('../modules/messager');
const express = require('express');
const app = express();

app.use(express.static('frontend'));

const publisher = new messager.Publisher('amqp://datdb.cphbusiness.dk', {
    queue: 'credit-score'
});

const consumer = new messager.Consumer('amqp://datdb.cphbusiness.dk', {
    queue: 'result-queue'
});

const ssnProcessList = (function(){
    const arr = [];

    // return true if the ssn is contained in the list
    function exists(ssn){
        return arr.indexOf(ssn) !== -1;
    }

    function add(ssn){
        if(!exists(ssn)){
            arr.push(ssn);
        }
    }

    function remove(ssn){
        const index = arr.indexOf(ssn);
        arr.splice(index, 1);
    }

    return {
        exists,
        add,
        remove
    }
})();

const brokerService = {
    BrokerService: {
        BrokerPort: {
            broke
        }
    }
};

function parseBrokeRequest(args){
    return {
        ssn: args.ssn,
        amount: Number(args.amount),
        duration: Number(args.duration)
    }
}

function broke(args, callback){

    args = parseBrokeRequest(args);

    console.log('parsed args: ', args);

    // const validSsn = ssn.test(/\d{6}\-\d{4}/);

    // console.log(args);
    const ssn = args.ssn;
    if(ssnProcessList.exists(ssn)){
        console.log('blockd ssn: ' + ssn);
        callback(null, {
            error: 'ssn is already being processed. '
        });
    }else{
        ssnProcessList.add(ssn);
        const obj = argsToMsgObj(args);
        publisher.send(obj);
        consumer.read(function(msg, parsed){
            console.log('recieved from result-queue');
            console.log(parsed);
            callback(parsed);
            ssnProcessList.remove(ssn);
        }, {
            durable: true
        });
    }
}

function argsToMsgObj(args){
    return {
        ssn: args.ssn,
        loanDuration: args.duration,
        loanAmount: args.amount
    }
}

const xml = require('fs').readFileSync('broker-service.wsdl', 'utf8');

//http server example
const server = http.createServer(app);

server.listen(8005);

const soapServer = soap.listen(server, '/wsdl', brokerService, xml);

// soapServer.addSoapHeader(function(func){
//     console.log('setting header for function: ' + func)
//     return {
//         'Access-Control-Allow-Origin': '*'
//     }
// });
