import React, { useState } from 'react';
import { useFilters } from '../../context/FilterProvider';
import { users } from '../../data/users';
import './SearchFilter.css';

const UserFilter = () => {
  const { userFilters, setUserFilters } = useFilters();
  
  // Get unique countries from users
  const countries = [...new Set(users.map(user => user.country))];
  
  // Create filter data structure similar to the original
  const filterData = {
    search: ['username'],  // This will be handled differently
    countries: countries
  };

  const [openSections, setOpenSections] = useState({
    search: false,
    countries: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCountryChange = (country) => {
    setUserFilters(prev => ({
      ...prev,
      country: prev.country === country ? '' : country
    }));
  };

  const handleUsernameSearch = (event) => {
    setUserFilters(prev => ({
      ...prev,
      username: event.target.value
    }));
  };

  return (
    <div className="search-filter">
      {Object.entries(filterData).map(([section, options]) => (
        <div key={section} className="filter-section">
          <button
            onClick={() => toggleSection(section)}
            className="section-toggle"
          >
            <span className="section-title">{section}</span>
            <span>{openSections[section] ? '−' : '+'}</span>
          </button>
          
          {openSections[section] && (
            <div className="options-container">
              {section === 'search' ? (
                <input
                  type="text"
                  value={userFilters.username}
                  onChange={handleUsernameSearch}
                  placeholder="Search by username..."
                  className="username-search"
                />
              ) : (
                options.map((option) => (
                  <label key={option} className="filter-option">
                    <input
                      type="checkbox"
                      checked={userFilters.country === option}
                      onChange={() => handleCountryChange(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserFilter;