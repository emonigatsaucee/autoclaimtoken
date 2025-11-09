import { useState } from 'react';
import Head from 'next/head';
import LostWalletRecovery from '../components/LostWalletRecovery';
import StolenFundsRecovery from '../components/StolenFundsRecovery';
import MEVAttackRecovery from '../components/MEVAttackRecovery';

export default function RecoveryServices() {
  const [activeService, setActiveService] = useState('lost-wallet');

  const services = [
    {
      id: 'lost-wallet',
      name: 'Lost Wallet Recovery',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/shield.svg',
      component: LostWalletRecovery,
      description: 'Seed phrase reconstruction and wallet recovery',
      successRate: '73%',
      fee: '25%'
    },
    {
      id: 'stolen-funds',
      name: 'Stolen Funds Recovery',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/security.svg',
      component: StolenFundsRecovery,
      description: 'Blockchain forensics and fund tracking',
      successRate: '67%',
      fee: '30%'
    },
    {
      id: 'mev-recovery',
      name: 'MEV Attack Recovery',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/lightning.svg',
      component: MEVAttackRecovery,
      description: 'Counter MEV bots and sandwich attacks',
      successRate: '45%',
      fee: '35%'
    }
  ];

  const ActiveComponent = services.find(s => s.id === activeService)?.component;

  return (
    <>
      <Head>
        <title>Recovery Services - CryptoRecover</title>
        <meta name="description" content="Professional cryptocurrency recovery services" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/shield.svg" alt="CryptoRecover" className="w-6 h-6 invert" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900">CryptoRecover</h1>
                  <p className="text-xs text-gray-500">Recovery Services</p>
                </div>
              </div>
              
              <a 
                href="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-bold text-sm"
              >
                Back to Main
              </a>
            </div>
            
            {/* Service Tabs */}
            <div className="flex space-x-1 pb-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setActiveService(service.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-bold transition-all ${
                    activeService === service.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <img src={service.icon} alt={service.name} className={`w-5 h-5 ${activeService === service.id ? 'invert' : ''}`} />
                  <div className="text-left">
                    <div className="text-sm">{service.name}</div>
                    <div className={`text-xs ${activeService === service.id ? 'text-blue-200' : 'text-gray-500'}`}>
                      {service.successRate} Success • {service.fee} Fee
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Service Component */}
        <div className="py-8">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </>
  );
}