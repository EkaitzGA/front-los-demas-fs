import React from 'react';
import { useParams } from 'react-router-dom';
import './ClientProfile.css';
import UserInfoContainer from '../../components/userInfoContainer/UserInfoContainer';
import ProjectsGridContainer from '../../components/projectsGridContainer/ProjectsGridContainer';
import { projects } from '../../data/projects';
import { users } from '../../data/users';
import ProjectContainer from '../../components/projectContainer/ProjectContainer';

const UserHeader = ({ user }) => (
    <section id="heading" className="section-heading">
        <div className="breadcrumb">
            <span>HOME</span>
            <span className="separator">·</span>
            <span>DIRECTORY</span>
        </div>
        <h1>{user ? `${user.username}` : 'User not found'} / {user.name} {user.lastname}</h1>
        <h4>{user.specialization}</h4>
    </section>
);

const ClientProfile = () => {
    const { id } = useParams();
    const userData = users.find(user => user._id === id);
    const userProjects = userData ? projects.filter(project => project.owner._id === userData._id) : [];
    const getSpecializationClass = (specialization) => {
        switch(specialization) {
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

    return (
        // <div className="client-profile-container">
        <div className={`client-profile-container ${userData ? getSpecializationClass(userData.specialization) : ''}`}>

            <UserHeader user={userData} />
            <UserInfoContainer userData={userData} />
            {/* <ProjectsGridContainer userProjects={userProjects} /> */}
            <section id="grid" className="section-grid">
                <div className="projects-grid-dsk">
                    {userProjects.map(project => (
                        <ProjectContainer
                            key={project._id}
                            _id={project._id}
                            img={project.images[0]?.url} // Tomamos la primera imagen del array
                            owner={project.owner}
                            date={project.date}
                            url={project.url}
                            likes={project.likes}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ClientProfile;