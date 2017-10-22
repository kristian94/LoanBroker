const messager = require('../modules/messager');
const logger = require('../modules/logger')('credit-score-req(tester)');

const publisher = new messager.Publisher('amqp://datdb.cphbusiness.dk', {
    queue: 'credit-score'
});

publisher.send({ssn: '123456-1234'});

logger.log('sending msg to credit-score {ssn: "123456-1234"}...');
