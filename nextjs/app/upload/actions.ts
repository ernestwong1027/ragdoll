'use server'
import {writeFile, mkdir} from 'fs/promises';
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import {redirect} from "next/navigation";
import amqp from 'amqplib';

interface File {
    name: string;
    arrayBuffer: () => Promise<ArrayBuffer>;
}

export async function uploadFiles(formData: FormData) {
    try {
        const uploadedFiles: string[] = [];
        const entries = Array.from(formData.entries()) as unknown as [string, File][];
        const uploadDir = '/app/data/uploads';

        for (const [key, value] of entries) {
            if (path.extname((value).name) === '.md') {
                const file = value
                const buffer = Buffer.from(await file.arrayBuffer());
                uploadedFiles.push(await writeFileToLocal(buffer, file.name, uploadDir));
            }
        }

        await addUploadsToMessageQueue(uploadedFiles);
        console.log(`Successfully saved files`)
    } catch (error) {
        console.error('Error saving files:', error);
    }
    redirect('/new')
}

async function writeFileToLocal(fileBuffer: Buffer,
                                originalFileName: string,
                                uploadDir: string) {
    const extension = path.extname(originalFileName);
    const randomUUID = uuidv4();
    const filePath = path.join(uploadDir, randomUUID + extension);
    await mkdir(uploadDir, {recursive: true});
    await writeFile(filePath, fileBuffer);
    return randomUUID+extension
}

async function addUploadsToMessageQueue(uploads: string[]) {
    const connection = await amqp.connect('amqp://rabbitmq:5672');
    const channel = await connection.createChannel();
    const queue = 'test_queue';
    console.log(uploads)
    await channel.assertQueue(queue, {
        durable: true
    });
    for(const upload of uploads){
        const message = {
            fileName: upload
        }
       channel.sendToQueue(queue, Buffer.from(message.toString()), {
            persistent: true
        });
        console.log("sent message")
    }
    setTimeout(() => {
        channel.close();
        connection.close();
    }, 500);
}



