import { Link } from 'react-router-dom';
import { getRelativeTime } from '../../utils/dateUtils'

import './ProjectContainer.css'

function ProjectContainer({ img, owner, _id, date, url, showInfo = true }) {
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
            {showInfo && (  // Solo muestra esta sección si showInfo es true
                <div className='project-info-dsk'>
                    <Link to={`/myprofile/${owner._id}`}>
                        <p>{owner.name} {owner.lastname}</p>
                    </Link>
                    <p>{getRelativeTime(date)}</p>
                </div>
            )}
        </div>
    )
}

export default ProjectContainer;