
/**
 * aiService.evaluateAnswer
 * - builds a prompt using question + canonical answer + optional retrieved context
 * - calls the LLM (via openaiClient.chatCompletion)
 * - parses and returns structured evaluation
 *
 * NOTE: LLM output parsing should be hardened in production.
 */
const openai = require('./openaiClient');
const embeddingService = require('./embeddingService');

function buildPrompt({ question, canonical, context, student }){
  const system = "You are an expert tutor. Grade the student's answer and provide JSON with: score (0-100), feedback (array of bullets), hint (short), next (one-line recommended topic).";
  const user = `Question: ${question.prompt}\nCanonical answer: ${canonical || 'N/A'}\nContext: ${context || 'N/A'}\nStudent answer: ${student}`;
  return [{ role: 'system', content: system }, { role: 'user', content: user }];
}

async function evaluateAnswer({ question, responseText, userId }){
  // 1. optional retrieval
  let retrieved = [];
  try{
    const qemb = await embeddingService.getEmbedding(question.prompt);
    retrieved = await embeddingService.queryVectorDB(qemb, { topK: 5 });
  }catch(e){
    // continue even if embeddings fail in dev
    console.warn('embedding error', e.message);
  }

  // 2. build prompt and call LLM
  const prompt = buildPrompt({ question, canonical: question.answerKey, context: JSON.stringify(retrieved).slice(0,2000), student: responseText });
  const resp = await openai.chatCompletion(prompt, 700);
  // resp parsing (very naive)
  const text = resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content;
  // Try to find JSON in the response
  try{
    const start = text.indexOf('{');
    const jsonText = text.slice(start);
    const parsed = JSON.parse(jsonText);
    return parsed;
  }catch(e){
    // fallback: return raw text in aiEvaluation.raw
    return { raw: text };
  }
}

module.exports = { evaluateAnswer };
