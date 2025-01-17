import React, { useState, useEffect, useRef } from 'react';
import { useFilters } from '../../context/FilterProvider';
import { filterData } from '../../data/categories';
import { projects } from '../../data/projects';
import './SearchFilter.css';

const SearchFilter = () => {
  const filterRef = useRef(null);
  const { selectedFilters, setSelectedFilters } = useFilters();
  const [availableOptions, setAvailableOptions] = useState({
    styles: filterData.styles,
    types: filterData.types,
    subjects: filterData.subjects
  });
  
  const [openSections, setOpenSections] = useState({
    styles: false,
    types: false,
    subjects: false
  });

  // Función auxiliar para obtener el nombre de un objeto de filtro
  const getFilterName = (filterObj) => filterObj.name;

  // Función para obtener proyectos que coinciden con las selecciones de otras secciones
  const getProjectsMatchingOtherSections = (currentSection) => {
    if (Object.values(selectedFilters).every(selected => selected.length === 0)) {
      return projects;
    }

    return projects.filter(project => {
      return Object.entries(selectedFilters).every(([section, selected]) => {
        if (section === currentSection) return true;
        if (selected.length === 0) return true;
        
        // Extraemos los nombres de los filtros del proyecto
        const projectFilterNames = project[section].map(getFilterName);
        // Verificamos si alguno de los filtros seleccionados está en el proyecto
        return selected.some(filter => projectFilterNames.includes(filter));
      });
    });
  };

  // Función para obtener el conteo de proyectos para una opción específica
  const getDynamicOptionCount = (section, option) => {
    const projectsFromOtherSections = getProjectsMatchingOtherSections(section);

    return projectsFromOtherSections.filter(project => {
      const projectFilterNames = project[section].map(getFilterName);
      return projectFilterNames.includes(option);
    }).length;
  };

  // Función para determinar qué opciones están disponibles
  const getAvailableOptions = (currentSelections) => {
    const available = {
      styles: new Set(),
      types: new Set(),
      subjects: new Set()
    };

    Object.keys(available).forEach(section => {
      const projectsFromOtherSections = getProjectsMatchingOtherSections(section);
      
      projectsFromOtherSections.forEach(project => {
        project[section].forEach(filter => {
          available[section].add(filter.name);
        });
      });
    });

    return {
      styles: filterData.styles.filter(option => 
        currentSelections.styles.includes(option) || available.styles.has(option)
      ),
      types: filterData.types.filter(option => 
        currentSelections.types.includes(option) || available.types.has(option)
      ),
      subjects: filterData.subjects.filter(option => 
        currentSelections.subjects.includes(option) || available.subjects.has(option)
      )
    };
  };

  useEffect(() => {
    const newAvailableOptions = getAvailableOptions(selectedFilters);
    setAvailableOptions(newAvailableOptions);
  }, [selectedFilters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenSections({
          styles: false,
          types: false,
          subjects: false
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className="search-filter" ref={filterRef}>
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
              {options.map((option) => {
                  const dynamicCount = getDynamicOptionCount(section, option);
                  const isSelected = selectedFilters[section].includes(option);
                  const isAvailable = dynamicCount > 0 || isSelected;
                  
                  if (!isAvailable && !isSelected) return null;
                  
                  return (
                    <label 
                      key={option} 
                      className="filter-option"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(section, option)}
                      />
                      <span>{option}</span>
                      <span className="count">({dynamicCount})</span>
                    </label>
                  );
                })
                .filter(Boolean)
              }
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchFilter;