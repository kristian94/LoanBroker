const messager = require('./messager');
const publisher = new messager.Publisher('amqp://datdb.cphbusiness.dk', {
    exchange: 'kntestexchange'
});

// async function run(){
//     const consumer = await publisher.channel;
//     console.log(consumer);
// }
//
// run();

publisher.send({name: 'Jon', age: 21, time: new Date().getMinutes()}, 'fanout');





// const messager = require('./messager-old');
//
// const consumer = new messager('amqp://datdb.cphbusiness.dk');
//
// consumer.publish({msg: 'hello'})





// async function run(){
//     const consumer = await require('amqplib').connect('amqp://datdb.cphbusiness.dk');
//     console.log(consumer);
// }

// run();