import Head from 'next/head';

export default function Analytics() {
  return (
    <>
      <Head>
        <title>Recovery Analytics - CryptoRecover</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Recovery Analytics</h1>
            <p className="text-gray-600 mb-8">Advanced blockchain analysis and recovery insights</p>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="font-bold text-purple-800 mb-2">Professional Analytics</h3>
              <p className="text-purple-700">Detailed recovery analytics available for active cases.</p>
            </div>
            
            <a 
              href="/recovery-services"
              className="inline-block mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-bold"
            >
              Start Recovery
            </a>
          </div>
        </div>
      </div>
    </>
  );
}