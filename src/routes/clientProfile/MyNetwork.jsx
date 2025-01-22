import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CloseIcon from '@mui/icons-material/Close';
import './MyNetwork.css';

function MyNetwork({ userData }) {
    const followers = userData?.followers || [];
    const following = userData?.following || [];
    const [followingUsers, setFollowingUsers] = useState(new Set());
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        if (token && userId) {
            // Convertir el array de following a un Set de IDs para búsqueda rápida
            const followingIds = new Set(following.map(user => user._id));
            setFollowingUsers(followingIds);
        }
    }, [following, userId]);

    const handleFollowClick = async (targetUserId) => {
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3002/users/follow', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    mainUserId: userId,
                    userId: targetUserId
                })
            });

            if (response.ok) {
                setFollowingUsers(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(targetUserId)) {
                        newSet.delete(targetUserId);
                    } else {
                        newSet.add(targetUserId);
                    }
                    return newSet;
                });
            }
        } catch (error) {
            console.error('Error updating follow status:', error);
        }
    };

    const NetworkUserCard = ({ user }) => {
        const isFollowing = followingUsers.has(user._id);
        const isCurrentUser = userId === user._id;

        return (
            <div className="user-card-network">
                <div className="user-info">
                    <Link to={`/myprofile/${user._id}`} className="username-link">
                        {user.username}
                    </Link>
                    <span className="specialization">{user.specialization}</span>
                </div>
                {isAuthenticated && !isCurrentUser && (
                    <button 
                        className={`network-follow-button ${isFollowing ? 'following' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            handleFollowClick(user._id);
                        }}
                    >
                        {isFollowing ? (
                            <>
                                <PersonRemoveIcon />
                                <span className="button-text"></span>
                            </>
                        ) : (
                            <>
                                <PersonAddIcon />
                                <span className="button-text"></span>
                            </>
                        )}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="followers-following">
            {showAuthModal && (
                <div className="network-auth-modal-overlay">
                    <div className="network-auth-modal">
                        <button className="network-close-modal" onClick={() => setShowAuthModal(false)}>
                            <CloseIcon />
                        </button>
                        <div className="network-auth-modal-content">
                            <h2>Authentication Required</h2>
                            <p>You need to be logged in to follow users</p>
                            <div className="network-auth-buttons">
                                <Link to="/auth?mode=login" className="network-auth-button login">
                                    Login
                                </Link>
                                <Link to="/auth?mode=register" className="network-auth-button register">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="network-container">
                <div className="column-followers">
                    <h2>Followers ({followers.length})</h2>
                    {followers.map(follower => (
                        <NetworkUserCard key={follower._id} user={follower} />
                    ))}
                </div>
                
                <div className="column-following">
                    <h2>Following ({following.length})</h2>
                    {following.map(follow => (
                        <NetworkUserCard key={follow._id} user={follow} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyNetwork;