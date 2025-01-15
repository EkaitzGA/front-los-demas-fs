import { Link } from 'react-router-dom';
import { getRelativeTime } from '../../utils/dateUtils'

import './ProjectContainer.css'

function ProjectContainer({ img, owner, _id, date, url }) {
    return (
        <div className='project-container-dsk'>
            <div className='image-container'>
                <Link to={`/webproject/${_id}`} className="image-link">
                    <img
                        src={img}
                        alt={`Project by ${owner.username}`} 
                    />
                </Link>
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <button></button>
                </a>

            </div>
            <div className='project-info-dsk'>
                <p>{owner.name} {owner.lastname}</p>
                <p>{getRelativeTime(date)}</p>
            </div>
        </div>
    )
}

export default ProjectContainer;