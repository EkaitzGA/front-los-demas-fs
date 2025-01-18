import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ClientProfile.css';
import UserInfoContainer from '../../components/userInfoContainer/UserInfoContainer';
import ProjectsGridContainer from '../../components/projectsGridContainer/ProjectsGridContainer';
import { getUserById } from '../../utils/api/fetch';

const UserHeader = ({ username }) => (
    <section id="heading" className="section-heading">
        <div className="breadcrumb">
            <span>HOME</span>
            <span className="separator">·</span>
            <span>DIRECTORY</span>
        </div>
        <h1>{username || 'User not found'}</h1>
    </section>
);

const ClientProfile = () => {
    const { id } = useParams();
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await getUserById(id);
                if (response.success) {
                    setUsername(response.data.username);
                }
            } catch (error) {
                console.error('Error fetching username:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchUsername();
        }
    }, [id]);

    if (isLoading) {
        return <div className="client-profile-container">Loading...</div>;
    }

    return (
        <div className="client-profile-container">
            <UserHeader username={username} />
            <UserInfoContainer userId={id} />
            <ProjectsGridContainer userId={id} />
        </div>
    );
};

export default ClientProfile;