import Head from 'next/head';

export default function Stats() {
  return (
    <>
      <Head>
        <title>Success Statistics - CryptoRecover</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-black text-gray-900 mb-8 text-center">Platform Statistics</h1>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-black text-green-600 mb-2">$127.8M+</div>
                <div className="text-green-700 font-medium">Total Recovered</div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-black text-blue-600 mb-2">94%</div>
                <div className="text-blue-700 font-medium">Success Rate</div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-black text-purple-600 mb-2">85,000+</div>
                <div className="text-purple-700 font-medium">Clients Served</div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-black text-orange-600 mb-2">24/7</div>
                <div className="text-orange-700 font-medium">Support</div>
              </div>
            </div>
            
            <div className="text-center">
              <a 
                href="/recovery-services"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-bold text-lg"
              >
                Start Your Recovery
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}