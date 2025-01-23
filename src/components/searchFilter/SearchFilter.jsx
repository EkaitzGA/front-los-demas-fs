import React, { useState, useEffect, useRef } from 'react';
import { useFilters } from '../../context/FilterProvider';
import { getProjects } from '../../utils/api/fetch';
import './SearchFilter.css';

const SearchFilter = () => {
  const filterRef = useRef(null);
  const { selectedFilters, setSelectedFilters } = useFilters();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filterData, setFilterData] = useState({
    styles: [],
    types: [],
    subjects: []
  });

  const [availableOptions, setAvailableOptions] = useState({
    styles: [],
    types: [],
    subjects: []
  });

  const [openSections, setOpenSections] = useState({
    styles: false,
    types: false,
    subjects: false
  });

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Función auxiliar para obtener el nombre de un objeto de filtro
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getProjects();

        if (!response.success) {
          throw new Error('Error fetching projects');
        }

        const projectsData = response.data;
        setProjects(projectsData);

        // Extraer opciones únicas de los proyectos
        const uniqueOptions = projectsData.reduce((acc, project) => {
          // Extraer y añadir nombres únicos para cada categoría
          project.styles.forEach(style => acc.styles.add(style.name));
          project.types.forEach(type => acc.types.add(type.name));
          project.subjects.forEach(subject => acc.subjects.add(subject.name));
          return acc;
        }, {
          styles: new Set(),
          types: new Set(),
          subjects: new Set()
        });

        // Convertir Sets a arrays y ordenar alfabéticamente
        const filterOptions = {
          styles: [...uniqueOptions.styles].sort(),
          types: [...uniqueOptions.types].sort(),
          subjects: [...uniqueOptions.subjects].sort()
        };

        setFilterData(filterOptions);
        setAvailableOptions(filterOptions);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para obtener el conteo de proyectos para una opción específica
  const getDynamicOptionCount = (section, option) => {
    // Si no hay filtros seleccionados, mostrar el total de proyectos para esa opción
    if (Object.values(selectedFilters).every(filters => filters.length === 0)) {
      return projects.filter(project =>
        project[section].some(item => item.name === option)
      ).length;
    }

    // Si hay filtros seleccionados, mostrar cuántos proyectos quedarían si se selecciona esta opción
    const wouldMatchProjects = projects.filter(project => {
      // Debe cumplir con los filtros actuales de otras secciones
      const matchesOtherSections = Object.entries(selectedFilters).every(([filterSection, selected]) => {
        if (filterSection === section || selected.length === 0) return true;
        return selected.every(filter =>
          project[filterSection].some(item => item.name === filter)
        );
      });

      // Y debe tener la opción actual
      const hasCurrentOption = project[section].some(item => item.name === option);

      return matchesOtherSections && hasCurrentOption;
    });

    return wouldMatchProjects.length;
  };

  // Actualizar opciones disponibles cuando cambian los filtros
  useEffect(() => {
    if (!projects.length) return;

    const filteredProjects = projects.filter(project =>
      Object.entries(selectedFilters).every(([section, selected]) => {
        if (selected.length === 0) return true;
        return selected.every(filter =>
          project[section].some(item => item.name === filter)
        );
      })
    );

    const available = {
      styles: new Set(),
      types: new Set(),
      subjects: new Set()
    };

    filteredProjects.forEach(project => {
      project.styles.forEach(style => available.styles.add(style.name));
      project.types.forEach(type => available.types.add(type.name));
      project.subjects.forEach(subject => available.subjects.add(subject.name));
    });

    setAvailableOptions({
      styles: filterData.styles.filter(option =>
        selectedFilters.styles.includes(option) || available.styles.has(option)
      ),
      types: filterData.types.filter(option =>
        selectedFilters.types.includes(option) || available.types.has(option)
      ),
      subjects: filterData.subjects.filter(option =>
        selectedFilters.subjects.includes(option) || available.subjects.has(option)
      )
    });
  }, [selectedFilters, projects, filterData]);

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

  if (loading) {
    return <div>Loading filters...</div>;
  }

  if (error) {
    return <div>Error loading filters: {error}</div>;
  }

  return (
    <div className="filter-container">
      <h2 className="filter-title">FILTER YOUR RESULTS</h2>
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
                  const count = getDynamicOptionCount(section, option);
                  const isSelected = selectedFilters[section].includes(option);

                  // Solo mostrar opciones con count > 0 o que estén seleccionadas
                  if (count === 0 && !isSelected) return null;

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
                      <span className="count">({count})</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;