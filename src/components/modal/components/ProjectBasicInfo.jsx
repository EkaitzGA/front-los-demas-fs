
const ProjectBasicInfo = ({ projectData, setProjectData, onNext }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContinue = (e) => {
        e.preventDefault();
        if (projectData.name && projectData.description && projectData.url) {
            onNext();
        }
    };

    return (
        <form onSubmit={handleContinue} className="flex flex-col gap-6">
            <div className="form-group">
                <label 
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Project Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={projectData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter project name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
            </div>

            <div className="form-group">
                <label 
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={projectData.description}
                    onChange={handleChange}
                    required
                    placeholder="Describe your project"
                    rows="4"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
            </div>

            <div className="form-group">
                <label 
                    htmlFor="url"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Project URL
                </label>
                <input
                    type="url"
                    id="url"
                    name="url"
                    value={projectData.url}
                    onChange={handleChange}
                    required
                    placeholder="https://example.com"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
            </div>

            <div className="flex justify-end mt-6">
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                    Next
                </button>
            </div>
        </form>
    );
};

export default ProjectBasicInfo;