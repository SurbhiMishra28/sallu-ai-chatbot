
/**
 * embeddingService: creates embeddings and (optionally) queries a vector DB.
 * For MVP this can store embeddings in Mongo or call an external vector DB.
 * Below is a minimal placeholder that uses OpenAI embeddings only.
 */
const openai = require('./openaiClient');

async function getEmbedding(text){
  const resp = await openai.createEmbedding(text);
  // returns the vector array
  return resp.data[0].embedding;
}

async function queryVectorDB(embedding, opts={ topK:5 }){
  // Placeholder: in production you'd call Pinecone/Milvus/RedisVector here.
  // For now return empty array
  return [];
}

module.exports = { getEmbedding, queryVectorDB };
