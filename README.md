# Ragdoll
Ragdoll is a code assistant that uses retrieval-augmented generation (RAG) to provide assistance on external code libraries. 
Simply upload the relevant documentation, and Ragdoll will leverage this context to provide accurate assistance on external code libraries in response to every prompt.
Ragdoll was built with Next.js, Python, RabbitMQ, PgVector, Docker, GPT-3.5 Turbo, Redis and AWS S3. See system diagram below for more information

# System Diagram
![system_diagram](https://github.com/user-attachments/assets/f971012c-c8fe-49bd-9776-2781f0933519)

# Demo
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/ys9GP1bdCcU/0.jpg)](https://www.youtube.com/watch?v=ys9GP1bdCcU)

# Installation
All the required technologies are managed using docker. Just create a .env file that follows the .env.example file and run
```
docker-compose up --build
```
