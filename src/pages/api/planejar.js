const openai = require('../../config/openai');

export default async function handler(req, res) {
  const { topic } = req.body;

  console.log('Requisição recebida com o tópico:', topic);

  const promptSystem = `Você está trabalhando no planejamento de um post para o Instagram sobre o tema: ${topic}.
  Seu objetivo é criar conteúdo informativo e envolvente que ajude o público a se informar sobre esse tema.
  Crie prompts coesos para as seguintes etapas e responda em formato JSON:

  {
    "promptPesquisar": "prompt para pesquisa",
    "promptEscrever": "prompt para escrita",
    "promptImage": "prompt para imagem",
    "promptRevisar": "prompt para revisão"
  }`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: promptSystem },
        { role: 'user', content: `Planeje conteúdo envolvente para Instagram sobre ${topic}` }
      ],
    });

    const message = response.choices[0].message.content;
    console.log('Prompts gerados:', message);

    const prompts = JSON.parse(message);
    res.status(200).json(prompts);

  } catch (error) {
    console.error('Error in /api/planejar:', error);
    res.status(500).json({ error: error.message });
  }
}
