import React, { useState, useEffect, useRef } from 'react';
import { useFilters } from '../../context/FilterProvider';
import { getUsers } from '../../utils/api/fetch';
import './SearchFilter.css';

const UserFilter = () => {
  const { userFilters, setUserFilters } = useFilters();
  const filterRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [filterData, setFilterData] = useState({
    search: ['username'],
    specializations: [],
    countries: []
  });

  const [openSections, setOpenSections] = useState({
    search: false,
    specializations: false,
    countries: false
  });

  // Cargar usuarios y extraer datos de filtrado
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getUsers();
        
        if (!response.success) {
          throw new Error('Error fetching users');
        }

        const usersData = response.data;
        setUsers(usersData);

        // Extraer países únicos de los usuarios (excluyendo valores nulos/vacíos)
        const uniqueCountries = [...new Set(
          usersData
            .map(user => user.country)
            .filter(Boolean)
            .sort()
        )];

        // Extraer especializaciones únicas de los usuarios
        const uniqueSpecializations = [...new Set(
          usersData
            .map(user => user.specialization)
            .filter(Boolean)
            .sort()
        )];

        setFilterData({
          search: ['username'],
          specializations: uniqueSpecializations,
          countries: uniqueCountries
        });

      } catch (err) {
        setError(err.message);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Obtener el conteo de usuarios para una opción específica
  const getDynamicOptionCount = (section, option) => {
    return users.filter(user => {
      // Si hay un filtro de país activo y no coincide, excluir
      if (userFilters.country && section !== 'countries' && user.country !== userFilters.country) {
        return false;
      }
      
      // Si hay un filtro de especialización activo y no coincide, excluir
      if (userFilters.specialization && section !== 'specializations' && 
          user.specialization !== userFilters.specialization) {
        return false;
      }
      
      // Si hay una búsqueda activa y no coincide, excluir
      if (userFilters.username && !user.username.toLowerCase().includes(userFilters.username.toLowerCase())) {
        return false;
      }

      // Comprobar la opción actual
      if (section === 'countries') {
        return user.country === option;
      }
      if (section === 'specializations') {
        return user.specialization === option;
      }
      return true;
    }).length;
  };

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

  if (loading) {
    return <div>Loading filters...</div>;
  }

  if (error) {
    return <div>Error loading filters: {error}</div>;
  }

  return (
    <div className="search-filter" ref={filterRef}>
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
                options.map((option) => {
                  const count = getDynamicOptionCount(section, option);
                  const isSelected = userFilters.specialization === option;

                  // Solo mostrar opciones con count > 0 o que estén seleccionadas
                  if (count === 0 && !isSelected) return null;

                  return (
                    <label key={option} className="filter-option">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSpecializationChange(option)}
                      />
                      <span>{option}</span>
                      <span className="count">({count})</span>
                    </label>
                  );
                })
              ) : (
                options.map((option) => {
                  const count = getDynamicOptionCount(section, option);
                  const isSelected = userFilters.country === option;

                  // Solo mostrar opciones con count > 0 o que estén seleccionadas
                  if (count === 0 && !isSelected) return null;

                  return (
                    <label key={option} className="filter-option">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCountryChange(option)}
                      />
                      <span>{option}</span>
                      <span className="count">({count})</span>
                    </label>
                  );
                })
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserFilter;