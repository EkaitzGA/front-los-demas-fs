import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ClientProfile.css';
import ProjectContainer from '../ProjectContainer/ProjectContainer';
import { projects } from '../../data/projects';

const Section1 = ({ userName }) => (
    <section id="heading" className="section-heading">
        <div className="breadcrumb">
            <span>HOME</span>
            <span className="separator">·</span>
            <span>DIRECTORY</span>
        </div>
        <h1>{userName}</h1>
    </section>
);

const Section2 = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        location: {
            city: '',
            country: ''
        },
        agency: '',
        contact: {
            email: '',
            website: '',
            github: ''
        }
    });

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
        // Aquí irá la lógica para guardar en la API
        console.log('Datos a guardar:', profileData);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <section id="profile" className="section-profile">
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
                            <h3>AGENCY / PROFILE</h3>
                            <textarea
                                placeholder="Agency description"
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
                                value={profileData.contact.twitter}
                                onChange={(e) => handleChange(e, 'contact', 'github')}
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="save-button">Save</button>
                        <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </section>
        );
    }

    return (
        <section id="profile" className="section-profile">
            <div className="profile-container">
                <div className="location-block">
                    <h3>LOCATION</h3>
                    <address>
                        {profileData.location.street && <p>{profileData.location.street}</p>}
                        {profileData.location.city && <p>{profileData.location.city}</p>}
                        {profileData.location.postcode && <p>{profileData.location.postcode}</p>}
                        {profileData.location.country && <p>{profileData.location.country}</p>}
                    </address>
                </div>

                <div className="agency-block">
                    <h3>AGENCY / PROFILE</h3>
                    {profileData.agency ? <p>{profileData.agency}</p> : <p>No info provided</p>}
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
                                <a href={profileData.contact.website} target="_blank" rel="noopener noreferrer">
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
                    </div>
                </div>
            </div>
            <button className="edit-button" onClick={() => setIsEditing(true)}>
                Edit Profile
            </button>
        </section>
    );
};

const Section3 = ({ userProjects }) => (
    <section id="grid" className="section-grid">
        <div className="projects-grid-dsk">
            {userProjects.map(project => (
                <ProjectContainer
                    key={project.id}
                    id={project.id}
                    img={project.img}
                    user_name={project.user_name}
                    publication_date={project.publication_date}
                    link={project.link}
                />
            ))}
        </div>
    </section>
);

const ClientProfile = () => {
    const { id } = useParams();
    const userProject = projects.find(project => project.id === parseInt(id));
    const userProjects = projects.filter(project => project.user_name === userProject?.user_name);

    return (
        <div className="client-profile-container">
            <Section1 userName={userProject?.user_name} />
            <Section2 />
            <Section3 userProjects={userProjects} />
        </div>
    );
};

export default ClientProfile;