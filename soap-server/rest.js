const express = require('express');
const app = express();
const messager = require('../modules/messager');
const cors = require('cors');

const port = 8005;

app.use(express.json());
app.use('/loanbroker', express.static('frontend'));
app.use(cors());


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

const ssnCallbacks = (function(){
    const array = [];

    function add(ssn, callback){
        const obj = {ssn};
        obj.callback = fireOnce(ssn, callback);
        array.push(obj);
        logLength();
    }

    function tryRemove(ssn){
        let removed = false;
        array.forEach(function(element, index){
            if(element.ssn === ssn){
                array.splice(index, 1);
                removed = true;
            }
        });
        logLength();
        return removed;
    }

    const fireOnce = (ssn, callback) => (input) => {
        tryRemove(ssn);
        callback(input);
    };

    function get(ssn){
        let returned = '';
        array.forEach(function(element, index){
            if(element.ssn === ssn){
                returned = element;
            }
        });

        return returned;
    }

    function logLength(){
        console.log(array.length)
    }

    function fire(ssn, args){
        const obj = get(ssn);
        if(obj && obj.callback){
            obj.callback(args);
        }else{
            console.info('attempted to fire callback, but was not present');
        }

    }

    return {
        add, fire
    }
})();

app.post('/loanbroker/broke', function(req, res){
    const body = req.body;
    const ssn = body.ssn;

    // request timeout...
    const timeoutId = setTimeout(_ => {
        res.status(500);
        res.send('Det lader til at vores servere oplever lidt problemer...');
        ssnProcessList.remove(ssn);
    }, 5000);

    const cancelTimeout = () => clearTimeout(timeoutId);


    // if a request is already being processed for the ssn
    if(ssnProcessList.exists(ssn)){
        cancelTimeout();
        console.log('blocked ssn: ' + ssn);
        res.status(400);
        res.send('Request blocked, as the ssn is already being processed');

    }else{
        // we subscribe a callback to the ssnCallback module
        console.log(`waiting for response for ssn: ${ssn}`);
        ssnProcessList.add(ssn);
        const obj = parseBrokeBody(body);
        publisher.send(obj);
        ssnCallbacks.add(ssn, (offer) => {
            cancelTimeout();
            res.send(offer);
        });
    }
});

consumer.read(function(msg, parsed){
    const ssn = parsed.ssn;

    console.log('received from result-queue');
    console.log(parsed);

    ssnCallbacks.fire(ssn, parsed);
    ssnProcessList.remove(ssn);
}, {
    durable: true
});

function parseBrokeBody(body){
    return {
        loanAmount: Number(body.amount),
        loanDuration: Number(body.duration),
        ssn: body.ssn
    }
}


app.listen(port);