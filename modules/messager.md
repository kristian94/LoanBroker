# Messager

usage:

``const messager = require('[path-to-messager.js]')``
 
## publisher

used to publish messages to the server

``const publisher = new messager.Publisher(url)``

``url`` is the rabbitMQ server url

available options for publisher:

- ``queue: string`` 
- ``exchange: string``




#### functions

###### send(data, options)

publishes the message (data) to a queue or exchange, depening on the options:

- ``type: string``
- ``type: string``
- ``routingKey: string``




#### consumer

used to consume messages

``const consumer = new messager.Consumer(url, options)``

available options for consumer:

- ``queue: string`` 
- ``exchange: string``
- ``bindingKeys: array``

