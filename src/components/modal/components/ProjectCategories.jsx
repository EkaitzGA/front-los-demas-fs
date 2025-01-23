import { useState, useEffect } from 'react';
import { getAllTypes, getAllStyles, getAllSubjects } from '../../../utils/api/fetch.js'
import './ProjectCategories.css'

const ProjectCategories = ({ projectData, setProjectData, onNext, onBack }) => {
    const [types, setTypes] = useState([]);
    const [styles, setStyles] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [typesResponse, stylesResponse, subjectsResponse] = await Promise.all([
                    getAllTypes(),
                    getAllStyles(),
                    getAllSubjects()
                ]);

                if (typesResponse.success) {
                    setTypes(typesResponse.data);
                }
                if (stylesResponse.success) {
                    setStyles(stylesResponse.data);
                }
                if (subjectsResponse.success) {
                    setSubjects(subjectsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleOptionClick = (category, id) => {
        setProjectData(prev => {
            const currentSelection = prev[category] || [];
            const newSelection = currentSelection.includes(id)
                ? currentSelection.filter(item => item !== id)
                : [...currentSelection, id];

            return {
                ...prev,
                [category]: newSelection
            };
        });
    };

    const handleContinue = (e) => {
        e.preventDefault();
        if ((projectData.types?.length || 0) > 0 &&
            (projectData.styles?.length || 0) > 0 &&
            (projectData.subjects?.length || 0) > 0) {
            onNext();
        } else {
            alert('Please select at least one option from each category');
        }
    };

    if (isLoading) return <div>Loading categories...</div>;

    // Asegurar que los arrays existan
    const currentTypes = projectData.types || [];
    const currentStyles = projectData.styles || [];
    const currentSubjects = projectData.subjects || [];

    return (
        <form onSubmit={handleContinue} className="categories-form">
            <div className="category-section">
                <h3 className="category-title">Project Types</h3>
                <div className="options-grid">
                    {types.map(type => (
                        <div
                            key={type._id}
                            className={`option-pill ${currentTypes.includes(type._id) ? 'selected' : ''}`}
                            onClick={() => handleOptionClick('types', type._id)}
                        >
                            {type.name}
                        </div>
                    ))}
                </div>
            </div>
    
            <div className="category-section">
                <h3 className="category-title">Project Styles</h3>
                <div className="options-grid">
                    {styles.map(style => (
                        <div
                            key={style._id}
                            className={`option-pill ${currentStyles.includes(style._id) ? 'selected' : ''}`}
                            onClick={() => handleOptionClick('styles', style._id)}
                        >
                            {style.name}
                        </div>
                    ))}
                </div>
            </div>
    
            <div className="category-section">
                <h3 className="category-title">Project Subjects</h3>
                <div className="options-grid">
                    {subjects.map(subject => (
                        <div
                            key={subject._id}
                            className={`option-pill ${currentSubjects.includes(subject._id) ? 'selected' : ''}`}
                            onClick={() => handleOptionClick('subjects', subject._id)}
                        >
                            {subject.name}
                        </div>
                    ))}
                </div>
            </div>
    
            <div className="selection-summary">
                <div>Selected Types: {currentTypes.map(typeId => types.find(t => t._id === typeId)?.name).join(', ') || 'None'}</div>
                <div>Selected Styles: {currentStyles.map(styleId => styles.find(s => s._id === styleId)?.name).join(', ') || 'None'}</div>
                <div>Selected Subjects: {currentSubjects.map(subjectId => subjects.find(s => s._id === subjectId)?.name).join(', ') || 'None'}</div>
            </div>
    
            <div className="navigation-buttons">
                <button type="button" onClick={onBack} className="nav-button">
                    Back
                </button>
                <button type="submit" className="nav-button">
                    Next
                </button>
            </div>
        </form>
    );
};

export default ProjectCategories;