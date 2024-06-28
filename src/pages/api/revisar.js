const openai = require('../../config/openai');

export default async function handler(req, res) {
  const { promptRevisar, content } = req.body;

  console.log('Requisição recebida com o conteúdo:', content);

  const promptSystem = `Você é um assistente de revisão de texto. Sua tarefa é revisar o conteúdo abaixo para garantir que ele esteja correto gramaticalmente, coeso e bem formatado para publicação no Instagram. Corrija quaisquer erros e melhore a clareza e a fluidez do texto. Adicione emoticons e hashtags relevantes para aumentar o engajamento. Garanta que o texto esteja formatado corretamente com quebras de linha onde necessário.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: promptSystem },
        { role: 'user', content: `${promptRevisar}\n\n${content}` }
      ],
    });

    const message = response.choices[0].message.content;
    console.log(message);
    res.status(200).json({ content: message });

  } catch (error) {
    console.error('Error in /api/revisar:', error);
    res.status(500).json({ error: error.message });
  }
}
