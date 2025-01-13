import { Link } from 'react-router-dom';

import './ProjectContainer.css'

function ProjectContainer({ img, user_name, id, publication_date, link }) {
    return (
        <div className='project-container-dsk'>
            <div className='image-container'>
                <Link to={`/webproject/${id}`} className="image-link">
                    <img
                        src={img}
                        alt={`Project by ${user_name}`}
                    />
                </Link>
                <a href={link} target="_blank" rel="noopener noreferrer">
                    <button></button>
                </a>

            </div>
            <div className='project-info-dsk'>
                <p>{user_name}</p>
                <p>{publication_date}</p>
            </div>
        </div>
    )
}

export default ProjectContainer;