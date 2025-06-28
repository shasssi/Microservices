const RabbitMQ = require("./index");

const directExchange = async () => {
  const rabbitmq = new RabbitMQ();

  const exchange_name = "mail_exchange";
  const routing_key = "mail_send";
  const queue_name = "mail_queue";
  const message = {
    to: "asd@gnail.com",
    from: "xyz@gmail.com",
    subject: "order confirmation",
    body: "order confrimed, order id: 10234567",
  };

  await rabbitmq.connect();
  await rabbitmq.createExchange(exchange_name);
  await rabbitmq.createQueue(queue_name);

  await rabbitmq.connectToQueue(queue_name, exchange_name, routing_key);
  await rabbitmq.publishMessage(exchange_name, routing_key, message);

  console.log("message published to queue");

  setTimeout(() => {
    rabbitmq.close();
  }, 500);
};

const directExchangeMultipleQueues = async () => {
  const rabbitmq = new RabbitMQ();

  const exchange_name = "mail_exchange";

  const routing_key_subscribed_user = "subscribed_user_mail_send";
  const routing_key_normal_user = "normal_user_mail_send";

  const queue_subcribed_user = "subscribed_user_mail_queue";
  const queue_normal_user = "normal_user_mail_queue";

  const message = {
    to: "asd@gnail.com",
    from: "xyz@gmail.com",
    subject: "order confirmation",
    body: "order confrimed, order id: 10234567",
  };

  const message1 = {
    to: "normal@gnail.com",
    from: "xyz@gmail.com",
    subject: "order confirmation",
    body: "order confrimed, order id: 10234567",
  };

  await rabbitmq.connect();
  await rabbitmq.createExchange(exchange_name);

  await rabbitmq.createQueue(queue_subcribed_user);
  await rabbitmq.createQueue(queue_normal_user);

  await rabbitmq.connectToQueue(
    queue_subcribed_user,
    exchange_name,
    routing_key_subscribed_user
  );
  await rabbitmq.connectToQueue(
    queue_normal_user,
    exchange_name,
    routing_key_normal_user
  );

  await rabbitmq.publishMessage(
    exchange_name,
    routing_key_subscribed_user,
    message
  );
  await rabbitmq.publishMessage(
    exchange_name,
    routing_key_normal_user,
    message1
  );

  console.log("message published to queue");

  setTimeout(() => {
    rabbitmq.close();
  }, 500);
};

const topicExchange = async () => {
  const exchange_name = "post_notification";

  const rabbitmq = new RabbitMQ();
  await rabbitmq.connect();

  await rabbitmq.createExchange(exchange_name, "topic", { durable: true });

  await rabbitmq.publishMessage(exchange_name, "post.created", {
    postId: "12235",
    userId: "12345",
    createdAt: "",
  });

  console.log("message published to queue");

  setTimeout(() => {
    rabbitmq.close();
  }, 500);
};

const fanoutExchange = async () => {
  const exchange_name = "new_product_launch";

  const rabbitmq = new RabbitMQ();
  await rabbitmq.connect();

  await rabbitmq.createExchange(exchange_name, "fanout", { durable: true });

  await rabbitmq.publishMessage(exchange_name, "", {
    name: "Iphone 22",
  });

  console.log("message published to queue");

  setTimeout(() => {
    rabbitmq.close();
  }, 500);
};

// directExchange();
// directExchangeMultipleQueues();
// topicExchange();
// fanoutExchange();