import pika
import signal
import sys

class RabbitMQ:
    def __init__(self,queue_name, callback_function):
        self.connection = pika.BlockingConnection(pika.URLParameters('amqp://rabbitmq:5672'))
        self.channel = self.connection.channel()
        self.callback_function = callback_function

        self.channel.queue_declare(queue=queue_name, durable=True)
        self.channel.basic_qos(prefetch_count=1)
        self.channel.basic_consume(queue=queue_name, on_message_callback=self.callback)
        signal.signal(signal.SIGINT, self.signal_handler)
        print(f"[*] Waiting for messages in {queue_name}. To exit press CTRL+C")

    def callback(self, ch, method, properties, body):
        try:
            self.callback_function(body)
            ch.basic_ack(delivery_tag=method.delivery_tag)
            print("Message acknowledged")
        except Exception as e:
            print("Error processing message:", e)
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)

    def signal_handler(self, sig, frame):
        print("Received signal to stop consuming. Closing connection...")
        self.channel.stop_consuming()
        self.connection.close()
        print("Connection closed. Exiting...")
        sys.exit(0)

