import React from 'react';
import './TissueLoader.css';

interface TissueLoaderProps {
  text?: string;
}

const TissueLoader: React.FC<TissueLoaderProps> = ({
  text = 'Preparing your experience...',
}) => {
  return (
    <div className="tissue-loader-container">
      <div className="tissue-animation">
        <div className="tissue-roll">
          <div className="roll-core"></div>
        </div>

        <div className="tissue-paper">
          <div className="paper-edge"></div>
        </div>
      </div>

      <div className="loader-text">
        <h3>{text}</h3>
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TissueLoader;
