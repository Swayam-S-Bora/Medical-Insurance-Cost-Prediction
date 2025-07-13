import React from 'react';

export default function PremiumResult({ prediction, showResults, children }) {
  return (
    <div className="w-[40%] h-full flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute bottom-32 left-40 w-16 h-16 bg-white rounded-full"></div>
      </div>
      {/* Results (fades in when available) */}
      {prediction !== null && (
        <div className={`transition-all duration-1000 ${showResults ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'} ${!showResults ? 'absolute' : 'relative'} w-full max-w-md`}>
          <div className="output-blur-container p-8 border border-white/40 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                {/* Calculator icon should be rendered by parent if needed */}
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{color: '#ffffff'}}>Your Estimated Premium</h3>
              <div className="text-5xl font-bold mb-2" style={{color: '#ffffff'}}>
                ${prediction.toFixed(0)}
              </div>
              <p style={{color: 'rgba(255, 255, 255, 0.8)'}}>Annual premium estimate</p>
            </div>
            {/* Premium Breakdown */}
            <div className="bg-white/20 rounded-xl p-4 mb-6">
              <h4 className="font-bold mb-3" style={{color: '#ffffff'}}>Premium Breakdown</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div style={{color: 'rgba(255, 255, 255, 0.9)'}}>Monthly: <span className="font-bold" style={{color: '#ffffff'}}>${(prediction / 12).toFixed(0)}</span></div>
                <div style={{color: 'rgba(255, 255, 255, 0.9)'}}>Quarterly: <span className="font-bold" style={{color: '#ffffff'}}>${(prediction / 4).toFixed(0)}</span></div>
              </div>
            </div>
            {/* Feature Impact Panel */}
            <div className="feature-impact-scroll flex-1 min-h-0">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
} 