import React, { useState } from 'react';
import { useFilters } from '../../context/FilterProvider';
import { filterData } from '../../data/categories';
import './SearchFilter.css'

const SearchFilter = () => {
  const { selectedFilters, setSelectedFilters } = useFilters();

  const [openSections, setOpenSections] = useState({
    styles: false,
    types: false,
    subjects: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxChange = (section, value) => {
    setSelectedFilters(prev => {
      const updated = [...prev[section]];
      if (updated.includes(value)) {
        return {
          ...prev,
          [section]: updated.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [section]: [...updated, value]
        };
      }
    });
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
              {options.map((option) => (
                <label key={option} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedFilters[section].includes(option)}
                    onChange={() => handleCheckboxChange(section, option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchFilter;