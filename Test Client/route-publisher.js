const messager = require('../modules/messager');

const publisher = new messager.Publisher('amqp://datdb.cphbusiness.dk', {
    exchange: 'test-bound-exchange'
});

publisher.send('this goes to premium route', {
    routingKey: 'premium'
});

