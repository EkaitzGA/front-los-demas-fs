const ProjectCategories = ({ projectData, setProjectData, onNext, onBack }) => {
    // Datos de prueba
    const mockTypes = [
        { _id: '1', name: 'Website' },
        { _id: '2', name: 'Mobile App' },
        { _id: '3', name: 'Desktop App' },
        { _id: '4', name: 'UI/UX Design' },
        { _id: '5', name: 'Branding' }
    ];

    const mockStyles = [
        { _id: '1', name: 'Modern' },
        { _id: '2', name: 'Minimalist' },
        { _id: '3', name: 'Classic' },
        { _id: '4', name: 'Futuristic' },
        { _id: '5', name: 'Retro' }
    ];

    const mockSubjects = [
        { _id: '1', name: 'Technology' },
        { _id: '2', name: 'Business' },
        { _id: '3', name: 'Education' },
        { _id: '4', name: 'Entertainment' },
        { _id: '5', name: 'Health' }
    ];

    const handleMultiSelect = (e, category) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setProjectData(prev => ({
            ...prev,
            [category]: selectedOptions
        }));
    };

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

    return (
        <form onSubmit={handleContinue} className="flex flex-col gap-6">
            {/* Types Selection */}
            <div className="form-group">
                <label 
                    htmlFor="types"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Project Types (Select multiple)
                </label>
                <select
                    id="types"
                    name="types"
                    multiple
                    value={projectData.types}
                    onChange={(e) => handleMultiSelect(e, 'types')}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 min-h-[120px]"
                >
                    {mockTypes.map(type => (
                        <option key={type._id} value={type._id}>
                            {type.name}
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                    Hold Ctrl (Windows) or Cmd (Mac) to select multiple types
                </p>
            </div>

            {/* Styles Selection */}
            <div className="form-group">
                <label 
                    htmlFor="styles"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Project Styles (Select multiple)
                </label>
                <select
                    id="styles"
                    name="styles"
                    multiple
                    value={projectData.styles}
                    onChange={(e) => handleMultiSelect(e, 'styles')}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 min-h-[120px]"
                >
                    {mockStyles.map(style => (
                        <option key={style._id} value={style._id}>
                            {style.name}
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                    Hold Ctrl (Windows) or Cmd (Mac) to select multiple styles
                </p>
            </div>

            {/* Subjects Selection */}
            <div className="form-group">
                <label 
                    htmlFor="subjects"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Project Subjects (Select multiple)
                </label>
                <select
                    id="subjects"
                    name="subjects"
                    multiple
                    value={projectData.subjects}
                    onChange={(e) => handleMultiSelect(e, 'subjects')}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 min-h-[120px]"
                >
                    {mockSubjects.map(subject => (
                        <option key={subject._id} value={subject._id}>
                            {subject.name}
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                    Hold Ctrl (Windows) or Cmd (Mac) to select multiple subjects
                </p>
            </div>

            {/* Selected Items Preview */}
            <div className="space-y-4">
                <div className="text-sm">
                    <span className="font-medium">Selected Types: </span>
                    {projectData.types.map(typeId => 
                        mockTypes.find(t => t._id === typeId)?.name
                    ).join(', ') || 'None'}
                </div>
                <div className="text-sm">
                    <span className="font-medium">Selected Styles: </span>
                    {projectData.styles.map(styleId => 
                        mockStyles.find(s => s._id === styleId)?.name
                    ).join(', ') || 'None'}
                </div>
                <div className="text-sm">
                    <span className="font-medium">Selected Subjects: </span>
                    {projectData.subjects.map(subjectId => 
                        mockSubjects.find(s => s._id === subjectId)?.name
                    ).join(', ') || 'None'}
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                    Next
                </button>
            </div>
        </form>
    );
};

export default ProjectCategories;