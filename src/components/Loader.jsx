import React from 'react';

/**
 * Reusable loading spinner component.
 */
const Loader = ({ message = 'Loading country details...' }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default Loader;
