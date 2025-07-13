import { TrendingUp, Heart, Users, Cigarette, Info, Eye, EyeOff } from 'lucide-react';
import React from 'react';

const MAX_FEATURE_IMPACT = 10000;

const featureExplanations = {
  age: "Age is a key factor - older individuals typically have higher healthcare costs",
  bmi: "BMI impacts health risk assessment and premium calculations",
  children: "Number of dependents affects coverage scope and costs",
  smoker: "Smoking status significantly influences insurance premiums due to health risks",
};

const featureIcons = {
  age: <TrendingUp className="w-4 h-4" />,
  bmi: <Heart className="w-4 h-4" />,
  children: <Users className="w-4 h-4" />,
  smoker: <Cigarette className="w-4 h-4" />
};

export default function FeatureImpactPanel({ contributions, showDetails, setShowDetails, isMobile }) {
  if (!contributions) return null;
  const items = Object.entries(contributions);

  if (isMobile) {
    return (
      <div className="feature-impact-panel bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/20 max-h-60 overflow-y-auto mt-6">
        <button
          className='flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-200 font-medium px-3 py-2 rounded-lg border-0'
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff'
          }}
          onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={e => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          Feature Impact Analysis {showDetails ? '▲' : '▼'}
        </button>
        {showDetails && (
          <div className="mt-4 space-y-4">
            <div className="text-sm text-white/80 mb-3">
              <Info className="w-4 h-4 inline mr-1" />
              Understanding how each factor contributes to your premium:
            </div>
            {items.map(([feature, value]) => {
              const percent = Math.min(100, (Math.abs(value) / MAX_FEATURE_IMPACT) * 100);
              const isPositive = value > 0;
              return (
                <div key={feature} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {featureIcons[feature]}
                      <span className="font-medium capitalize text-white">{feature}</span>
                    </div>
                    <span className={`font-semibold ${value === 0 ? 'text-green-400' : (isPositive ? 'text-red-400' : 'text-green-400')}`}>
                      {isPositive ? '+' : ''}${value.toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-3 transition-all duration-500 ${isPositive ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-green-400 to-green-600'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/70">{featureExplanations[feature]}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="feature-impact-panel bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/20 max-h-72 overflow-y-auto">
      <button
        className='flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-200 font-medium mb-3 px-3 py-2 rounded-lg border-0'
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#ffffff'
        }}
        onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        onMouseLeave={e => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        Feature Impact Analysis {showDetails ? '▲' : '▼'}
      </button>
      {showDetails && (
        <div className="space-y-3">
          <div className="text-sm text-white/80 mb-3">
            <Info className="w-4 h-4 inline mr-1" />
            Understanding how each factor contributes to your premium:
          </div>
          {items.map(([feature, value]) => {
            const percent = Math.min(100, (Math.abs(value) / MAX_FEATURE_IMPACT) * 100);
            const isPositive = value > 0;
            return (
              <div key={feature} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {featureIcons[feature]}
                    <span className="font-medium capitalize text-white">{feature}</span>
                  </div>
                  <span className={`font-semibold ${value === 0 ? 'text-blue-400' : (isPositive ? 'text-yellow-400' : 'text-blue-400')}`}>
                    {isPositive ? '+' : ''}${value.toFixed(0)}
                  </span>
                </div>
                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-3 transition-all duration-500 ${isPositive ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-green-400 to-green-600'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-xs text-white/70">{featureExplanations[feature]}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 