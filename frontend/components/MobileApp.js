import { useState, useEffect } from 'react';
import { Smartphone, Download, Apple, Play } from 'lucide-react';

export default function MobileApp() {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);
    setIsAndroid(/android/i.test(userAgent));
  }, []);

  const downloadApp = (platform) => {
    if (platform === 'ios') {
      // Redirect to App Store or show PWA install
      window.location.href = 'https://apps.apple.com/app/cryptorecover';
    } else if (platform === 'android') {
      // Redirect to Play Store or show PWA install
      window.location.href = 'https://play.google.com/store/apps/details?id=com.cryptorecover';
    }
  };

  const installPWA = () => {
    // Progressive Web App installation
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
    
    // Show install prompt
    alert('Add CryptoRecover to your home screen for the best mobile experience!');
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Smartphone className="w-8 h-8" />
        <div>
          <h3 className="text-xl font-bold">📱 CryptoRecover Mobile App</h3>
          <p className="text-blue-100">Access your crypto recovery tools anywhere</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
          <h4 className="font-bold mb-2">🚀 Mobile Features</h4>
          <ul className="text-sm space-y-1 text-blue-100">
            <li>• Instant wallet scanning</li>
            <li>• Push notifications for recoveries</li>
            <li>• Biometric security</li>
            <li>• Offline phrase recovery</li>
            <li>• Real-time portfolio tracking</li>
          </ul>
        </div>

        <div className="space-y-3">
          {isIOS && (
            <button
              onClick={() => downloadApp('ios')}
              className="w-full bg-black text-white py-3 px-4 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition"
            >
              <Apple className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="font-bold">App Store</div>
              </div>
            </button>
          )}

          {isAndroid && (
            <button
              onClick={() => downloadApp('android')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg flex items-center gap-3 hover:bg-green-700 transition"
            >
              <Play className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="font-bold">Google Play</div>
              </div>
            </button>
          )}

          <button
            onClick={installPWA}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg flex items-center gap-3 hover:bg-purple-700 transition"
          >
            <Download className="w-6 h-6" />
            <div className="text-left">
              <div className="text-xs">Install as</div>
              <div className="font-bold">Web App</div>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-4 text-center text-blue-100 text-sm">
        <p>🔒 Secure • 🚀 Fast • 💰 Profitable</p>
      </div>
    </div>
  );
}