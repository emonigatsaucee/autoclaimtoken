// Mobile detection and wallet deep linking
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getWalletDeepLinks = (url) => {
  const encodedUrl = encodeURIComponent(url);
  
  return {
    metamask: `https://metamask.app.link/dapp/${url.replace('https://', '')}`,
    trustwallet: `https://link.trustwallet.com/open_url?coin_id=60&url=${encodedUrl}`,
    coinbase: `https://go.cb-w.com/dapp?cb_url=${encodedUrl}`,
    rainbow: `https://rnbwapp.com/dapp/${url.replace('https://', '')}`,
    imtoken: `imtokenv2://navigate/DappView?url=${encodedUrl}`,
    tokenpocket: `tpoutside://open?param=${encodedUrl}`,
    mathwallet: `mathwallet://dapp?url=${encodedUrl}`,
    safepal: `safepal-wallet://dapp?url=${encodedUrl}`
  };
};

export const detectMobileWallet = () => {
  const ua = navigator.userAgent;
  
  if (ua.includes('TokenPocket')) return 'TokenPocket';
  if (ua.includes('imToken')) return 'imToken';
  if (ua.includes('Trust')) return 'Trust Wallet';
  if (ua.includes('SafePal')) return 'SafePal';
  if (ua.includes('MathWallet')) return 'MathWallet';
  if (window.ethereum?.isMetaMask) return 'MetaMask';
  if (window.ethereum?.isCoinbaseWallet) return 'Coinbase Wallet';
  
  return null;
};