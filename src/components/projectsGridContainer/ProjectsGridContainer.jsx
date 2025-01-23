import React, { useState, useEffect } from "react";
import { getProjects } from "../../utils/api/fetch";
import ProjectContainer from "../projectContainer/ProjectContainer";
import NewProjectButton from "../projectContainer/NewProjectButton";
import Modal from "../modal/Modal";
import { createOwnProject } from "../../utils/api/fetch.js";
import "./ProjectsGridContainer.css";

const ProjectsGridContainer = ({
  userId,
  projectsData,
  isFavorites = false,
  showNewProjectButton = false,
}) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewProject = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProjectCreated = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const fetchOptions = {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      };
  
      const response = await fetch(
        "http://localhost:3002/projects",
        fetchOptions
      );
      const responseData = await response.json();
  
      if (response.ok) {
        setProjects((prevProjects) => [...prevProjects, responseData]); // Actualiza la lista de proyectos
        setIsModalOpen(false); // Cierra el modal
      } else {
        throw new Error(responseData.message || "Error creating project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };
  //SI LA URL EMPIEZA POR HTTP SE MANTIENE Y SI NO SE LE AÑADE LOCALHOST:3002/
  const checkUrls = (url) => {
    if (url.startsWith("http")) {
      return url;
    } else {
      return import.meta.env.VITE_BACKEND_URL +"/"+ url;
    }
  };

  useEffect(() => {
    if (isFavorites && projectsData) {
      setProjects(projectsData);
      setIsLoading(false);
      return;
    }
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getProjects();
        if (!response.success) {
          throw new Error(response.message || "Error fetching projects");
        }
        console.log("Projects:", response.data);
        // Filtramos los proyectos donde el owner._id coincida con nuestro userId
        const userProjects = response.data.filter(
          (project) => project.owner && project.owner._id === userId
        );

        setProjects(userProjects);
      } catch (err) {
        setError(err.message);
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchProjects();
    }
  }, [userId, projectsData, isFavorites]);

  const loggedUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Verificar si el usuario está logueado y si está viendo su propio perfil
  const isOwnProfile = loggedUserId && token && loggedUserId === userId;

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error loading projects: {error}</div>;
  }

  if (!projects || projects.length === 0) {
    return (
      <div>
        {/* Aquí agregamos el Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onProjectCreated={handleProjectCreated}
          userId={userId}
        />

        {/* Resto del código existente */}
        {showNewProjectButton && isOwnProfile && (
          <div className="mb-4-no-project">
            <NewProjectButton onClick={handleNewProject} />
          </div>
        )}
        {isOwnProfile ? (
          <p>Load your first Project!</p>
        ) : (
          <p>This user has no projects yet</p>
        )}
      </div>
    );
  }

  return (
    <section className="section-grid">
      <div className="projects-grid-dsk">
        {showNewProjectButton && isOwnProfile && (
          <div className="mb-4">
            <NewProjectButton onClick={handleNewProject} />
          </div>
        )}

        {projects.map((project) => (
          <ProjectContainer
            key={project._id}
            _id={project._id}
            img={checkUrls(project.images?.[0]?.url || "https://via.placeholder.com/300")}
            owner={project.owner}
            date={project.date}
            url={project.url}
            likes={project.likes}
          />
        ))}

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onProjectCreated={handleProjectCreated}
          userId={userId}
        />
      </div>
    </section>
  );
};

export default ProjectsGridContainer;
