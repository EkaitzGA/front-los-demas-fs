import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { updateUserProfile } from '../../utils/api/fetch';

const UserInfoContainer = ({ userData, onProfileUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tempData, setTempData] = useState(null);
    console.log('userData recibido:', userData);
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
    const userId = localStorage.getItem('userId');
    console.log('userId:', userId);

    // Comprobar si el usuario actual es el propietario del perfil
    const isOwner = userId && userData?._id && userId === userData._id.toString();


    useEffect(() => {
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
                    website: userData.website || '',
                    github: userData.github || '',
                    linkedin: userData.linkedin || '',
                    instagram: userData.instagram || ''
                }
            });
        }
    }, [userData]);

    const handleChange = (e, section, subsection = null) => {
        let value = e.target.value;

        // Formatear URL para el campo website
        if (section === 'contact' && subsection === 'website' && value) {
            // Solo formatear si hay un valor y no está vacío
            if (value.trim()) {
                // Eliminar protocolos existentes y www si existen
                value = value.replace(/^(https?:\/\/)?(www\.)?/, '');
                // Añadir protocolo y www
                value = `https://www.${value}`;
            }
            // Asegurarnos de que value es un string y no un array
            value = value.toString();
        }
        if (subsection) {
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
        console.log('Updated profileData:', profileData);
    };

    const updateUser = async (userId, data) => {
        // Transformar los datos al formato que espera el backend
        const updateData = {
            city: data.location.city,
            country: data.location.country,
            description: data.agency,
            name: data.name,
            lastname: data.lastname,
            specialization: data.specialization,
            avatar: data.avatar,
            email: data.contact.email,
            website: data.contact.website ? data.contact.website.toString() : '',
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
                
                // Llamar al callback con los datos actualizados
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
            {error && <div className="error-message">{error}</div>}

            {isEditing && !isOwner ? (
                <div className="error-message">You are not authorized to edit this profile</div>
            ) : isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="profile-container">
                        {/* Campos ocultos para name y lastname */}
                        <input
                            type="text"
                            placeholder="Name"
                            value={profileData.name}
                            onChange={(e) => handleChange(e, 'name')}
                            className="hidden"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={profileData.lastname}
                            onChange={(e) => handleChange(e, 'lastname')}
                            className="hidden"
                        />

                        {/* Avatar input */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                // Manejar la subida del avatar
                                const file = e.target.files[0];
                                if (file) {
                                    // Aquí puedes manejar la subida del archivo
                                    handleChange({ target: { value: file } }, 'avatar');
                                }
                            }}
                            className="hidden"
                        />
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
                            onClick={() => {
                                setIsEditing(false);
                                setProfileData(tempData); // Restauramos los datos que teníamos antes de empezar a editar
                                setTempData(null); // Limpiamos los datos temporales
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
                        <div className="specialization-block">
                            <h3>SPECIALIZATION</h3>
                            <p>{profileData.specialization || 'No specialization provided'}</p>
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
                                    {profileData.contact.website && typeof profileData.contact.website === 'string' ?
                                        <a href={`https://${profileData.contact.website}`} target="_blank" rel="noopener noreferrer">
                                            {profileData.contact.website.replace(/^https?:\/\/(www\.)?/, '')}
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
                            onClick={() => {
                                setTempData({ ...profileData }); // Guardamos una copia de los datos actuales
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