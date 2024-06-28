const openai = require('../../config/openai');

export default async function handler(req, res) {
  const { promptPesquisar } = req.body;

  console.log('Requisição recebida com o prompt de pesquisa:', promptPesquisar);

  const promptSystem = `Você é um assistente de pesquisa. Sua tarefa é encontrar e fornecer informações detalhadas e atualizadas sobre o seguinte tópico: ${promptPesquisar}. Por favor, forneça uma descrição abrangente que inclua definições, contextos históricos, desenvolvimentos recentes e qualquer outra informação relevante.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: promptSystem },
        { role: 'user', content: `Por favor, pesquise e forneça informações detalhadas sobre ${promptPesquisar}.` }
      ]
    });

    const message = response.choices[0].message.content;
    console.log(message);
    res.status(200).json({ content: message });

  } catch (error) {
    console.error('Error in /api/pesquisar:', error);
    res.status(500).json({ error: error.message });
  }
}
