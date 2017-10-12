const messager = require('../modules/messager');
const consumer = new messager.Consumer('amqp://datdb.cphbusiness.dk', {
    exchange: 'test-bound-exchange'
});

consumer.read(msg => {
    console.log(msg.content.toString())
}, {
    bindingKeys: ['discount']
});