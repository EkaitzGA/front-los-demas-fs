import React, { useState, useEffect } from 'react';
import { useFilters } from '../../context/FilterProvider';
import UserFilter from '../../components/searchFilter/UserFilter';
import { Link } from 'react-router-dom';
import { getUsers } from '../../utils/api/fetch';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CloseIcon from '@mui/icons-material/Close';
import './AllProfiles.css';

function AllProfiles() {
    const { userFilters } = useFilters();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        setIsAuthenticated(!!token);
        setCurrentUserId(userId);

        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await getUsers();
                if (response.success) {
                    setUsers(response.data);

                    if (token && userId) {
                        const currentUserResponse = await fetch(`http://localhost:3002/users/${userId}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (currentUserResponse.ok) {
                            const userData = await currentUserResponse.json();
                            setFollowingUsers(userData.following.map(user => user._id));
                        }
                    }
                } else {
                    throw new Error(response.message || 'Error fetching users');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleFollowClick = async (e, userId) => {
        e.preventDefault(); // Prevenir la navegación del Link

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
                    mainUserId: currentUserId,
                    userId: userId
                })
            });

            if (response.ok) {
                setFollowingUsers(prev => {
                    if (prev.includes(userId)) {
                        return prev.filter(id => id !== userId);
                    } else {
                        return [...prev, userId];
                    }
                });
            }
        } catch (error) {
            console.error('Error updating follow status:', error);
        }
    };

    const getSpecializationClass = (specialization) => {
        switch (specialization) {
            case 'UX/UI':
                return 'ux-ui';
            case 'Frontend':
                return 'frontend';
            case 'Backend':
                return 'backend';
            case 'Fullstack':
                return 'fullstack';
            default:
                return 'none';
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesCountry = !userFilters.country || user.country === userFilters.country;
        const matchesUsername = !userFilters.username ||
            user.username.toLowerCase().includes(userFilters.username.toLowerCase());
        const matchesSpecialization = !userFilters.specialization ||
            user.specialization === userFilters.specialization;

        return matchesCountry && matchesUsername && matchesSpecialization;
    });

    if (isLoading) {
        return <div className="users-page">Loading users...</div>;
    }

    if (error) {
        return <div className="users-page">Error: {error}</div>;
    }

    return (
        <div className="users-page">
            {showAuthModal && (
                <div className="auth-modal-overlay">
                    <div className="auth-modal">
                        <button className="close-modal" onClick={() => setShowAuthModal(false)}>
                            <CloseIcon />
                        </button>
                        <div className="auth-modal-content">
                            <h2>Authentication Required</h2>
                            <p>You need to be logged in to follow users</p>
                            <div className="auth-buttons">
                                <Link to="/auth?mode=login" className="auth-button login">
                                    Login
                                </Link>
                                <Link to="/auth?mode=register" className="auth-button register">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <UserFilter />
            <div className="users-grid">
                {filteredUsers.map(user => (
                    <div key={user._id} className={`user-card ${getSpecializationClass(user.specialization)}`}>
                        <Link
                            to={`/myprofile/${user._id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            className="user-card-content"
                        >
                            <p className={`specialization-tag ${getSpecializationClass(user.specialization)}`}>
                                {user.specialization}
                            </p>
                            <div className='user-image'>
                                <img src="./images/mancat.png" alt="" />
                            </div>
                            <h3>{user.username}</h3>
                            <p>{user.name} {user.lastname}</p>
                            <p>{user.country}</p>
                        </Link>
                        {isAuthenticated && currentUserId !== user._id && (
                            <button 
                                className={`follow-button-card ${followingUsers.includes(user._id) ? 'following' : ''}`}
                                onClick={(e) => handleFollowClick(e, user._id)}
                            >
                                {followingUsers.includes(user._id) ? (
                                    <>
                                        <PersonRemoveIcon />
                                        
                                    </>
                                ) : (
                                    <>
                                        <PersonAddIcon />
                                        
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllProfiles;