import Head from 'next/head';

export default function Support() {
  return (
    <>
      <Head>
        <title>24/7 Support - CryptoRecover</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-3xl font-black text-gray-900 mb-4">24/7 Expert Support</h1>
            <p className="text-gray-600 mb-8">Professional assistance for all recovery services</p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-bold text-yellow-800 mb-2">Expert Support Team</h3>
              <p className="text-yellow-700">Our recovery specialists are available around the clock to assist you.</p>
            </div>
            
            <a 
              href="/recovery-services"
              className="inline-block mt-6 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-bold"
            >
              Get Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
}