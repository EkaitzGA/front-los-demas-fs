// ProjectBasicInfo.jsx
export default function ProjectBasicInfo({ projectData, setProjectData, onNext }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContinue = (e) => {
        e.preventDefault();
        // Validación básica
        if (projectData.name && projectData.description && projectData.url) {
            onNext();
        }
    };

    return (
        <form onSubmit={handleContinue}>
            <div className="form-group">
                <label htmlFor="name">Project Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={projectData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            {/* ...otros campos... */}
            <button type="submit">Next</button>
        </form>
    );
}