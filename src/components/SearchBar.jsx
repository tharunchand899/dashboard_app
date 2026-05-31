import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Reusable SearchBar component.
 * Managed input for searching country names.
 */
const SearchBar = ({ value, onChange, placeholder = 'Search countries by name...' }) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="search-bar-wrapper">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          className="clear-button"
          onClick={handleClear}
          aria-label="Clear search query"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
