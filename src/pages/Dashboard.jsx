import React, { useState, useEffect, useMemo } from 'react';
import { countryService } from '../services/countryService';
import { useBucketList } from '../context/BucketListContext';
import { useAuth } from '../context/AuthContext';
import RegionFilter from '../components/RegionFilter';
import CountryCard from '../components/CountryCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { Compass, MapPin, CheckCircle, RefreshCw, ArrowUpDown } from 'lucide-react';

/**
 * Dashboard Page.
 * Displays list of countries with region pills, sorting options, and summary stats.
 */
const Dashboard = () => {
  const { bucketList, visited } = useBucketList();
  const { searchQuery } = useAuth(); // Connect directly to global search input from Navbar
  
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [region, setRegion] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  const fetchCountries = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await countryService.getAllCountries();
      setCountries(data);
    } catch (err) {
      setError(err.message || 'Failed to load countries. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Filter & sort countries
  const filteredAndSortedCountries = useMemo(() => {
    let result = [...countries];

    // Apply search filter using global searchQuery
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name?.common?.toLowerCase()?.includes(query) || 
        c.name?.official?.toLowerCase()?.includes(query)
      );
    }

    // Apply region filter
    if (region) {
      result = result.filter(c => c.region === region);
    }

    // Apply sorting
    result.sort((a, b) => {
      const nameA = a.name?.common || '';
      const nameB = b.name?.common || '';

      switch (sortBy) {
        case 'name-asc':
          return nameA.localeCompare(nameB);
        case 'name-desc':
          return nameB.localeCompare(nameA);
        case 'population-desc':
          return (b.population || 0) - (a.population || 0);
        case 'population-asc':
          return (a.population || 0) - (b.population || 0);
        case 'area-desc':
          return (b.area || 0) - (a.area || 0);
        case 'area-asc':
          return (a.area || 0) - (b.area || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [countries, searchQuery, region, sortBy]);

  // If loading, show loader
  if (isLoading) {
    return (
      <div className="dashboard-container page-content">
        <Loader message="Loading country list..." />
      </div>
    );
  }

  // If error, show error component
  if (error) {
    return (
      <div className="dashboard-container page-content error-view">
        <div className="error-card">
          <RefreshCw className="error-icon" size={48} />
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchCountries} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container page-content">
      {/* Welcome Hero / Header */}
      <header className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Explore the <span className="gradient-text">World</span>
          </h1>
          <p className="hero-subtitle">
            Plan your next journey, check off your bucket list, and keep track of where you've been.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper blue">
              <Compass size={20} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{countries.length}</span>
              <span className="stat-label">Total Countries</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper orange">
              <MapPin size={20} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{bucketList.length}</span>
              <span className="stat-label">In Bucket List</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper green">
              <CheckCircle size={20} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{visited.length}</span>
              <span className="stat-label">Visited</span>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Toolbar */}
      <section className="toolbar-section">
        {/* Region pills filter */}
        <RegionFilter value={region} onChange={setRegion} />
        
        {/* Sort select filter */}
        <div className="sort-control-wrapper">
          <ArrowUpDown className="sort-icon" size={16} />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort countries"
          >
            <option value="name-asc">Name (A - Z)</option>
            <option value="name-desc">Name (Z - A)</option>
            <option value="population-desc">Population (Highest First)</option>
            <option value="population-asc">Population (Lowest First)</option>
            <option value="area-desc">Area (Largest First)</option>
            <option value="area-asc">Area (Smallest First)</option>
          </select>
        </div>
      </section>

      {/* Country List Content */}
      <main className="countries-grid-section">
        {filteredAndSortedCountries.length > 0 ? (
          <div className="countries-grid">
            {filteredAndSortedCountries.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No Countries Found" 
            message="No countries match your search parameters. Try changing your search query or region filter."
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
