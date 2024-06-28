import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [generateImage, setGenerateImage] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);
    setResult(null);

    try {
      setProgress(10);
      const planRes = await axios.post('/api/planejar', { topic });
      const { promptPesquisar, promptEscrever, promptImage, promptRevisar } = planRes.data;

      setProgress(30);
      const researchRes = await axios.post('/api/pesquisar', { promptPesquisar });

      setProgress(50);
      const writeRes = await axios.post('/api/escrever', { promptEscrever, research: researchRes.data.content });

      let imageRes = null;
      if (generateImage) {
        setProgress(70);
        imageRes = await axios.post('/api/criar-imagem', { promptImage });
      }

      setProgress(90);
      const reviewRes = await axios.post('/api/revisar', { promptRevisar, content: writeRes.data.content });

      setResult({
        post: reviewRes.data.content,
        image: imageRes ? imageRes.data.imageUrl : null,
      });

      setProgress(100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl text-black font-bold mb-6 text-center">Gerador de Postagens para Instagram</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Tópico
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="block w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              placeholder="Digite o tópico aqui..."
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="generateImage"
              checked={generateImage}
              onChange={(e) => setGenerateImage(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="generateImage" className="ml-2 block text-sm font-medium text-gray-700">
              Gerar Imagem
            </label>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Gerar Postagens'}
          </button>
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
              <div
                className="bg-indigo-600 h-full"
                style={{ width: `${progress}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center text-black text-sm font-medium">{`${progress}%`}</span>
            </div>
          )}
        </form>
        {result && (
          <div className="mt-6">
            <h2 className="text-xl text-black font-bold mb-4">Resultados</h2>
            {result.image && <img src={result.image} alt="Imagem do post" className="mt-4 rounded-md shadow-md w-full" />}
            <p className="bg-gray-100 text-black p-4 rounded-md whitespace-pre-line">{result.post}</p>
          </div>
        )}
      </div>
    </div>
  );
}
