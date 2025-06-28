const amqp = require("amqplib");

class RabbitMQ {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    if (!this.connection) {
      console.log("creating rabbitmq connection");
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      return this.channel;
    }
  }

  async close() {
    this.connection.close();
  }

  async createExchange(
    exchange_name,
    type = "direct",
    options = { durable: false }
  ) {
    await this.channel.assertExchange(exchange_name, type, options);
  }

  async createQueue(queue_name, options = { durable: false }) {
    const queue = await this.channel.assertQueue(queue_name, options);
    return queue;
  }

  async connectToQueue(queue_name, exchange_name, routing_key) {
    await this.channel.bindQueue(queue_name, exchange_name, routing_key);
  }

  async publishMessage(exchange_name, routing_key, message) {
    this.channel.publish(
      exchange_name,
      routing_key,
      Buffer.from(JSON.stringify(message))
    );
  }

  async consumeMessage(queue_name, cb) {
    this.channel.consume(queue_name, cb);
  }
}

module.exports = RabbitMQ;
