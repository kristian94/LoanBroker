const soap = require('soap');
const http = require('http');
const messager = require('../modules/messager');

const publisher = new messager.Publisher('amqp://datdb.cphbusiness.dk', {
    queue: 'credit-score'
});

const consumer = new messager.Consumer('amqp://datdb.cphbusiness.dk', {
    queue: 'tbd'
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
            brokeAsync
        }
    }
};

function brokeAsync(args, callback){
    const ssn = args.ssn;
    if(ssnProcessList.exists(ssn)){
        callback(null, {
            error: 'ssn is already being processed. '
        });
    }else{
        ssnProcessList.add(ssn);
        const obj = argsToMsgObj(args);
        publisher.send(obj);
        consumer.read(function(msg, parsed){
            callback(parsed);
            ssnProcessList.remove(ssn);
        })
    }
}

function argsToMsgObj(args){
    return {
        ssn: args.ssn,
        duration: args.duration,
        amount: args.amount
    }
}

const xml = require('fs').readFileSync('broker-service.wsdl', 'utf8');

//http server example
const server = http.createServer(function(request,response) {
    response.end('404: Not Found: ' + request.url);
});

server.listen(8000);

soap.listen(server, '/wsdl', brokerService, xml);
