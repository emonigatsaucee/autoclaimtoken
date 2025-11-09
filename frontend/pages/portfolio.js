import Head from 'next/head';

export default function Portfolio() {
  return (
    <>
      <Head>
        <title>Portfolio Dashboard - CryptoRecover</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Portfolio Dashboard</h1>
            <p className="text-gray-600 mb-8">Track your recovered assets and investment performance</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-2">Coming Soon</h3>
              <p className="text-blue-700">Portfolio tracking features will be available after wallet recovery.</p>
            </div>
            
            <a 
              href="/recovery-services"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold"
            >
              Start Recovery Process
            </a>
          </div>
        </div>
      </div>
    </>
  );
}