import { useState, useEffect } from "react";
import ProjectBasicInfo from "./components/ProjectBasicInfo";
import ProjectCategories from "./components/ProjectCategories";
import TeamMembers from "./components/TeamMembers";
import ImageUpload from "./components/ImageUpload";
import "./Modal.css";

function Modal({ isOpen, onClose, onProjectCreated, onProjectUpdated, userId, projectToEdit }) {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    url: "",
    status: "active",
    types: [],
    styles: [],
    subjects: [],
    images: [],
    owner: userId,
    team_members: [{ userId, username: "yourUser" }],
  });

  useEffect(() => {
    if (projectToEdit) {
      console.log('Setting project data:', projectToEdit);
      setProjectData({
        name: projectToEdit.name || "",
        description: projectToEdit.description || "",
        url: projectToEdit.url || "",
        status: projectToEdit.status || "active",
        types: projectToEdit.types?.map(type => type._id) || [],
        styles: projectToEdit.styles?.map(style => style._id) || [],
        subjects: projectToEdit.subjects?.map(subject => subject._id) || [],
        images: projectToEdit.images || [],
        owner: projectToEdit.owner?._id || userId,
        team_members: projectToEdit.team_members?.length 
          ? projectToEdit.team_members 
          : [{ userId, username: "yourUser" }]
      });
    }
  }, [projectToEdit, userId]);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", projectData.name);
      formData.append("description", projectData.description);
      formData.append("url", projectData.url);
      formData.append("status", projectData.status);
      formData.append("owner", projectData.owner);
  
      // Manejar tipos, estilos y temas
      projectData.types.forEach(typeId => formData.append("types", typeId));
      projectData.styles.forEach(styleId => formData.append("styles", styleId));
      projectData.subjects.forEach(subjectId => formData.append("subjects", subjectId));
      
      // Manejar miembros del equipo
      projectData.team_members.forEach(member => 
        formData.append("team_members", member.userId || member._id || member)
      );
  
      // Manejar imágenes
      if (projectData.images.length > 0) {
        // Limpiar formData de imágenes previas
        formData.delete("images");
        formData.delete("existingImages");
  
        projectData.images.forEach(image => {
          if (image instanceof File) {
            formData.append("images", image);
          } else if (image.url) {
            // Solo guardar la parte de la URL después del último '/'
            const urlParts = image.url.split('/');
            formData.append("existingImages", urlParts[urlParts.length - 1]);
          }
        });
      }
  
      console.log('Enviando datos:', {
        formDataEntries: Array.from(formData.entries()),
        projectData
      });
  
      if (projectToEdit) {
        await onProjectUpdated(projectToEdit._id, formData);
      } else {
        await onProjectCreated(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error al enviar proyecto:", error);
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
            isEditing={!!projectToEdit}
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
        <h2>{projectToEdit ? 'Edit Project' : 'Create New Project'} - Step {step} of 4</h2>
        {renderStep()}
      </div>
    </div>
  );
}

export default Modal;