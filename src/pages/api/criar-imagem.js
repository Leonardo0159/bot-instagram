const openai = require('../../config/openai');

export default async function handler(req, res) {
  const { promptImage } = req.body;

  console.log('Requisição recebida com o prompt de imagem:', promptImage);

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: promptImage,
      size: '1024x1792',
      quality: 'standard',
      n: 1,
    });

    const imageUrl = response.data[0].url;
    console.log('Imagem gerada:', imageUrl);
    res.status(200).json({ imageUrl });

  } catch (error) {
    console.error('Error in /api/criar-imagem:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.message });
  }
}
