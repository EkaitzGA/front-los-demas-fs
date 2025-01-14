import { useParams } from 'react-router-dom';
import { projects } from '../../data/projects';
import { getRelativeTime } from '../../utils/dateUtils'
import './ProjectPage.css'

function ProjectPage() {
    const { _id } = useParams();
    const project = projects.find(p => p._id === parseInt(_id));

    if (!project) {
        return <div>Proyecto no encontrado</div>;
    }

    return (
        <div className='single-project-container-dsk'>
            <div className='first-line-dsk'>
                <h1>{project.name} from {project.owner}</h1>
            </div>

            <div className='left-column-first-line'>
                <img src={project.img} alt="Project" />
            </div>

            <div className='left-column-second-line'>
                <div>
                    <h5>STYLES</h5>
                    <p>{project.styles}</p>
                </div>
                <div>
                    <h5>TYPES</h5>
                    <p>{project.types}</p>
                </div>
                <div>
                    <h5>SUBJECTS</h5>
                    <p>{project.subjects}</p>
                </div>
            </div>

            <div className='second-column'>
                <a href={project.url}>Visit Website: {project.url}</a>
                <p>{project.owner}</p>
                <p>Collaborators: {project.team_members}</p>
                <p>{project.description}</p>
                <p>Likes: {project.likes}</p>
                <p>Published: {getRelativeTime(project.date)}</p>
            </div>

        </div>
    );
}

export default ProjectPage;