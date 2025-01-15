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

  // Función para obtener proyectos que coinciden con las selecciones de otras secciones
  const getProjectsMatchingOtherSections = (currentSection) => {
    if (Object.values(selectedFilters).every(selected => selected.length === 0)) {
      return projects;
    }

    return projects.filter(project => {
      return Object.entries(selectedFilters).every(([section, selected]) => {
        // Ignoramos la sección actual
        if (section === currentSection) return true;
        // Si no hay selecciones en esta sección, es válido
        if (selected.length === 0) return true;
        // El proyecto debe coincidir con al menos una selección de la sección
        return selected.some(filter => project[section].includes(filter));
      });
    });
  };

  // Función para obtener el conteo de proyectos para una opción específica
  const getDynamicOptionCount = (section, option) => {
    // Primero obtenemos los proyectos que coinciden con las selecciones de otras secciones
    const projectsFromOtherSections = getProjectsMatchingOtherSections(section);

    // Si la opción está seleccionada, contamos cuántos de los proyectos actuales la tienen
    if (selectedFilters[section].includes(option)) {
      return projectsFromOtherSections.filter(project => 
        project[section].includes(option)
      ).length;
    }

    // Para opciones no seleccionadas, contamos cuántos proyectos coincidentes tienen esta opción
    return projectsFromOtherSections.filter(project => 
      project[section].includes(option)
    ).length;
  };

  // Función para determinar qué opciones están disponibles
  const getAvailableOptions = (currentSelections) => {
    const available = {
      styles: new Set(),
      types: new Set(),
      subjects: new Set()
    };

    // Para cada sección, obtenemos los proyectos disponibles basados en otras secciones
    Object.keys(available).forEach(section => {
      const projectsFromOtherSections = getProjectsMatchingOtherSections(section);
      
      projectsFromOtherSections.forEach(project => {
        project.styles.forEach(style => available.styles.add(style));
        project.types.forEach(type => available.types.add(type));
        project.subjects.forEach(subject => available.subjects.add(subject));
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

  // Effect para manejar clicks fuera del componente
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
              {options
                .map((option) => {
                  const dynamicCount = getDynamicOptionCount(section, option);
                  const isSelected = selectedFilters[section].includes(option);
                  // Solo consideramos disponible si tiene conteo > 0 o está seleccionado
                  const isAvailable = dynamicCount > 0 || isSelected;
                  
                  // Si no está disponible y no está seleccionado, no lo renderizamos
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
                .filter(Boolean) // Eliminamos los null del mapeo
              }
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchFilter;