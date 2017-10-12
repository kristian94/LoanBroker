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

Publisher.prototype.send = async function(data, options = {}){
    options.data = data;
    options.queue = this.queue;
    options.exchange = this.exchange;

    try{
        const channel = await this.channel;
        if(!!this.exchange){
            publishToExchange(channel, options);
        }else{
            sendToQueue(channel, options);
        }
    }catch(error){
        console.warn(error);
    }
};

Consumer.prototype.read = async function(onMessage, options = {}){
    options.queue = this.queue;
    options.exchange = this.exchange;
    options.onMessage = onMessage;

    try{
        const channel = await this.channel;
        if(!!this.exchange){
            subscribeToExchange(channel, options);
        }else{
            consumeFromQueue(channel, options);
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
    const routingKey = options.routingKey || '';

    console.log(`publishing data to exchange(${exchange}) using type(${type})`);

    channel.assertExchange(exchange, type, {durable});
    channel.publish(exchange, routingKey, new Buffer(JSON.stringify(data)));

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
    const isExclusive = options.type !== 'fanout'
    const onMessage = options.onMessage;
    const durable = options.durable || defaults.durable;
    const bindingKeys = options.bindingKeys || [''];

    channel.assertExchange(exchange, type, defaults);
    const ok = await channel.assertQueue('', {exclusive: isExclusive, durable});
    const queue = ok.queue;
    bindingKeys.forEach(bindingKey => {
        channel.bindQueue(queue, exchange, bindingKey);
    });
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

function stringOrStringify(input){
    const isObj = input !== null && typeof input === 'oject';

    return isObj ? JSON.stringify(input) : input;
}