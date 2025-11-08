import { useState } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { apiService } from '../utils/api';
import { formatAmount } from '../utils/web3Config';

export default function RecoveryAnalyzer({ walletAddress, onAnalysisComplete }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleAnalyze = async () => {
    if (!walletAddress) return;
    
    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);
    
    try {
      const result = await apiService.analyzeRecovery(walletAddress);
      
      if (result.success) {
        setAnalysis(result.analysis);
        onAnalysisComplete?.(result.analysis);
      } else {
        setError('Failed to analyze recovery potential');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 0.7) return 'text-green-600 bg-green-50';
    if (probability >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'direct_claim':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'contract_interaction':
        return <TrendingUp size={16} className="text-blue-500" />;
      case 'multicall_batch':
        return <Clock size={16} className="text-purple-500" />;
      default:
        return <AlertTriangle size={16} className="text-yellow-500" />;
    }
  };

  const renderOpportunity = (opportunity, index) => (
    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getMethodIcon(opportunity.method)}
          <div>
            <div className="font-medium capitalize">
              {opportunity.type?.replace('_', ' ') || 'Recovery Opportunity'}
            </div>
            <div className="text-sm text-gray-600">
              {opportunity.protocol && `${opportunity.protocol} • `}
              Method: {opportunity.method?.replace('_', ' ')}
            </div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(opportunity.probability)}`}>
          {Math.round(opportunity.probability * 100)}% Success
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Estimated Value:</span>
          <div className="font-medium">{formatAmount(opportunity.estimatedValue)} ETH</div>
        </div>
        <div>
          <span className="text-gray-600">Gas Estimate:</span>
          <div className="font-medium">{opportunity.gasEstimate?.toLocaleString()} gas</div>
        </div>
      </div>
      
      {opportunity.requirements && opportunity.requirements.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-600 mb-1">Requirements:</div>
          <div className="flex flex-wrap gap-1">
            {opportunity.requirements.map((req, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {req.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const handleExecuteRecovery = async () => {
    if (!analysis || !walletAddress) return;
    
    setIsExecuting(true);
    try {
      // Execute recovery for high probability opportunities
      const highProbOpportunities = analysis.details.highProbability;
      
      if (highProbOpportunities.length === 0) {
        alert('No high probability recovery opportunities available.');
        return;
      }

      const recoveryPromises = highProbOpportunities.map(async (opportunity) => {
        const job = await apiService.createRecoveryJob({
          walletAddress,
          tokenAddress: opportunity.contractAddress || '0x0000000000000000000000000000000000000000',
          tokenSymbol: opportunity.protocol || 'UNKNOWN',
          estimatedAmount: opportunity.estimatedValue,
          recoveryMethod: opportunity.method
        });
        
        if (job.success) {
          return await apiService.executeRecovery(job.job.id, 'user-signature');
        }
        return null;
      });

      const results = await Promise.all(recoveryPromises);
      const successfulRecoveries = results.filter(r => r && r.success);
      
      if (successfulRecoveries.length > 0) {
        const totalRecovered = successfulRecoveries.reduce((sum, r) => sum + parseFloat(r.result.actualAmount || 0), 0);
        alert(`Recovery Successful!\n\nRecovered: ${totalRecovered.toFixed(4)} ETH\nTransactions: ${successfulRecoveries.length}\nNet Amount (after 15% fee): ${(totalRecovered * 0.85).toFixed(4)} ETH`);
      } else {
        alert('Recovery failed. No funds were recovered. You will not be charged any fees.');
      }
      
    } catch (err) {
      console.error('Recovery execution error:', err);
      setError('Recovery execution failed. Please try again.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleGetQuote = () => {
    if (!analysis) return;
    
    const quote = `Recovery Quote:\n\nTotal Recoverable: ${analysis.totalRecoverable} ETH\nEstimated Fee (15%): ${analysis.estimatedFees} ETH\nNet Recovery: ${analysis.netRecovery} ETH\n\nHigh Probability: ${analysis.opportunities.high} opportunities\nMedium Probability: ${analysis.opportunities.medium} opportunities\nLow Probability: ${analysis.opportunities.low} opportunities\n\nNote: You only pay fees if recovery is successful.`;
    
    alert(quote);
  };

  return (
    <div className="card" id="recovery-analyzer">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Recovery Analysis</h2>
          <p className="text-gray-600 text-sm">
            Analyze potential recovery opportunities and success probabilities
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={!walletAddress || isAnalyzing}
          className="btn-primary flex items-center space-x-2"
        >
          <TrendingUp size={16} />
          <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Recovery'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {isAnalyzing && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">
              <span className="loading-dots">Analyzing recovery potential</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Checking transaction history and contract interactions...
          </p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign size={20} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Total Recoverable</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {analysis.totalRecoverable} ETH
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-green-700 mb-2">High Probability</div>
              <div className="text-2xl font-bold text-green-600">
                {analysis.opportunities.high}
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-yellow-700 mb-2">Medium Probability</div>
              <div className="text-2xl font-bold text-yellow-600">
                {analysis.opportunities.medium}
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-red-700 mb-2">Low Probability</div>
              <div className="text-2xl font-bold text-red-600">
                {analysis.opportunities.low}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Estimated Fees (15%):</span>
                <div className="font-medium">{analysis.estimatedFees} ETH</div>
              </div>
              <div>
                <span className="text-gray-600">Net Recovery:</span>
                <div className="font-medium text-green-600">{analysis.netRecovery} ETH</div>
              </div>
            </div>
          </div>

          {analysis.details.highProbability.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <CheckCircle size={20} className="text-green-500" />
                <span>High Probability Opportunities</span>
              </h3>
              <div className="space-y-3">
                {analysis.details.highProbability.map((opportunity, index) => 
                  renderOpportunity(opportunity, `high-${index}`)
                )}
              </div>
            </div>
          )}

          {analysis.details.mediumProbability.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Clock size={20} className="text-yellow-500" />
                <span>Medium Probability Opportunities</span>
              </h3>
              <div className="space-y-3">
                {analysis.details.mediumProbability.map((opportunity, index) => 
                  renderOpportunity(opportunity, `medium-${index}`)
                )}
              </div>
            </div>
          )}

          {analysis.details.lowProbability.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <AlertTriangle size={20} className="text-red-500" />
                <span>Low Probability Opportunities</span>
              </h3>
              <div className="space-y-3">
                {analysis.details.lowProbability.map((opportunity, index) => 
                  renderOpportunity(opportunity, `low-${index}`)
                )}
              </div>
            </div>
          )}

          {parseFloat(analysis.totalRecoverable) > 0 && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h4 className="font-medium text-primary-800 mb-2">Ready to Proceed?</h4>
              <p className="text-sm text-primary-700 mb-3">
                Based on the analysis, you have {analysis.totalRecoverable} ETH in recoverable assets.
                Our success-only fee is 15%, meaning you only pay if we successfully recover your funds.
              </p>
              <div className="flex space-x-3">
                <button 
                  onClick={handleExecuteRecovery}
                  disabled={isExecuting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                >
                  {isExecuting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <span>Execute Recovery</span>
                      <span>⚡</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={handleGetQuote}
                  className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Get Quote
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}