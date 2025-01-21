import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ClientProfile.css';
import UserInfoContainer from '../../components/userInfoContainer/UserInfoContainer';
import ProjectsGridContainer from '../../components/projectsGridContainer/ProjectsGridContainer';
import MyNetwork from './MyNetwork';
import { getUserById } from '../../utils/api/fetch';
import WindowIcon from '@mui/icons-material/Window';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GroupsIcon from '@mui/icons-material/Groups';

const UserHeader = ({ userData }) => (
    <section id="heading" className="section-heading">
        <div className="breadcrumb">
            <span>HOME</span>
            <span className="separator">·</span>
            <span>DIRECTORY</span>
        </div>
        <h1>
            {userData?.username
                ? `${userData.username} | ${userData.name} ${userData.lastname}`
                : 'Usuario no encontrado'
            }
        </h1>
        <h4 className='specialization-profile'>{userData.specialization} </h4>
    </section>
);

const ClientProfile = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('my-projects');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getUserById(id);
                console.log('Respuesta de la API:', response);

                if (response.success) {
                    setUserData(response.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchUserData();
        }
    }, [id]);

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

    const renderSection = () => {
        switch (activeSection) {
            case 'my-projects':
                return <ProjectsGridContainer userId={id} showNewProjectButton={true} />;
            case 'my-favorites':
                return <ProjectsGridContainer userId={id} projectsData={userData?.projectlike} isFavorites={true} showNewProjectButton={false}/>;
            case 'my-network':
                return <MyNetwork userData={userData} />;
            default:
                return <ProjectsGridContainer userId={id} showNewProjectButton={true}/>;
        }
    };

    if (isLoading) {
        return <div className="client-profile-container">Loading...</div>;
    }

    return (
        // <div className="client-profile-container">
        <div className={`client-profile-container ${getSpecializationClass(userData?.specialization)}`}>

            <UserHeader userData={userData} />
            <UserInfoContainer userData={userData} />

            <div className="profile-navigation">
                <button
                    className={`nav-button ${activeSection === 'my-projects' ? 'active' : ''}`}
                    onClick={() => setActiveSection('my-projects')}
                >
                    <WindowIcon />
                </button>
                <button
                    className={`nav-button ${activeSection === 'my-favorites' ? 'active' : ''}`}
                    onClick={() => setActiveSection('my-favorites')}
                >
                    <FavoriteBorderIcon />
                </button>
                <button
                    className={`nav-button ${activeSection === 'my-network' ? 'active' : ''}`}
                    onClick={() => setActiveSection('my-network')}
                >
                    <GroupsIcon />
                </button>
            </div>
            <div className="section-content">
                {renderSection()}
            </div>
        </div>
    );
};

export default ClientProfile;