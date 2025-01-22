import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { updateUserProfile } from '../../utils/api/fetch';
import './UserInfoContainer.css';

const UserInfoContainer = ({ userData, onProfileUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tempData, setTempData] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    console.log('userData recibido:', userData);

    const [profileData, setProfileData] = useState({
        location: { city: '', country: '' },
        agency: '',
        contact: {
            email: '',
            website: [],
            github: '',
            linkedin: '',
            instagram: ''
        }
    });

    const userId = localStorage.getItem('userId');
    console.log('userId:', userId);
    const isOwner = userId && userData?._id && userId === userData._id.toString();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        if (token && userId && userData?._id) {
            checkIfFollowing();
        }

        if (userData) {
            setProfileData({
                location: {
                    city: userData.city || '',
                    country: userData.country || ''
                },
                agency: userData.description || '',
                name: userData.name || '',
                lastname: userData.lastname || '',
                specialization: userData.specialization || '',
                avatar: userData.avatar || '',
                contact: {
                    email: userData.email || '',
                    website: Array.isArray(userData.website)
                        ? userData.website
                        : userData.website
                            ? [userData.website]
                            : [],
                    github: userData.github || '',
                    linkedin: userData.linkedin || '',
                    instagram: userData.instagram || ''
                }
            });
        }
    }, [userData]);

    const checkIfFollowing = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3002/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const currentUserData = await response.json();
                setIsFollowing(currentUserData.following.some(user => user._id === userData._id));
            }
        } catch (error) {
            console.error('Error checking following status:', error);
        }
    };

    const handleFollowClick = async () => {
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
                    userId: userData._id
                })
            });

            if (response.ok) {
                setIsFollowing(!isFollowing);
            }
        } catch (error) {
            console.error('Error updating follow status:', error);
        }
    };

    const formatUrlForBackend = (urlString) => {
        if (!urlString) return [];

        // Dividir por comas y limpiar espacios
        const urlArray = urlString.split(',').map(url => url.trim()).filter(url => url !== '');

        return urlArray.map(url => {
            // Si ya tiene http:// o https://, lo dejamos como está
            if (url.match(/^https?:\/\//)) {
                return url;
            }

            // Si empieza con www., añadimos https://
            if (url.startsWith('www.')) {
                return `https://${url}`;
            }

            // Si no tiene ningún prefijo, añadimos https://www.
            return `https://www.${url}`;
        });
    };

    const handleChange = (e, section, subsection = null) => {
        let value = e.target.value;

        if (section === 'contact' && subsection === 'website') {
            // Guardamos la URL limpia para mostrar al usuario

            setProfileData(prev => ({
                ...prev,
                contact: {
                    ...prev.contact,
                    website: value
                }
            }));
        } else if (subsection) {
            setProfileData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [subsection]: value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [section]: value
            }));
        }
    };

    const updateUser = async (userId, data) => {
        const websiteArray = formatUrlForBackend(data.contact.website);

        const updateData = {
            city: data.location.city,
            country: data.location.country,
            description: data.agency,
            name: data.name,
            lastname: data.lastname,
            specialization: data.specialization,
            avatar: data.avatar,
            email: data.contact.email,
            website: websiteArray,
            github: data.contact.github,
            linkedin: data.contact.linkedin,
            instagram: data.contact.instagram
        };
        console.log('Datos a enviar al backend:', updateData);
        try {
            const response = await updateUserProfile(userId, updateData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update profile');
            }
            return response.data;
        } catch (error) {
            console.error('Error in updateUser:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!userId) {
            setError('Error: User ID not found');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Intentando actualizar usuario con ID:', userId);
            const result = await updateUser(userId, profileData);
            console.log('Update result:', result);

            if (result) {
                setIsEditing(false);
                const updatedData = {
                    location: {
                        city: result.city || '',
                        country: result.country || ''
                    },
                    agency: result.description || '',
                    name: result.name || '',
                    lastname: result.lastname || '',
                    specialization: result.specialization || '',
                    avatar: result.avatar || '',
                    contact: {
                        email: result.email || '',
                        website: Array.isArray(result.website) ? result.website[0] || '' : result.website || '',
                        github: result.github || '',
                        linkedin: result.linkedin || '',
                        instagram: result.instagram || ''
                    }
                };

                setProfileData(updatedData);

                if (onProfileUpdate) {
                    onProfileUpdate(result);
                }
            }
        } catch (err) {
            setError('Error updating profile. Please try again.');
            console.error('Error in handleSubmit:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!userData) {
        return null;
    }

    return (
        <section id="profile" className="section-profile">
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

            {error && <div className="error-message">{error}</div>}

            {/* Botón de Follow/Unfollow */}
            {!isOwner && (
                <button
                    className={`follow-button ${isFollowing ? 'following' : ''}`}
                    onClick={handleFollowClick}
                >
                    {isFollowing ? (
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

            {isEditing && !isOwner ? (
                <div className="error-message">You are not authorized to edit this profile</div>
            ) : isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="profile-container">
                        <div className="personal-info-block">
                            <h3>PERSONAL INFO</h3>
                            <input
                                type="text"
                                placeholder="Name"
                                value={profileData.name}
                                onChange={(e) => handleChange(e, 'name')}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={profileData.lastname}
                                onChange={(e) => handleChange(e, 'lastname')}
                            />
                        </div>
                        <div className="location-block">
                            <h3>LOCATION</h3>
                            <input
                                type="text"
                                placeholder="City"
                                value={profileData.location.city}
                                onChange={(e) => handleChange(e, 'location', 'city')}
                            />
                            <input
                                type="text"
                                placeholder="Country"
                                value={profileData.location.country}
                                onChange={(e) => handleChange(e, 'location', 'country')}
                            />
                        </div>

                        <div className="agency-block">
                            <h3>DESCRIPTION</h3>
                            <textarea
                                placeholder="Description"
                                value={profileData.agency}
                                onChange={(e) => handleChange(e, 'agency')}
                            />
                        </div>

                        <div className="specialization-block">
                            <h3>SPECIALIZATION</h3>
                            <select
                                value={profileData.specialization}
                                onChange={(e) => handleChange(e, 'specialization')}
                            >
                                <option value="None">None</option>
                                <option value="UX/UI">UX/UI</option>
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="Fullstack">Fullstack</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Data">Data</option>
                            </select>
                        </div>

                        <div className="contact-block">
                            <h3>CONTACT</h3>
                            <input
                                type="email"
                                placeholder="Email"
                                value={profileData.contact.email}
                                onChange={(e) => handleChange(e, 'contact', 'email')}
                            />
                            <input
                                type="text"
                                placeholder="Websites (separate multiple with commas)"
                                value={profileData.contact.website}
                                onChange={(e) => handleChange(e, 'contact', 'website')}
                            />
                            <input
                                type="text"
                                placeholder="Github"
                                value={profileData.contact.github}
                                onChange={(e) => handleChange(e, 'contact', 'github')}
                            />
                            <input
                                type="text"
                                placeholder="Linkedin"
                                value={profileData.contact.linkedin}
                                onChange={(e) => handleChange(e, 'contact', 'linkedin')}
                            />
                            <input
                                type="text"
                                placeholder="Instagram"
                                value={profileData.contact.instagram}
                                onChange={(e) => handleChange(e, 'contact', 'instagram')}
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button
                            type="submit"
                            className="save-button"
                            disabled={isLoading}
                        >
                            <CheckIcon />
                        </button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                                setIsEditing(false);
                                setProfileData(tempData);
                                setTempData(null);
                            }}
                            disabled={isLoading}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="profile-container">
                        <div className="location-block">
                            <h3>LOCATION</h3>
                            <address>
                                {profileData.location.city && <p>{profileData.location.city}</p>}
                                {profileData.location.country && <p>{profileData.location.country}</p>}
                            </address>
                        </div>

                        <div className="agency-block">
                            <h3>DESCRIPTION</h3>
                            {profileData.agency ? <p>{profileData.agency}</p> : <p>No description provided</p>}
                        </div>
                      
                        <div className="contact-block">
                            <h3>CONTACT</h3>
                            <div className="contact-info">
                                <div className="contact-row">
                                    <span className="label">Email</span>
                                    {profileData.contact.email ?
                                        <a href={`mailto:${profileData.contact.email}`}>{profileData.contact.email}</a> :
                                        <span className="empty-field">No email provided</span>
                                    }
                                </div>
                                <div className="contact-row">
                                    <span className="label">Website</span>
                                    {Array.isArray(profileData.contact.website) && profileData.contact.website.length > 0 ? (
                                        <div className="website-list">
                                            {profileData.contact.website.map((site, index) => (
                                                <div key={index}>
                                                    <a
                                                        href={site}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {site.replace(/^https?:\/\/(www\.)?/, '')}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="empty-field">No website provided</span>
                                    )}
                                </div>
                                <div className="contact-row">
                                    <span className="label">Linkedin</span>
                                    {profileData.contact.linkedin ?
                                        <a href={`https://linkedin.com/in/${profileData.contact.linkedin}`} target="_blank" rel="noopener noreferrer">
                                            {profileData.contact.linkedin}
                                        </a> :
                                        <span className="empty-field">No Linkedin provided</span>
                                    }
                                </div>
                                <div className="contact-row">
                                    <span className="label">Instagram</span>
                                    {profileData.contact.instagram ?
                                        <a href={`https://instagram.com/${profileData.contact.instagram}`} target="_blank" rel="noopener noreferrer">
                                            {profileData.contact.instagram}
                                        </a> :
                                        <span className="empty-field">No Instagram provided</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {isOwner && (
                        <button
                            className="edit-button"
                            onClick={() => {
                                setTempData({ ...profileData });
                                setIsEditing(true);
                            }}
                        >
                            <EditIcon />
                        </button>
                    )}
                </>
            )}
        </section>
    );
};

export default UserInfoContainer;