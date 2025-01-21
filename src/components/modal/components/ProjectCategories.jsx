import { useState, useEffect } from 'react';
import { getAllTypes, getAllStyles, getAllSubjects } from '../../../utils/api/fetch.js'
import './ProjectCategories.css'

const ProjectCategories = ({ projectData, setProjectData, onNext, onBack }) => {
    // Estados para almacenar los datos de la API
    const [types, setTypes] = useState([]);
    const [styles, setStyles] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleContinue = (e) => {
        e.preventDefault();
        if (projectData.types.length > 0 &&
            projectData.styles.length > 0 &&
            projectData.subjects.length > 0) {
            onNext();
        } else {
            alert('Please select at least one option from each category');
        }
    };

    // Cargar datos cuando el componente se monta
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Hacer todas las llamadas en paralelo
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

    // Resto del código igual, pero usando los nuevos estados
    const handleMultiSelect = (e, category) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setProjectData(prev => ({
            ...prev,
            [category]: selectedOptions
        }));
    };

    const handleOptionClick = (category, id) => {
        setProjectData(prev => {
            const currentSelection = prev[category];
            if (currentSelection.includes(id)) {
                return {
                    ...prev,
                    [category]: currentSelection.filter(item => item !== id)
                };
            } else {
                return {
                    ...prev,
                    [category]: [...currentSelection, id]
                };
            }
        });
    };

    if (isLoading) return <div>Loading categories...</div>;

    // return (
    //     <form onSubmit={handleContinue} className="flex flex-col gap-6">
    //         {/* Types Selection */}
    //         <div className="form-group">
    //             <label
    //                 htmlFor="types"
    //                 className="block mb-2 text-sm font-medium text-gray-900"
    //             >
    //                 Project Types (Select multiple)
    //             </label>
    //             <div
    //                 id="types"
    //                 name="types"
    //                 multiple
    //                 value={projectData.types}
    //                 onChange={(e) => handleMultiSelect(e, 'types')}
    //                 required
    //                 className="options-container"                >
    //                 {types.map(type => (
                        
    //                     <div
    //                         key={type._id}
    //                         className={`category-option ${projectData.types.includes(type._id) ? 'selected' : ''}`}
    //                         onClick={() => handleOptionClick('types', type._id)}
    //                     >
    //                         {type.name}
    //                     </div>
    //                 ))}
    //             </div>
                
    //         </div>

    //         <div className="form-group">
    //             <label
    //                 htmlFor="styles"
    //                 className="block mb-2 text-sm font-medium text-gray-900"
    //             >
    //                 Project Styles (Select multiple)
    //             </label>
    //             <div
    //                 id="styles"
    //                 name="styles"
    //                 multiple
    //                 value={projectData.styles}
    //                 onChange={(e) => handleMultiSelect(e, 'styles')}
    //                 required
    //                 className="options-container"                >
    //                 {styles.map(style => (
                        
    //                     <div
    //                         key={style._id}
    //                         className={`category-option ${projectData.styles.includes(style._id) ? 'selected' : ''}`}
    //                         onClick={() => handleOptionClick('styles', style._id)}
    //                     >
    //                         {style.name}
    //                     </div>
    //                 ))}
    //             </div>
                
    //         </div>

    //         <div className="form-group">
    //             <label
    //                 htmlFor="subjects"
    //                 className="block mb-2 text-sm font-medium text-gray-900"
    //             >
    //                 Project Subjects (Select multiple)
    //             </label>
    //             <div
    //                 id="subjects"
    //                 name="subjects"
    //                 multiple
    //                 value={projectData.subjects}
    //                 onChange={(e) => handleMultiSelect(e, 'subjects')}
    //                 required
    //                 className="options-container"                >
    //                 {subjects.map(subject => (
                        
    //                     <div
    //                     key={subject._id}
    //                     className={`category-option ${projectData.subjects.includes(subject._id) ? 'selected' : ''}`}
    //                     onClick={() => handleOptionClick('subjects', subject._id)}
    //                 >
    //                     {subject.name}
    //                 </div>
    //                 ))}
    //             </div>
                
    //         </div>

    //         <div className="space-y-4">
    //             <div className="text-sm">
    //                 <span className="font-medium">Selected Types: </span>
    //                 {projectData.types.map(typeId =>
    //                     types.find(t => t._id === typeId)?.name
    //                 ).join(', ') || 'None'}
    //             </div>
    //             <div className="text-sm">
    //                 <span className="font-medium">Selected Styles: </span>
    //                 {projectData.styles.map(styleId =>
    //                     styles.find(s => s._id === styleId)?.name
    //                 ).join(', ') || 'None'}
    //             </div>
    //             <div className="text-sm">
    //                 <span className="font-medium">Selected Subjects: </span>
    //                 {projectData.subjects.map(subjectId =>
    //                     subjects.find(s => s._id === subjectId)?.name
    //                 ).join(', ') || 'None'}
    //             </div>
    //         </div>

    //         <div className="flex justify-between mt-6">
    //             <button
    //                 type="button"
    //                 onClick={onBack}
    //                 className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    //             >
    //                 Back
    //             </button>
    //             <button
    //                 type="submit"
    //                 className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    //             >
    //                 Next
    //             </button>
    //         </div>
    //     </form>
    // );

    return (
        <form onSubmit={handleContinue} className="categories-form">
            {/* Types Selection */}
            <div className="category-section">
                <h3 className="category-title">Project Types</h3>
                <div className="options-grid">
                    {types.map(type => (
                        <div
                            key={type._id}
                            className={`option-pill ${projectData.types.includes(type._id) ? 'selected' : ''}`}
                            onClick={() => handleOptionClick('types', type._id)}
                        >
                            {type.name}
                        </div>
                    ))}
                </div>
            </div>
    
            {/* Styles Selection */}
            <div className="category-section">
                <h3 className="category-title">Project Styles</h3>
                <div className="options-grid">
                    {styles.map(style => (
                        <div
                            key={style._id}
                            className={`option-pill ${projectData.styles.includes(style._id) ? 'selected' : ''}`}
                            onClick={() => handleOptionClick('styles', style._id)}
                        >
                            {style.name}
                        </div>
                    ))}
                </div>
            </div>
    
            {/* Subjects Selection */}
            <div className="category-section">
                <h3 className="category-title">Project Subjects</h3>
                <div className="options-grid">
                    {subjects.map(subject => (
                        <div
                            key={subject._id}
                            className={`option-pill ${projectData.subjects.includes(subject._id) ? 'selected' : ''}`}
                            onClick={() => handleOptionClick('subjects', subject._id)}
                        >
                            {subject.name}
                        </div>
                    ))}
                </div>
            </div>
    
            <div className="selection-summary">
                <div>Selected Types: {projectData.types.map(typeId => types.find(t => t._id === typeId)?.name).join(', ')}</div>
                <div>Selected Styles: {projectData.styles.map(styleId => styles.find(s => s._id === styleId)?.name).join(', ')}</div>
                <div>Selected Subjects: {projectData.subjects.map(subjectId => subjects.find(s => s._id === subjectId)?.name).join(', ')}</div>
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
