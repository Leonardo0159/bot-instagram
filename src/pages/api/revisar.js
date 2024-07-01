const openai = require('../../config/openai');

export default async function handler(req, res) {
  const { promptRevisar, content } = req.body;

  console.log('Requisição recebida com o conteúdo:', content);

  const promptSystem = `Você é um assistente de revisão de texto. Sua tarefa é revisar o conteúdo abaixo para garantir que ele esteja correto gramaticalmente, coeso e bem formatado para publicação no Instagram. Corrija quaisquer erros e melhore a clareza e a fluidez do texto. Adicione emoticons e hashtags relevantes para aumentar o engajamento. Garanta que o texto esteja formatado corretamente com quebras de linha onde necessário. Certifique-se de que o texto final não exceda 2200 caracteres e faça adaptações necessárias para que o texto permaneça completo e coerente. Além disso, remova todos os asteriscos do texto.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: promptSystem },
        { role: 'user', content: `${promptRevisar}\n\n${content}` }
      ],
    });

    let message = response.choices[0].message.content;
    console.log('Texto inicial:', message);

    // Ensure the content is within the 2200 character limit and remove all asterisks
    message = message.replace(/\*/g, '');
    if (message.length > 2200) {
      const adjustedPrompt = `O texto a seguir excede 2100 caracteres. Adapte o conteúdo para que ele não exceda 2100 caracteres, mantendo a coerência e a clareza, e remova todos os asteriscos: \n\n${message}`;
      const adjustedResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: promptSystem },
          { role: 'user', content: adjustedPrompt }
        ],
      });
      message = adjustedResponse.choices[0].message.content.replace(/\*/g, '');
    }

    console.log('Texto ajustado:', message);
    res.status(200).json({ content: message });

  } catch (error) {
    console.error('Error in /api/revisar:', error);
    res.status(500).json({ error: error.message });
  }
}
