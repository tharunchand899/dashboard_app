import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBucketList } from '../context/BucketListContext';
import CountryCard from '../components/CountryCard';
import EmptyState from '../components/EmptyState';
import { MapPin, CheckCircle, ArrowRight, Compass, Map } from 'lucide-react';

/**
 * BucketList Page.
 * Displays the user's travel lists (bucket list plans and visited places)
 * using the unified CountryCard design.
 */
const BucketList = () => {
  const { bucketList, visited } = useBucketList();
  const navigate = useNavigate();

  const totalCountries = bucketList.length + visited.length;
  const progressPercentage = totalCountries > 0 
    ? Math.round((visited.length / totalCountries) * 100) 
    : 0;

  return (
    <div className="bucketlist-container page-content">
      {/* Travel Journal Header & Progress Tracker */}
      <header className="bucketlist-header">
        <h1 className="bucketlist-title">My Travel Journal</h1>
        
        <div className="journal-progress-tracker">
          <div className="progress-header">
            <span>Journal Progress</span>
            <span className="progress-pct">{progressPercentage}% Completed</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Checked off {visited.length} of {totalCountries} mapped countries
          </p>
        </div>
      </header>

      {/* Want to Visit (Bucket List Plans) */}
      <section className="bucketlist-section">
        <div className="section-title-badge">
          <MapPin size={20} style={{ color: 'var(--brand-coral)' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Want to Visit</h2>
          <span className="badge-count">{bucketList.length}</span>
        </div>

        {bucketList.length > 0 ? (
          <div className="countries-grid">
            {bucketList.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Bucket List is Empty"
            message="No travel plans yet! Search the globe and tap the heart icon on country cards to add them here."
            icon={Map}
            actionButton={
              <button 
                onClick={() => navigate('/dashboard')} 
                className="explore-link-btn"
                type="button"
              >
                <span>Explore Countries</span>
                <ArrowRight size={16} />
              </button>
            }
          />
        )}
      </section>

      {/* Visited Milestones */}
      <section className="bucketlist-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '36px' }}>
        <div className="section-title-badge">
          <CheckCircle size={20} style={{ color: 'var(--brand-teal)' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Countries Visited</h2>
          <span className="badge-count">{visited.length}</span>
        </div>

        {visited.length > 0 ? (
          <div className="countries-grid">
            {visited.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Visited Countries Yet"
            message="Keep exploring! Check off countries in your bucket list or tap the checkmark icon to log your visits."
            icon={Compass}
            actionButton={
              <button 
                onClick={() => navigate('/dashboard')} 
                className="explore-link-btn"
                type="button"
              >
                <span>Browse Countries</span>
                <ArrowRight size={16} />
              </button>
            }
          />
        )}
      </section>
    </div>
  );
};

export default BucketList;
