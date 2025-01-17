import { useFilters } from '../../context/FilterProvider';
import { users } from '../../data/users';
import UserFilter from '../../components/searchFilter/UserFilter';
import { Link } from 'react-router-dom';
import './AllProfiles.css';

function AllProfiles() {
    const { userFilters } = useFilters();

    const filteredUsers = users.filter(user => {
        const matchesCountry = !userFilters.country || user.country === userFilters.country;
        const matchesUsername = !userFilters.username ||
            user.username.toLowerCase().includes(userFilters.username.toLowerCase());

        return matchesCountry && matchesUsername;
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

    return (
        <div className="users-page">
            <UserFilter />
            <div className="users-grid">
                {filteredUsers.map(user => (
                    <Link
                        to={`/myprofile/${user._id}`}
                        key={user._id}
                        // className="user-card"
                        className={`user-card ${getSpecializationClass(user.specialization)}`}

                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <p className={`specialization-tag ${getSpecializationClass(user.specialization)}`}>
                            {user.specialization}
                        </p>                        <div className='user-image'>
                            <img src="./images/gato.jpg" alt="" />
                        </div>
                        <h3>{user.username}</h3>
                        <p>{user.name} {user.lastname}</p>
                        <p>{user.country}</p>
                        {/* <p>{user.description}</p> */}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default AllProfiles;