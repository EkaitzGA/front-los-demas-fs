import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ClientProfile.css';
import UserInfoContainer from '../../components/userInfoContainer/UserInfoContainer';
import ProjectsGridContainer from '../../components/projectsGridContainer/ProjectsGridContainer';
import MyNetwork from './MyNetwork';
import { getUserById, deleteUserProfile } from '../../utils/api/fetch';
import WindowIcon from '@mui/icons-material/Window';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GroupsIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';

const UserHeader = ({ userData }) => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const isOwnProfile = userId && userData?._id && userId === userData._id.toString();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteUserProfile(userData.id);
            localStorage.clear()
            navigate('/');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <section id="heading" className="section-heading">
            <div className="breadcrumb">
                <span>HOME</span>
                <span className="separator">·</span>
                <span>DIRECTORY</span>
            </div>
            <div className='picture-and-name'>
                <div className='my-profile-image'>
                    <img src="/images/mancat.png" alt="" />
                </div>
                <h1>
                    {userData?.username
                        ? `${userData.username} | ${userData.name} ${userData.lastname}`
                        : 'Usuario no encontrado'
                    }
                </h1>
            </div>
            <h4 className='specialization-profile'>{userData.specialization}</h4>

            {isOwnProfile && (
                <div className="delete-user-container">
                    <button onClick={() => setShowConfirmDialog(true)} className="delete-button">
                        <DeleteIcon />
                    </button>

                    {showConfirmDialog && (
                        <div className="confirm-dialog-overlay">
                            <div className="confirm-dialog">
                                <h2>¿Estás seguro?</h2>
                                <p>Esta acción no se puede deshacer. Se eliminará permanentemente tu cuenta y todos los datos asociados, incluyendo:</p>
                                <ul>
                                    <li>Tu perfil personal</li>
                                    <li>Todos tus proyectos</li>
                                    <li>Tus conexiones y red</li>
                                    <li>Historial de actividad</li>
                                </ul>
                                <div className="confirm-dialog-buttons">
                                    <button onClick={() => setShowConfirmDialog(false)} className="cancel-button">
                                        Cancelar
                                    </button>
                                    <button onClick={handleDelete} className="confirm-button">
                                        Eliminar cuenta
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

const ClientProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('my-projects');

    const handleProfileUpdate = (updatedUserData) => {
        setUserData(updatedUserData);
    };

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

    const handleChatClick = () => {
        navigate('/chats');
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

    const loggedUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const isOwnProfile = loggedUserId && token && loggedUserId === id;

    const renderSection = () => {
        switch (activeSection) {
            case 'my-projects':
                return <ProjectsGridContainer userId={id} showNewProjectButton={true} showLikes={true} />;
            case 'my-favorites':
                return <ProjectsGridContainer userId={id} projectsData={userData?.projectlike} isFavorites={true} showNewProjectButton={false} showLikes={false} />;
            case 'my-network':
                return <MyNetwork userData={userData} />;
            default:
                return <ProjectsGridContainer userId={id} showNewProjectButton={true} showLikes={true} />;
        }
    };

    if (isLoading) {
        return <div className="client-profile-container">Loading...</div>;
    }

    return (
        <div className="bg-container">
            <div className="white-container">
                <div className={`client-profile-container ${getSpecializationClass(userData?.specialization)}`}>
                    <UserHeader userData={userData} />
                    <UserInfoContainer userData={userData} onProfileUpdate={handleProfileUpdate} />

                    <div className={`profile-navigation ${isOwnProfile ? 'four-columns' : 'three-columns'}`}>
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
                        {isOwnProfile && (
                            <button
                                className="nav-button"
                                onClick={handleChatClick}
                            >
                                <ChatIcon />
                            </button>
                        )}
                    </div>
                    <div className="section-content">
                        {renderSection()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;