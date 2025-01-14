import React from 'react';
import { useParams } from 'react-router-dom';
import './ClientProfile.css';
import UserInfoContainer from '../../components/userInfoContainer/UserInfoContainer';
import ProjectsGridContainer from '../../components/projectsGridContainer/ProjectsGridContainer';
import { projects } from '../../data/projects';
import { users } from '../../data/users';

const UserHeader = ({ user }) => (
    <section id="heading" className="section-heading">
        <div className="breadcrumb">
            <span>HOME</span>
            <span className="separator">·</span>
            <span>DIRECTORY</span>
        </div>
        <h1>{user ? `${user.username}` : 'User not found'}</h1>
    </section>
);

const ClientProfile = () => {
    const { id } = useParams();
    const userData = users.find(user => user._id === id);
    const userProjects = userData ? projects.filter(project => project.user_name === userData.username) : [];

    return (
        <div className="client-profile-container">
            <UserHeader user={userData} />
            <UserInfoContainer userData={userData} />
            <ProjectsGridContainer userProjects={userProjects} />
        </div>
    );
};

export default ClientProfile;