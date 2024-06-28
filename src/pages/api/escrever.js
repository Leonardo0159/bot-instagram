const openai = require('../../config/openai');

export default async function handler(req, res) {
  const { promptEscrever, research } = req.body;

  console.log('Requisição recebida com o prompt de escrita:', promptEscrever);

  const promptSystem = `Você está escrevendo um artigo detalhado sobre o tema: ${promptEscrever}. 
  Use a seguinte pesquisa como base para o artigo:
  ${research}

  Seu objetivo é criar um conteúdo informativo e envolvente que ajude o público a se informar sobre esse tema. Siga as instruções abaixo para criar um conteúdo completo:

  Título: Crie um título chamativo e informativo sobre ${promptEscrever}.
  Introdução: Escreva uma introdução cativante que explique a importância do tema.
  Desenvolvimento: Descreva os aspectos mais importantes de ${promptEscrever}, como funciona, e por que é relevante atualmente. Inclua vantagens, desafios e previsões futuras.
  Conclusão: Faça um resumo final destacando os pontos principais e a importância contínua do tema.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: promptSystem },
        { role: 'user', content: `Escreva um artigo detalhado sobre ${promptEscrever}.` }
      ]
    });

    const message = response.choices[0].message.content;
    console.log(message);
    res.status(200).json({ content: message });

  } catch (error) {
    console.error('Error in /api/escrever:', error);
    res.status(500).json({ error: error.message });
  }
}
