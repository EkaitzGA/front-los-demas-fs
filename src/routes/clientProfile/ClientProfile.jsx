import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ClientProfile.css';
import UserInfoContainer from '../../components/userInfoContainer/UserInfoContainer';
import ProjectsGridContainer from '../../components/projectsGridContainer/ProjectsGridContainer';
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
                ? `${userData.username} / ${userData.name} ${userData.lastname}`
                : 'Usuario no encontrado'
            }
        </h1>
        <h4>{userData.specialization} </h4>
    </section>
);

const ClientProfile = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return <div className="client-profile-container">Loading...</div>;
    }

    return (
        // <div className="client-profile-container">
        <div className={`client-profile-container ${getSpecializationClass(userData?.specialization)}`}>

            <UserHeader userData={userData} />
            <UserInfoContainer userData={userData} />

            <div className="profile-options">
                <div className="my-projects-option">
                    <button><WindowIcon /></button>
                </div>
                <div className="my-favorites-option">
                    <button><FavoriteBorderIcon /></button>
                </div>
                <div className="my-network-option">
                    <button><GroupsIcon /></button>
                </div>
            </div>
            <ProjectsGridContainer userId={id} />
        </div>
    );
};

export default ClientProfile;