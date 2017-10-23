var soap = require('soap');
var url = 'http://localhost:8000/wsdl?wsdl';





async function getRules(score){
    try{
        const args = {score:score};
        const client = await soap.createClientAsync(url);
        const res = await client.getRuleAsync(args);
        return res.queues.queues;
    }catch(err){
        console.error(err);
    }
}

async function enhanceMsgWithRules(_msg){
    const msg = Object.assign({}, _msg);
    if(msg.ssn === null || msg.ssn === undefined){
        throw new Error('Missing key "ssn"');
    }
    if(msg.creditScore === null || msg.creditScore === undefined){
        throw new Error('Missing credit score')
    }

    const queues = await getRules(msg.creditScore);
    var array = queues.split(",");
    msg.queues = array;
    return msg;
}


module.exports = {
    enhanceMsgWithRules: enhanceMsgWithRules
};


