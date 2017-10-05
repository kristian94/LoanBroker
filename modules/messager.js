const amqplib = require('amqplib')

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



Publisher.prototype.send = async function(data, type = 'direct'){
    try{
        const channel = await this.channel;
        if(!!this.exchange){
            publishToExchange(channel, {
                exchange: this.exchange,
                queue: this.queue,
                type: type,
                data: data
            });
            // this.exchange, this.queue, type, data
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
    channel.assertExchange(exchange, type);
    channel.publish(exchange, queue, new Buffer(JSON.stringify(data)));
    console.log(`published data to exchange(${exchange}) using type(${type})`);
    console.log(data);
}

async function sendToQueue(channel, options = {}){
    const queue = options.queue;
    const data = options.data;
    channel.assertQueue(queue);
    channel.sendToQueue(queue, new Buffer(JSON.stringify(data)));
    console.log(`sent data to queue(${queue}) using type(${type})`);
    console.log(data);
}

async function subscribeToExchange(channel, options = {}){
    const exchange = options.exchange;
    const type = options.type;
    const onMessage = options.onMessage;
    channel.assertExchange(exchange, type);
    const ok = await channel.assertQueue('', {exclusive: true});
    const queue = ok.queue;
    channel.bindQueue(queue, exchange, '');
    channel.consume(queue, onMessage);
}

async function consumeFromQueue(channel, options = {}){
    const queue = options.queue;
    const onMessage = options.onMessage;
    channel.assertQueue(queue);
    channel.consume(queue, onMessage);
}

function bindOptions(url, options){
    const prepend = 'ckkm-';
    this.url = options.url || 'amqp://datdb.cphbusiness.dk';
    this.queue = options.queue ? prepend + options.queue : '';
    this.exchange = options.exchange ? prepend + options.exchange : '';
}

async function getConnection(){
    // console.log(this.url);
    console.log(this)
    console.log(`connecting to url: ${this.url}...`)
    return amqplib.connect(this.url);
}

async function getChannel(){
    // console.log('a1')
    const connection = await this.connection;
    // console.log('a2')
    return await connection.createChannel();
}