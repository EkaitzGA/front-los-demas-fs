import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const UserInfoContainer = ({ userData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState({
        location: { city: '', country: '' },
        agency: '',
        contact: {
            email: '',
            website: '',
            github: '',
            linkedin: '',
            instagram: ''
        }
    });

    // Obtener el ID del usuario logueado
    const loggedUserId = localStorage.getItem('userId');

    // Comprobar si el usuario actual es el propietario del perfil
    const isOwner = loggedUserId && userData?._id && loggedUserId === userData._id.toString();


    useEffect(() => {
        if (userData) {
            setProfileData({
                location: {
                    city: userData.city || '',
                    country: userData.country || ''
                },
                agency: userData.description || '',
                contact: {
                    email: userData.email || '',
                    website: userData.website || '',
                    github: userData.github || '',
                    linkedin: userData.linkedin || '',
                    instagram: userData.instagram || ''
                }
            });
        }
    }, [userData]);

    const handleChange = (e, section, subsection = null) => {
        if (subsection) {
            setProfileData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [subsection]: e.target.value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [section]: e.target.value
            }));
        }
    };

    const updateUserProfile = async (userId, data) => {
        // Transformar los datos al formato que espera el backend
        const updateData = {
            city: data.location.city,
            country: data.location.country,
            description: data.agency,
            email: data.contact.email,
            website: data.contact.website,
            github: data.contact.github,
            linkedin: data.contact.linkedin,
            instagram: data.contact.instagram
        };

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await updateUserProfile(userData.id, profileData);
            setIsEditing(false);
            // Actualizar los datos locales con la respuesta del servidor
            if (result) {
                setProfileData({
                    location: {
                        city: result.city || '',
                        country: result.country || ''
                    },
                    agency: result.description || '',
                    contact: {
                        email: result.email || '',
                        website: result.website || '',
                        github: result.github || '',
                        linkedin: result.linkedin || '',
                        instagram: result.instagram || ''
                    }
                });
            }
        } catch (err) {
            setError('Error updating profile. Please try again.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!userData) {
        return null;
    }

    return (
        <section id="profile" className="section-profile">
            {error && <div className="error-message">{error}</div>}

            {isEditing && !isOwner ? (
                <div className="error-message">You are not authorized to edit this profile</div>
            ) : isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="profile-container">
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

                        <div className="contact-block">
                            <h3>CONTACT</h3>
                            <input
                                type="email"
                                placeholder="Email"
                                value={profileData.contact.email}
                                onChange={(e) => handleChange(e, 'contact', 'email')}
                            />
                            <input
                                type="url"
                                placeholder="Website"
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
                            onClick={() => setIsEditing(false)}
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
                                    {profileData.contact.website ?
                                        <a href={`https://${profileData.contact.website}`} target="_blank" rel="noopener noreferrer">
                                            {profileData.contact.website}
                                        </a> :
                                        <span className="empty-field">No website provided</span>
                                    }
                                </div>
                                <div className="contact-row">
                                    <span className="label">Github</span>
                                    {profileData.contact.github ?
                                        <a href={`https://github.com/${profileData.contact.github}`} target="_blank" rel="noopener noreferrer">
                                            {profileData.contact.github}
                                        </a> :
                                        <span className="empty-field">No Github provided</span>
                                    }
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
                            onClick={() => setIsEditing(true)}
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