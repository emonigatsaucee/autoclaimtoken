import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error) {
    // Don't catch errors related to wallet interactions - let them pass through
    if (error.message && (
      error.message.includes('wallet') ||
      error.message.includes('ethereum') ||
      error.message.includes('send') ||
      error.message.includes('transaction')
    )) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Don't interfere with wallet/send functionality
    if (error.message && (
      error.message.includes('wallet') ||
      error.message.includes('ethereum') ||
      error.message.includes('send') ||
      error.message.includes('transaction')
    )) {
      this.setState({ hasError: false, error: null });
      return;
    }
    
    // Auto-retry once after 1 second for other errors
    if (this.state.retryCount === 0) {
      setTimeout(() => {
        this.setState({ hasError: false, error: null, retryCount: 1 });
      }, 1000);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, retryCount: this.state.retryCount + 1 });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full text-center">
            <div className="text-orange-400 text-4xl mb-4">🔄</div>
            <h2 className="text-white text-lg font-semibold mb-2">Loading MetaMask...</h2>
            <p className="text-gray-300 text-sm mb-4">
              {this.state.retryCount === 0 ? 
                'Initializing wallet connection...' : 
                'Having trouble connecting? Try refreshing the page.'
              }
            </p>
            {this.state.retryCount > 0 && (
              <div className="space-y-2">
                <button 
                  onClick={this.handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white mb-2"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white text-sm"
                >
                  Refresh Page
                </button>
              </div>
            )}
            {this.state.retryCount === 0 && (
              <div className="text-gray-400 text-xs">
                Auto-retrying in 2 seconds...
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;