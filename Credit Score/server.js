const soap = require('soap');
const http = require('http');

const brokerService = {
    BrokerService: {
        BrokerPort: {
            broke: function(args) {
                console.log(args);
                return {
                    greeting: `requested loan | ssn: ${args.ssn}, duration(months): ${args.durationInMonths}, amount: ${args.amount}`
                };
            }
        }
    }
};

const xml = require('fs').readFileSync('broker-service.wsdl', 'utf8');

//http server example
const server = http.createServer(function(request,response) {
    response.end('404: Not Found: ' + request.url);
});

server.listen(8000);
soap.listen(server, '/wsdl', brokerService, xml);


