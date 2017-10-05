const amqplib = require('amqplib');
const defaults = {
    durable: false
}

module.exports = {
    Publisher,
    Consumer
};

function Publisher(url, options){
    bindOptions.call(this, url, options);
    this.connection = amqplib.connect(url);
    this.channel = getChannel.call(this);
}

function Consumer(url, options){
    bindOptions.call(this, url, options);
    this.connection = amqplib.connect(url);
    this.channel = getChannel.call(this);
}

Publisher.prototype.send = async function(data, type = 'direct', routingKey = ''){
    try{
        const channel = await this.channel;
        if(!!this.exchange){
            publishToExchange(channel, {
                exchange: this.exchange,
                queue: this.queue,
                type: type,
                data: data,
                routingKey: routingKey
            });
        }else{
            sendToQueue(channel, {
                queue: this.queue,
                data: data
            });
        }
    }catch(error){
        console.warn(error);
    }
};

Consumer.prototype.read = async function(onMessage, type = 'direct'){
    try{
        const channel = await this.channel;
        if(!!this.exchange){
            subscribeToExchange(channel, {
                exchange: this.exchange,
                type: type,
                onMessage: onMessage
            });
        }else{
            consumeFromQueue(channel, {
                queue: this.queue,
                onMessage: onMessage
            });
        }
    }catch(error){
        console.warn(error);
    }

};

async function publishToExchange(channel, options = {}){

    const exchange = options.exchange;
    const queue = options.queue;
    const type = options.type;
    const data = options.data;
    const durable = options.durable || defaults.durable;
    console.log(`publishing data to exchange(${exchange}) using type(${type})`);
    channel.assertExchange(exchange, type, {durable});
    channel.publish(exchange, queue, new Buffer(JSON.stringify(data)));
    console.log(`data sent: `);
    console.log(data);
}

async function sendToQueue(channel, options = {}){

    const queue = options.queue;
    const data = options.data;
    const durable = options.durable || defaults.durable;
    console.log(`sending data to queue(${queue})`);
    channel.assertQueue(queue, {durable});
    channel.sendToQueue(queue, new Buffer(JSON.stringify(data)));
    console.log('data sent:')
    console.log(data);
}

async function subscribeToExchange(channel, options = {}){
    const exchange = options.exchange;
    const type = options.type;
    const onMessage = options.onMessage;
    const durable = options.durable || defaults.durable;
    channel.assertExchange(exchange, type, defaults);
    const ok = await channel.assertQueue('', {exclusive: true, durable});
    const queue = ok.queue;
    channel.bindQueue(queue, exchange, '');
    channel.consume(queue, onMessage);
}

async function consumeFromQueue(channel, options = {}){
    const queue = options.queue;
    const onMessage = options.onMessage;
    const durable = options.durable || defaults.durable;
    channel.assertQueue(queue, {durable});
    channel.consume(queue, onMessage);
}

function bindOptions(url, options){
    const prepend = 'ckkm-';
    this.url = options.url || 'amqp://datdb.cphbusiness.dk';
    this.queue = options.queue ? prepend + options.queue : '';
    this.exchange = options.exchange ? prepend + options.exchange : '';
}

async function getChannel(){
    const connection = await this.connection;
    return await connection.createChannel();
}