const creditScore = require('./modules/creditScore');


creditScore.enhanceMsgWithScore({ssn: '123456-1234'}).then(msgOut => {
    console.log(msgOut);
});