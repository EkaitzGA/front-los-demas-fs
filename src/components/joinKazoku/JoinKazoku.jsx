import { Link } from 'react-router-dom';
import './JoinKazoku.css'

function JoinKazoku () {
    const token = localStorage.getItem('token');

    return (
        // <div className='join-kazoku'>
        // <h1>Are you a web developer? Join the community that understands your challenges.</h1>
        // <button>START NOW</button>
        // </div>
        <div className='join-kazoku'>
            <h1>Are you a web developer? Join the community that understands your challenges.</h1>
            {!token && (
                <Link to="/auth?mode=login">
                    <button>START NOW</button>
                </Link>
            )}
        </div>
    )
}

export default JoinKazoku;