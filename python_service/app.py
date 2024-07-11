import pika
import signal
import sys

def process_message(body):
    print("Processing message:", body)

def callback(ch, method, properties, body):
    try:
        process_message(body)
        ch.basic_ack(delivery_tag=method.delivery_tag)
        print("Message acknowledged")
    except Exception as e:
        print("Error processing message:", e)
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)

def signal_handler(sig, frame):
    print("Received signal to stop consuming. Closing connection...")
    channel.stop_consuming()
    connection.close()
    print("Connection closed. Exiting...")
    sys.exit(0)

if __name__ == "__main__":
    connection = pika.BlockingConnection(pika.URLParameters('amqp://rabbitmq:5672'))
    channel = connection.channel()

    queue_name = 'test_queue'
    channel.queue_declare(queue=queue_name, durable=True)  # Ensure the queue exists and is durable
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=queue_name, on_message_callback=callback)

    signal.signal(signal.SIGINT, signal_handler)
    print(f"[*] Waiting for messages in {queue_name}. To exit press CTRL+C")

    try:
        channel.start_consuming()
    except Exception as e:
        print("Error during consumption:", e)
        connection.close()
