import markdown
import re

class MarkdownEmbedding:
    def __init__(self, db_conn, openai_client, chunk_size=1000):
        self.db_conn = db_conn
        self.chunk_size = chunk_size
        self.openai_client = openai_client

    def read_markdown_file(self, file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()

    def split_markdown_by_headings(self, markdown_text):
        sections = re.split(r'(^#+ .*$)', markdown_text, flags=re.MULTILINE)
        chunks = []
        current_heading = ''
        current_content = ''
        for section in sections:
            if re.match(r'^#+ .+$', section):
                if current_content:
                    chunks.append((current_heading, current_content.strip()))
                current_heading = section.strip()
                current_content = ''
            else:
                current_content += section
        if current_content:
            chunks.append((current_heading, current_content.strip()))
        return chunks

    def split_chunk_by_size(self, heading, content):
        words = content.split()
        chunks = []
        current_chunk = [heading]
        for word in words:
            current_chunk.append(word)
            if len(current_chunk) >= self.chunk_size:
                chunks.append(" ".join(current_chunk))
                current_chunk = [heading]
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        return chunks

    def get_embedding(self, text):
        response = self.openai_client.embeddings.create(input=[text], model="text-embedding-3-small")
        return response.data[0].embedding

    def save_chunks_to_pgvector(self, chunks, user):
        with self.db_conn.cursor() as cur:
            for i, (heading, content) in enumerate(chunks):
                sub_chunks = self.split_chunk_by_size(heading, content)
                for j, sub_chunk in enumerate(sub_chunks):
                    embedding = self.get_embedding(sub_chunk)
                    metadata = {
                        'heading': heading,
                        'content': sub_chunk,
                        'start_pos': i * self.chunk_size + j * len(sub_chunk),
                        'end_pos': i * self.chunk_size + (j + 1) * len(sub_chunk)
                    }
                    cur.execute(
                        "INSERT INTO markdown_chunks (heading, content, start_pos, end_pos, embedding, uid) VALUES (%s, %s, %s, %s, %s, %s)",
                        (heading, sub_chunk, metadata['start_pos'], metadata['end_pos'], embedding, user)
                    )
            self.db_conn.commit()