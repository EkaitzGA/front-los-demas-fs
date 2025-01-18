import React, { useState, useEffect } from 'react';
import { useFilters } from '../../context/FilterProvider';
import UserFilter from '../../components/searchFilter/UserFilter';
import { Link } from 'react-router-dom';
import { getUsers } from '../../utils/api/fetch';
import './AllProfiles.css';

function AllProfiles() {
    const { userFilters } = useFilters();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await getUsers();
                if (response.success) {
                    setUsers(response.data);
                } else {
                    throw new Error(response.message || 'Error fetching users');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesCountry = !userFilters.country || user.country === userFilters.country;
        const matchesUsername = !userFilters.username ||
            user.username.toLowerCase().includes(userFilters.username.toLowerCase());
        const matchesSpecialization = !userFilters.specialization ||
            user.specialization === userFilters.specialization;

        return matchesCountry && matchesUsername && matchesSpecialization;
    });

    const getSpecializationClass = (specialization) => {
        switch (specialization) {
            case 'UX/UI':
                return 'ux-ui';
            case 'Front-end':
                return 'frontend';
            case 'Back-end':
                return 'backend';
            case 'Full-stack':
                return 'fullstack';
            default:
                return 'none';
        }
    };

    if (isLoading) {
        return <div className="users-page">Loading users...</div>;
    }

    if (error) {
        return <div className="users-page">Error: {error}</div>;
    }

    return (
        <div className="users-page">
            <UserFilter />
            <div className="users-grid">
                {filteredUsers.map(user => (
                    <Link
                        to={`/myprofile/${user._id}`}
                        key={user._id}
                        className={`user-card ${getSpecializationClass(user.specialization)}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <p className={`specialization-tag ${getSpecializationClass(user.specialization)}`}>
                            {user.specialization}
                        </p>
                        <div className='user-image'>
                            <img src="./images/gato.jpg" alt="" />
                        </div>
                        <h3>{user.username}</h3>
                        <p>{user.name} {user.lastname}</p>
                        <p>{user.country}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default AllProfiles;