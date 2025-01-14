import { useParams } from 'react-router-dom';
import { projects } from '../../data/projects';
import './ProjectPage.css'

function ProjectPage () {
    const { id } = useParams();
    const project = projects.find(p => p.id === parseInt(id));

    if (!project) {
        return <div>Proyecto no encontrado</div>;
    }

    return (
        <div>
            <h1>Proyecto de {project.user_name}</h1>
            <img src={project.img} alt="Project" />
            <p>Publicado: {project.publication_date}</p>
            <a href={project.link}>Visitar sitio</a>
        </div>
    );
}

export default ProjectPage;