import { useParams } from 'react-router-dom';
import './ProjectPage.css'

function ProjectPage () {
    const { id } = useParams();

    return (
        <div>
            <h1>Proyecto ID: {id}</h1>
        </div>
    )
}

export default ProjectPage;