import { createContext, useState, useContext } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
    const [selectedFilters, setSelectedFilters] = useState({
        styles: [],
        types: [],
        subjects: []
    });

    return (
        <FilterContext.Provider value={{ selectedFilters, setSelectedFilters }}>
            {children}
        </FilterContext.Provider>
    );
}

export const useFilters = () => useContext(FilterContext);