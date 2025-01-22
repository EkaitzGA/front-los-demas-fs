// Modal.jsx - Componente principal
import { useState } from 'react';
import ProjectBasicInfo from './components/ProjectBasicInfo';
import ProjectCategories from './components/ProjectCategories';
import TeamMembers from './components/TeamMembers';
import ImageUpload from './components/ImageUpload';
import './Modal.css';

function Modal({ isOpen, onClose, onProjectCreated, userId }) {
    const [step, setStep] = useState(1);
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        url: '',
        status: 'active',
        types: [],
        styles: [],
        subjects: [],
        images: [],
        owner: userId,
        team_members: [{userId,username:"yourUser"}],
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        try {
            // Lógica de submit
            const newProjectData = projectData;
            newProjectData.team_members = newProjectData.team_members.map(user=>user.userId)
            onProjectCreated(newProjectData);
            onClose();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    if (!isOpen) return null;

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <ProjectBasicInfo 
                        projectData={projectData}
                        setProjectData={setProjectData}
                        onNext={nextStep}
                    />
                );
            case 2:
                return (
                    <ProjectCategories
                        projectData={projectData}
                        setProjectData={setProjectData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 3:
                return (
                    <TeamMembers
                        projectData={projectData}
                        setProjectData={setProjectData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 4:
                return (
                    <ImageUpload
                        projectData={projectData}
                        setProjectData={setProjectData}
                        onSubmit={handleSubmit}
                        onBack={prevStep}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Create New Project - Step {step} of 4</h2>
                {renderStep()}
            </div>
        </div>
    );
}

export default Modal;