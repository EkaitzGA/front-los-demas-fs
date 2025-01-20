import { Link } from 'react-router-dom';
import './MyNetwork.css'

function MyNetwork({ userData }) {
    const followers = userData?.followers || [];
    const following = userData?.following || [];

    return (
        <div className="followers-following">
            <div className="network-container">
                <div className="column-followers">
                    <h2>Followers ({followers.length})</h2>
                    {followers.map(follower => (
                        <div key={follower._id} className="user-card-network">
                            <Link to={`/users/${follower._id}`} className="username-link">
                                {follower.username}
                            </Link>
                            <span className="specialization">{follower.specialization}</span>
                        </div>
                    ))}
                </div>
                
                <div className="column-following">
                    <h2>Following ({following.length})</h2>
                    {following.map(follow => (
                        <div key={follow._id} className="user-card-network">
                            <Link to={`/users/${follow._id}`} className="username-link">
                                {follow.username}
                            </Link>
                            <span className="specialization">{follow.specialization}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyNetwork;