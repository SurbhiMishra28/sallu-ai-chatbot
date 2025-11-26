
/**
 * Minimal wrapper for OpenAI HTTP API using node-fetch.
 * Replace or extend with official OpenAI SDK as needed.
 */
const fetch = require('node-fetch');
const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function chatCompletion(messages, max_tokens=500){
  if(!OPENAI_KEY) throw new Error('OPENAI_API_KEY not set');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // change as desired
      messages,
      max_tokens
    })
  });
  if(!res.ok){
    const txt = await res.text();
    throw new Error('OpenAI error: ' + txt);
  }
  const data = await res.json();
  return data;
}

async function createEmbedding(input){
  if(!OPENAI_KEY) throw new Error('OPENAI_API_KEY not set');
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'text-embedding-3-large',
      input
    })
  });
  if(!res.ok){
    const txt = await res.text();
    throw new Error('OpenAI embedding error: ' + txt);
  }
  const data = await res.json();
  return data;
}

module.exports = { chatCompletion, createEmbedding };
