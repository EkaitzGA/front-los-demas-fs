import React, { useState, useEffect } from 'react';
import { useFilters } from '../../context/FilterProvider';
import { getUsers } from '../../utils/api/fetch';
import './SearchFilter.css';

const UserFilter = () => {
  const { userFilters, setUserFilters } = useFilters();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        if (response.success) {
          setUsers(response.data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);
  
  // Get unique countries from users
  const countries = [...new Set(users.map(user => user.country).filter(Boolean))];
  
  // Definimos las especializaciones disponibles
  const specializations = ['UX/UI', 'Front-end', 'Back-end', 'Full-stack'];
  
  // Create filter data structure
  const filterData = {
    search: ['username'],
    specializations: specializations,
    countries: countries
  };

  const [openSections, setOpenSections] = useState({
    search: false,
    specializations: false,
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

  const handleSpecializationChange = (specialization) => {
    setUserFilters(prev => ({
      ...prev,
      specialization: prev.specialization === specialization ? '' : specialization
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
            <span className="section-title">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </span>
            <span>{openSections[section] ? '−' : '+'}</span>
          </button>
          
          {openSections[section] && (
            <div className="options-container">
              {section === 'search' ? (
                <input
                  type="text"
                  value={userFilters.username || ''}
                  onChange={handleUsernameSearch}
                  placeholder="Search by username..."
                  className="username-search"
                />
              ) : section === 'specializations' ? (
                options.map((option) => (
                  <label key={option} className="filter-option">
                    <input
                      type="checkbox"
                      checked={userFilters.specialization === option}
                      onChange={() => handleSpecializationChange(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))
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