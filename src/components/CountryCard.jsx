import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBucketList } from '../context/BucketListContext';
import { Heart, Check, Map, Landmark, Users } from 'lucide-react';

/**
 * Reusable CountryCard component.
 * Displays brief country details and direct bucket list/visited toggles.
 */
const CountryCard = ({ country }) => {
  const { name, flags, cca3, region, population, capital } = country;
  
  const { 
    isInBucketList, 
    isVisited, 
    addToBucketList, 
    markAsVisited, 
    removeCountry 
  } = useBucketList();

  const navigate = useNavigate();

  const countryName = name?.common || 'Unknown Country';
  const flagUrl = flags?.svg || flags?.png || '';
  const flagAlt = flags?.alt || `Flag of ${countryName}`;
  const capitalName = capital && capital.length > 0 ? capital.join(', ') : 'N/A';

  const inBucket = isInBucketList(cca3);
  const visited = isVisited(cca3);

  // Handle Card Navigation click
  const handleCardClick = () => {
    navigate(`/country/${cca3}`);
  };

  // Handle Bucket List click with preventDefault to stop navigation bubbling
  const handleBucketClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inBucket) {
      removeCountry(cca3);
    } else {
      addToBucketList(country);
    }
  };

  // Handle Visited click with preventDefault
  const handleVisitedClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (visited) {
      removeCountry(cca3);
    } else {
      markAsVisited(country);
    }
  };

  return (
    <article className="country-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="country-card-image-wrapper">
        <img src={flagUrl} alt={flagAlt} loading="lazy" className="country-card-image" />
      </div>
      
      <div className="country-card-content">
        <h3 className="country-card-title">{countryName}</h3>
        
        <div className="country-card-details">
          <div className="country-card-detail-item">
            <Landmark size={14} className="detail-icon" />
            <span><strong>Capital:</strong> {capitalName}</span>
          </div>
          
          <div className="country-card-detail-item">
            <Users size={14} className="detail-icon" />
            <span><strong>Population:</strong> {population?.toLocaleString()}</span>
          </div>

          <div className="country-card-detail-item">
            <Map size={14} className="detail-icon" />
            <span><strong>Region:</strong> {region}</span>
          </div>
        </div>
      </div>
      
      {/* Quick Action Toggle Buttons at Card Bottom */}
      <div className="country-card-actions-bar">
        <button
          type="button"
          onClick={handleBucketClick}
          className={`card-circle-btn btn-heart ${inBucket ? 'active' : ''} ${visited ? 'disabled' : ''}`}
          disabled={visited}
          title={inBucket ? 'Remove from Bucket List' : 'Add to Bucket List'}
          aria-label="Toggle bucket list"
        >
          <Heart size={16} fill={inBucket ? 'currentColor' : 'none'} />
        </button>

        <button
          type="button"
          onClick={handleVisitedClick}
          className={`card-circle-btn btn-check ${visited ? 'active' : ''}`}
          title={visited ? 'Remove from Visited' : 'Mark as Visited'}
          aria-label="Toggle visited"
        >
          <Check size={16} />
        </button>
      </div>
    </article>
  );
};

export default CountryCard;
