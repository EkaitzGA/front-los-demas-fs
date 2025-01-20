// import React, { useState, useEffect } from 'react';
// import EditIcon from '@mui/icons-material/Edit';
// import CheckIcon from '@mui/icons-material/Check';
// import CloseIcon from '@mui/icons-material/Close';
// import { getUserById } from '../../utils/api/fetch';


// const UserInfoContainer = ({ userId }) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [userData, setUserData] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [profileData, setProfileData] = useState({
//         location: { city: '', country: '' },
//         agency: '',
//         contact: {
//             email: '',
//             website: '',
//             github: '',
//             linkedin: '',
//             instagram: ''
//         }
//     });

//     useEffect(() => {
//         const fetchUserData = async () => {
//             setIsLoading(true);
//             setError(null);
//             try {
//                 const response = await getUserById(userId);
//                 if (!response.success) {
//                     throw new Error(response.message || 'Error fetching user data');
//                 }
//                 setUserData(response.data);
//                 setProfileData({
//                     location: {
//                         city: response.data.city || '',
//                         country: response.data.country || ''
//                     },
//                     agency: response.data.description || '',
//                     contact: {
//                         email: response.data.email || '',
//                         website: response.data.website || '',
//                         github: response.data.github || '',
//                         linkedin: response.data.linkedin || '',
//                         instagram: response.data.instagram || ''
//                     }
//                 });
//             } catch (err) {
//                 setError(err.message);
//                 console.error('Error:', err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         if (userId) {
//             fetchUserData();
//         }
//     }, [userId]);

//     const handleChange = (e, section, subsection = null) => {
//         if (subsection) {
//             setProfileData(prev => ({
//                 ...prev,
//                 [section]: {
//                     ...prev[section],
//                     [subsection]: e.target.value
//                 }
//             }));
//         } else {
//             setProfileData(prev => ({
//                 ...prev,
//                 [section]: e.target.value
//             }));
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Datos a guardar:', profileData);
//         setIsEditing(false);
//     };

//     if (isLoading) {
//         return <div>Loading user information...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     if (!userData) {
//         return null;
//     }

//     return (
//         <section id="profile" className="section-profile">
//             {isEditing ? (
//                 <form onSubmit={handleSubmit} className="profile-form">
//                     <div className="profile-container">
//                         <div className="location-block">
//                             <h3>LOCATION</h3>
//                             <input
//                                 type="text"
//                                 placeholder="City"
//                                 value={profileData.location.city}
//                                 onChange={(e) => handleChange(e, 'location', 'city')}
//                             />
//                             <input
//                                 type="text"
//                                 placeholder="Country"
//                                 value={profileData.location.country}
//                                 onChange={(e) => handleChange(e, 'location', 'country')}
//                             />
//                         </div>

//                         <div className="agency-block">
//                             <h3>DESCRIPTION</h3>
//                             <textarea
//                                 placeholder="Description"
//                                 value={profileData.agency}
//                                 onChange={(e) => handleChange(e, 'agency')}
//                             />
//                         </div>

//                         <div className="contact-block">
//                             <h3>CONTACT</h3>
//                             <input
//                                 type="email"
//                                 placeholder="Email"
//                                 value={profileData.contact.email}
//                                 onChange={(e) => handleChange(e, 'contact', 'email')}
//                             />
//                             <input
//                                 type="url"
//                                 placeholder="Website"
//                                 value={profileData.contact.website}
//                                 onChange={(e) => handleChange(e, 'contact', 'website')}
//                             />
//                             <input
//                                 type="text"
//                                 placeholder="Github"
//                                 value={profileData.contact.github}
//                                 onChange={(e) => handleChange(e, 'contact', 'github')}
//                             />
//                             <input
//                                 type="text"
//                                 placeholder="Linkedin"
//                                 value={profileData.contact.linkedin}
//                                 onChange={(e) => handleChange(e, 'contact', 'linkedin')}
//                             />
//                             <input
//                                 type="text"
//                                 placeholder="Instagram"
//                                 value={profileData.contact.instagram}
//                                 onChange={(e) => handleChange(e, 'contact', 'instagram')}
//                             />
//                         </div>
//                     </div>
//                     <div className="form-actions">
//                         <button type="submit" className="save-button"> <CheckIcon /></button>
//                         <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
//                             <CloseIcon />
//                         </button>
//                     </div>
//                 </form>
//             ) : (
//                 <>
//                     <div className="profile-container">
//                         <div className="location-block">
//                             <h3>LOCATION</h3>
//                             <address>
//                                 {profileData.location.city && <p>{profileData.location.city}</p>}
//                                 {profileData.location.country && <p>{profileData.location.country}</p>}
//                             </address>
//                         </div>

//                         <div className="agency-block">
//                             <h3>DESCRIPTION</h3>
//                             {profileData.agency ? <p>{profileData.agency}</p> : <p>No description provided</p>}
//                         </div>

//                         <div className="contact-block">
//                             <h3>CONTACT</h3>
//                             <div className="contact-info">
//                                 <div className="contact-row">
//                                     <span className="label">Email</span>
//                                     {profileData.contact.email ?
//                                         <a href={`mailto:${profileData.contact.email}`}>{profileData.contact.email}</a> :
//                                         <span className="empty-field">No email provided</span>
//                                     }
//                                 </div>
//                                 <div className="contact-row">
//                                     <span className="label">Website</span>
//                                     {profileData.contact.website ?
//                                         <a href={`https://${profileData.contact.website}`} target="_blank" rel="noopener noreferrer">
//                                             {profileData.contact.website}
//                                         </a> :
//                                         <span className="empty-field">No website provided</span>
//                                     }
//                                 </div>
//                                 <div className="contact-row">
//                                     <span className="label">Github</span>
//                                     {profileData.contact.github ?
//                                         <a href={`https://github.com/${profileData.contact.github}`} target="_blank" rel="noopener noreferrer">
//                                             {profileData.contact.github}
//                                         </a> :
//                                         <span className="empty-field">No Github provided</span>
//                                     }
//                                 </div>
//                                 <div className="contact-row">
//                                     <span className="label">Linkedin</span>
//                                     {profileData.contact.linkedin ?
//                                         <a href={`https://linkedin.com/in/${profileData.contact.linkedin}`} target="_blank" rel="noopener noreferrer">
//                                             {profileData.contact.linkedin}
//                                         </a> :
//                                         <span className="empty-field">No Linkedin provided</span>
//                                     }
//                                 </div>
//                                 <div className="contact-row">
//                                     <span className="label">Instagram</span>
//                                     {profileData.contact.instagram ?
//                                         <a href={`https://instagram.com/${profileData.contact.instagram}`} target="_blank" rel="noopener noreferrer">
//                                             {profileData.contact.instagram}
//                                         </a> :
//                                         <span className="empty-field">No Instagram provided</span>
//                                     }
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <button className="edit-button" onClick={() => setIsEditing(true)}>
//                         <EditIcon />
//                     </button>
//                 </>
//             )}

        
//         </section>
//     );
// };

// export default UserInfoContainer;

import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const UserInfoContainer = ({ userData }) => {
    const [isEditing, setIsEditing] = useState(false);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos a guardar:', profileData);
        setIsEditing(false);
    };

    if (!userData) {
        return null;
    }

    return (
        <section id="profile" className="section-profile">
            {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                    {/* El resto del formulario queda igual */}
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
                        <button type="submit" className="save-button">
                            <CheckIcon />
                        </button>
                        <button 
                            type="button" 
                            className="cancel-button" 
                            onClick={() => setIsEditing(false)}
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
                                {/* El resto de los contact-row igual */}
                            </div>
                        </div>
                    </div>

                    <button className="edit-button" onClick={() => setIsEditing(true)}>
                        <EditIcon />
                    </button>
                </>
            )}
        </section>
    );
};

export default UserInfoContainer;