import { Link } from 'react-router-dom';
import { getRelativeTime } from '../../utils/dateUtils'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import './ProjectContainer.css'

function ProjectContainer({ img, owner, _id, date, url, likes, showInfo = true }) {
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
                    <button>Go!</button>
                </a>

            </div>

            {showInfo && (
                <div className='project-info-dsk'>
                    <div className='info-main-row'>
                        <Link to={`/myprofile/${owner._id}`}>
                            <p>{owner.name} {owner.lastname}</p>
                        </Link>
                        <div className='likes-container'>
                            <FavoriteBorderIcon />
                            <span>{likes}</span>
                        </div>
                    </div>
                    <p className='date-text'>{getRelativeTime(date)}</p>
                </div>
            )}
        </div>
    )
}

export default ProjectContainer;