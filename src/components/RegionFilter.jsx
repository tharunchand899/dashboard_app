import React from 'react';

/**
 * Pill-based RegionFilter component matching screen 2 mockup layout.
 */
const RegionFilter = ({ value, onChange }) => {
  const regions = [
    { label: 'All', value: '' },
    { label: 'Africa', value: 'Africa' },
    { label: 'Americas', value: 'Americas' },
    { label: 'Asia', value: 'Asia' },
    { label: 'Europe', value: 'Europe' },
    { label: 'Oceania', value: 'Oceania' }
  ];

  return (
    <div className="region-pills-container">
      {regions.map((region) => {
        const isActive = value === region.value;
        return (
          <button
            key={region.label}
            type="button"
            className={`region-pill-btn ${isActive ? 'active' : ''}`}
            onClick={() => onChange(region.value)}
          >
            {region.label}
          </button>
        );
      })}
    </div>
  );
};

export default RegionFilter;
