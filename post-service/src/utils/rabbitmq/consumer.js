const RabbitMQ = require("./index");

const consumeMsgFromDiectExchange = async (queue_name) => {
  const rabbitmq = new RabbitMQ();
  const channel = await rabbitmq.connect();

  await rabbitmq.consumeMessage(queue_name, (msg) => {
    if (msg) {
      console.log(queue_name);
      console.log(JSON.parse(msg.content));
      channel.ack(msg);
    }
  });
};

// consumeMsgFromDiectExchange("mail_queue");
// consumeMsgFromDiectExchange("subscribed_user_mail_queue");
// consumeMsgFromDiectExchange("normal_user_mail_queue");

const consumeMsgFromTopicExchange = async (
  queue_name,
  exchange_name,
  routing_key
) => {
  const rabbitmq = new RabbitMQ();
  const channel = await rabbitmq.connect();

  await rabbitmq.createQueue(queue_name, { durable: true });
  await rabbitmq.connectToQueue(queue_name, exchange_name, routing_key);

  await rabbitmq.consumeMessage(queue_name, (msg) => {
    if (msg) {
      console.log(queue_name);
      console.log(JSON.parse(msg.content));
      channel.ack(msg);
    }
  });
};

// consumeMsgFromTopicExchange("post_queue", "post_notification", "post.*");

const fanoutConsumer = async (exchange_name) => {
  const rabbitmq = new RabbitMQ();
  const channel = await rabbitmq.connect();

  const queue = await rabbitmq.createQueue("", { exclusive: true });
  await rabbitmq.connectToQueue(queue.queue, exchange_name, "");

  await rabbitmq.consumeMessage(queue.queue, (msg) => {
    console.log(queue.queue);
    console.log(JSON.parse(msg.content));
    channel.ack(msg);
  });
};

// fanoutConsumer("new_product_launch");
