const url = 'amqp://datdb.cphbusiness.dk';
const messager = require('./messager');
const publisher = new messager.Publisher(url, {
    queue: 'log'
});


function log(msg){
    publisher.send(msg);
}

module.exports = {
    log
};