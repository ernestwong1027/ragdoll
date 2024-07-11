'use server'
import {writeFile, mkdir} from 'fs/promises';
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import {redirect} from "next/navigation";

interface File {
    name: string;
    arrayBuffer: () => Promise<ArrayBuffer>;
}

export async function uploadFiles(formData: FormData) {
    const files = [];
    const entries = Array.from(formData.entries()) as unknown as [string, File][];
    const uploadDir = '/app/data/uploads';
    for (const [key, value] of entries) {
        if (path.extname((value).name) === '.md'
        ) {
            files.push(value);
        }
    }
    try {
        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = await writeFileToLocal(buffer, file.name, uploadDir);
        }
        console.log(`Successfully saved ${files.length} files`)
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
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, fileBuffer);
    return randomUUID
}