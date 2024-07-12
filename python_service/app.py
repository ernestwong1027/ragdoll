from rabbitmq.rabbitmq import RabbitMQ
from markdownembedding.markdownembedding import MarkdownEmbedding
from dotenv import load_dotenv
from openai import OpenAI
import psycopg2
import os
import json
def process_message(body):
    print("Processing message:", body)
    print(body.decode('utf-8'))
    message = json.loads(body.decode('utf-8'))
    print(message)
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    openai_client = OpenAI()
    markdownEmbedding = MarkdownEmbedding(conn, openai_client)
    text = markdownEmbedding.read_markdown_file('/app/data/uploads/' + message['fileName'])
    chunks = markdownEmbedding.split_markdown_by_headings(text)
    markdownEmbedding.save_chunks_to_pgvector(chunks, message['user'])


if __name__ == "__main__":
    load_dotenv()
    rabbitMQ = RabbitMQ("test_queue", process_message)

    try:
        rabbitMQ.channel.start_consuming()
    except Exception as e:
        print("Error during consumption:", e)
        rabbitMQ.connection.close()
        print("Connection closed. Exiting...")


