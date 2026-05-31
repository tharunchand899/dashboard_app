import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { countryService } from '../services/countryService';
import { useBucketList } from '../context/BucketListContext';
import Loader from '../components/Loader';
import { 
  ArrowLeft, MapPin, CheckCircle, Navigation, 
  Users, Globe2, Layers, Compass, Check, AlertCircle,
  ShieldAlert, Languages, Coins, Clock, Link2, Heart
} from 'lucide-react';

/**
 * CountryDetail Page Component.
 * Displays details for a single country matching screen 3 mockup layout.
 */
const CountryDetail = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  
  const { 
    addToBucketList, 
    markAsVisited, 
    isInBucketList, 
    isVisited 
  } = useBucketList();

  const [country, setCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState(null); // { text, type: 'success' | 'error' }

  useEffect(() => {
    const fetchCountryDetails = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await countryService.getCountryByCode(code.toUpperCase());
        setCountry(data);
      } catch (err) {
        setError(err.message || 'Failed to load country details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountryDetails();
  }, [code]);

  const showAlert = (text, type) => {
    setAlert({ text, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const handleAddToBucket = () => {
    if (!country) return;
    const res = addToBucketList(country);
    showAlert(res.message, res.success ? 'success' : 'error');
  };

  const handleMarkVisited = () => {
    if (!country) return;
    const res = markAsVisited(country);
    showAlert(res.message, res.success ? 'success' : 'error');
  };

  if (isLoading) {
    return (
      <div className="detail-page-container page-content">
        <Loader message="Loading country profile details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page-container page-content error-view">
        <div className="error-card">
          <ShieldAlert className="error-icon" size={48} />
          <h2>Unable to find country</h2>
          <p>{error}</p>
          <Link to="/dashboard" className="retry-btn back-btn-link">
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!country) return null;

  const countryName = country.name?.common || 'Unknown';
  const flagUrl = country.flags?.svg || country.flags?.png || '';
  const flagAlt = country.flags?.alt || `Flag of ${countryName}`;
  const capitalName = country.capital && country.capital.length > 0 ? country.capital.join(', ') : 'N/A';
  
  // Format language strings
  const languagesList = country.languages 
    ? Object.values(country.languages).join(', ') 
    : 'N/A';

  // Format currency strings
  const currenciesList = country.currencies 
    ? Object.values(country.currencies)
        .map(c => `${c.name} (${c.symbol || ''})`)
        .join(', ')
    : 'N/A';

  // Format timezone strings
  const timezonesList = country.timezones 
    ? country.timezones.slice(0, 3).join(', ') + (country.timezones.length > 3 ? '...' : '')
    : 'N/A';

  const countryInBucket = isInBucketList(country.cca3);
  const countryVisited = isVisited(country.cca3);

  return (
    <div className="detail-page-container page-content">
      {/* Toast Alert Popups */}
      {alert && (
        <div className={`detail-toast-alert alert-${alert.type} animate-slide-in`}>
          {alert.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{alert.text}</span>
        </div>
      )}

      {/* Back Button matching mockup */}
      <button onClick={() => navigate(-1)} className="detail-back-arrow-btn">
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      {/* Country Detail Layout */}
      <div className="detail-main-layout">
        
        {/* Flag Image Card */}
        <div className="detail-flag-hero-card">
          <img src={flagUrl} alt={flagAlt} className="detail-flag-hero-image" />
        </div>

        {/* Title and Capital Name */}
        <div className="detail-header-block">
          <h1 className="detail-brand-title">{countryName}</h1>
          <div className="detail-location-pin-row">
            <MapPin className="pin-icon" size={16} />
            <span>{capitalName}</span>
          </div>
        </div>

        {/* Details Metrics Grid */}
        <div className="detail-metrics-grid">
          <div className="metric-box">
            <Navigation className="box-icon" size={20} />
            <div className="box-content">
              <span className="box-label">Capital</span>
              <span className="box-value">{capitalName}</span>
            </div>
          </div>

          <div className="metric-box">
            <Users className="box-icon" size={20} />
            <div className="box-content">
              <span className="box-label">Population</span>
              <span className="box-value">{country.population?.toLocaleString()}</span>
            </div>
          </div>

          <div className="metric-box">
            <Languages className="box-icon" size={20} />
            <div className="box-content">
              <span className="box-label">Languages</span>
              <span className="box-value">{languagesList}</span>
            </div>
          </div>

          <div className="metric-box">
            <Coins className="box-icon" size={20} />
            <div className="box-content">
              <span className="box-label">Currencies</span>
              <span className="box-value">{currenciesList}</span>
            </div>
          </div>

          <div className="metric-box">
            <Clock className="box-icon" size={20} />
            <div className="box-content">
              <span className="box-label">Timezones</span>
              <span className="box-value">{timezonesList}</span>
            </div>
          </div>

          <div className="metric-box">
            <Layers className="box-icon" size={20} />
            <div className="box-content">
              <span className="box-label">Area Size</span>
              <span className="box-value">
                {country.area ? `${country.area.toLocaleString()} km²` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Bordering Neighboring Countries section */}
        <div className="detail-borders-section">
          <h3 className="borders-title">Neighboring Countries</h3>
          {country.borders && country.borders.length > 0 ? (
            <div className="borders-pills-list">
              {country.borders.map((borderCode) => (
                <Link 
                  key={borderCode} 
                  to={`/country/${borderCode}`} 
                  className="border-pill-link"
                >
                  <Link2 size={12} className="link-icon" />
                  <span>{borderCode}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="no-borders-text">This country has no neighboring land borders.</p>
          )}
        </div>

        {/* Massive Actions Buttons at Bottom */}
        <div className="detail-bottom-actions">
          <button
            onClick={handleAddToBucket}
            className={`detail-btn-coral ${countryInBucket ? 'filled' : ''} ${countryVisited ? 'disabled' : ''}`}
            disabled={countryVisited}
          >
            <Heart size={18} fill={countryInBucket ? 'currentColor' : 'none'} />
            <span>{countryInBucket ? 'In Bucket List' : 'Add to Bucket List'}</span>
          </button>

          <button
            onClick={handleMarkVisited}
            className={`detail-btn-teal ${countryVisited ? 'filled' : ''}`}
          >
            <CheckCircle size={18} fill={countryVisited ? 'currentColor' : 'none'} />
            <span>{countryVisited ? 'Visited' : 'Mark as Visited'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
