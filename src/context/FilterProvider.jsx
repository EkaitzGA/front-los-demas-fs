import { createContext, useState, useContext } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
    const [selectedFilters, setSelectedFilters] = useState({
        styles: [],
        types: [],
        subjects: []
    });

    const [userFilters, setUserFilters] = useState({
        country: '',
        username: ''
    });

    return (
        <FilterContext.Provider value={{ 
            selectedFilters, 
            setSelectedFilters,
            userFilters,
            setUserFilters 
        }}>
            {children}
        </FilterContext.Provider>
    );
}

export const useFilters = () => useContext(FilterContext);