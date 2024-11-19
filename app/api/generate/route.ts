import axios from 'axios';

const COHERE_API_KEY = 'EqO0kmTNSy7Vg34MV8plJaBlhxXJHVwh8ZzkGVjg';  // Replace with your actual API key
const COHERE_API_URL = 'https://api.cohere.ai/v1/generate';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.prompt || typeof body.prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid prompt string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await axios.post(
      COHERE_API_URL,
      {
        prompt: body.prompt,
        max_tokens: 150,
        temperature: 0.7,
        stop_sequences: ['\n'],
      },
      {
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response.data.generations)
    
    // Extract generated text from response and return it
    const generatedText = response.data.generations[0].text.trim();
    return new Response(
      JSON.stringify({ text: generatedText }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error from Cohere:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate text', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
