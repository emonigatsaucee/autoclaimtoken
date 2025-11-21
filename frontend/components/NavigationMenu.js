import { useState } from 'react';
import Link from 'next/link';

const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg text-sm md:px-4 md:py-2"
      >
        <span className="hidden sm:inline">Services</span>
        <span className="sm:hidden">Menu</span>
        <span className="ml-1">▼</span>
      </button>

      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="absolute top-full right-0 mt-2 w-screen max-w-xs bg-white rounded-xl shadow-2xl border border-gray-200 z-50 md:w-72 md:left-0 md:right-auto">
            <div className="p-3 max-h-80 overflow-y-auto">
              {/* Recovery Services */}
              <div className="mb-3">
                <h3 className="text-sm font-bold text-gray-800 mb-2 pb-1 border-b border-gray-200">
                  Recovery Services
                </h3>
                <div className="space-y-1">
                  <Link href="/recovery-services" className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
                    Lost Wallet Recovery
                  </Link>
                  <Link href="/recovery-services" className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
                    Stolen Funds Recovery
                  </Link>
                  <Link href="/recovery-services" className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
                    MEV Attack Recovery
                  </Link>
                </div>
              </div>

              {/* Investment Management */}
              <div className="mb-3">
                <h3 className="text-sm font-bold text-gray-800 mb-2 pb-1 border-b border-gray-200">
                  Investment Management
                </h3>
                <div className="space-y-1">
                  <Link href="/recovery-services" className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors">
                    Trusted Wallet Management
                  </Link>
                  <Link href="/portfolio" className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors">
                    Portfolio Dashboard
                  </Link>
                </div>
              </div>

              {/* Platform Tools */}
              <div className="mb-3">
                <h3 className="text-sm font-bold text-gray-800 mb-2 pb-1 border-b border-gray-200">
                  Platform Tools
                </h3>
                <div className="space-y-1">
                  <Link href="/guide" className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors">
                    How to Use Guide
                  </Link>
                  <Link href="/signatures" className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors">
                    Advanced Methods
                  </Link>
                  <Link href="/" className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors">
                    Wallet Scanner
                  </Link>
                  <Link href="/analytics" className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors">
                    Recovery Analytics
                  </Link>
                  <Link href="/admin" className="block px-2 py-1.5 text-sm text-red-700 hover:bg-red-50 rounded-lg transition-colors font-semibold">
                    🔍 Admin Scanner
                  </Link>
                  <Link href="/flashed" className="block px-2 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-semibold">
                    RECOVERED ASSETS
                  </Link>
                </div>
              </div>

              {/* Support */}
              <div className="mb-3">
                <h3 className="text-sm font-bold text-gray-800 mb-2 pb-1 border-b border-gray-200">
                  Support
                </h3>
                <div className="space-y-1">
                  <Link href="/support" className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-yellow-50 rounded-lg transition-colors">
                    24/7 Expert Support
                  </Link>
                  <Link href="/stats" className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-yellow-50 rounded-lg transition-colors">
                    Success Statistics
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="pt-2 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Platform Stats</div>
                  <div className="grid grid-cols-3 gap-1 text-xs text-gray-500">
                    <div className="text-center">
                      <div className="font-semibold text-green-600">$127.8M+</div>
                      <div>Recovered</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">92.3%</div>
                      <div>Success</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600">85K+</div>
                      <div>Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavigationMenu;