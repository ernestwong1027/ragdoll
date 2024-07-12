import OpenAI from "openai";
import dotenv from 'dotenv';
import { Pool } from 'pg';
const openai = new OpenAI();
dotenv.config();
export async function addContextUsingRag(content: string, uid: string): Promise<string> {
    const embedding = await getEmbedding(content);
    console.log(embedding)
    console.log(uid)

    const results = await searchDatabase(embedding, uid);
    console.log(results)
    return generatePrompt(content, results);
}

async function getEmbedding(content: string): Promise<Number[]> {
    const embedding =  await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: content,
        encoding_format: "float",
    });
    return embedding.data[0].embedding

}

async function searchDatabase(embedding: Number[], uid: string): Promise<string[]> {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const client = await pool.connect();

    try {
        const query = `
      SELECT content
      FROM markdown_chunks
      WHERE uid = $1
      ORDER BY embedding <-> $2
      LIMIT 5;
    `;
        const embeddingString = `[${embedding.join(',')}]`;
        const res = await client.query(query, [uid,embeddingString]);

        // Map the result rows to extract only the content field
        const contents = res.rows.map(row => row.content) as string[];

        return contents;
    } catch (err) {
        console.error('Error executing query', err);
        throw err;
    } finally {
        client.release();
    }
};

function generatePrompt(content: string, results: string[]): string {
    const prompt = {
        prompt: content,
        documentation: results.join('\n\n')
    };
    return JSON.stringify(prompt);
}


