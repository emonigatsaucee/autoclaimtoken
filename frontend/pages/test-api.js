import { useState, useEffect } from 'react';

export default function TestAPI() {
  const [status, setStatus] = useState('Testing...');
  const [results, setResults] = useState({});

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log('API URL:', apiUrl);
    
    try {
      // Test health endpoint
      const response = await fetch(`${apiUrl}/api/health`);
      const data = await response.json();
      
      setResults({
        apiUrl,
        status: response.status,
        data,
        timestamp: new Date().toISOString()
      });
      
      setStatus(response.ok ? '✅ Connected' : '❌ Failed');
    } catch (error) {
      setStatus('❌ Error: ' + error.message);
      setResults({ error: error.message });
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <div className="text-lg font-semibold">{status}</div>
      </div>
      
      <div className="bg-white p-4 rounded border">
        <h2 className="font-bold mb-2">Results:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
      
      <button 
        onClick={testAPI}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Again
      </button>
    </div>
  );
}