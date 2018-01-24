const soap = require('soap');
const url = 'http://138.68.85.24:8080/CreditScoreService/CreditScoreService?wsdl';
const logger = require('../modules/logger')('credit-score-module');

async function enhanceMsgWithScore(msgIn){
    const msg = Object.assign({}, msgIn);
    if(msg.ssn === null || msg.ssn === undefined){
        throw new Error('Missing key "ssn"');
    }
    const creditScore = await getCreditScore(msg.ssn);
    msg.creditScore = creditScore;
    return msg;
}

async function getCreditScore(ssn){
    try{
        const args = {ssn};
        const client = await soap.createClientAsync(url);
        const res = await client.creditScoreAsync(args);
        logger.log(`Got following credit score from credit score soap server: ${res}`);
        return res.return;
    }catch(err){
        console.error(err);
    }
}

module.exports = {
    enhanceMsgWithScore: enhanceMsgWithScore
};

