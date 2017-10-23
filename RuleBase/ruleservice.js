/*jslint node: true */
"use strict";


var http = require('http');
var soap = require('soap');
var ruleService = {
    Rule_Service: {
        Rule_Port: {
            getRule: function(args) {
                console.log(args)
                var res = {};
                if(args.score > 1 && args.score < 350 ){

                    res.queues =["ckkm-cph-xml,ckkm-PremiumBank"]

                }
                if(args.score > 350 && args.score < 650 ){

                    res.queues = ["ckkm-cph-json"];

                }
                if(args.score > 650 && args.score < 750 ){

                    res.queues = ["ckkm-cph-json,ckkm-xml-in"];
                }
                if(args.score > 750){

                    res.queues = ["ckkm-xml-in"];

                }

                return res;
            }
        }
    }
};

var xml = require('fs').readFileSync('ruleservice.wsdl', 'utf8');

var server = http.createServer(function(request,response) {
    response.end("404: Not Found: "+request.url);
    
});

server.listen(8000);

soap.listen(server, '/wsdl', ruleService, xml);