import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchFilter from '../searchFilter/SearchFilter';
import './NavBar.css';

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showSubmenu, setShowSubmenu] = useState(false);

    const handleLoginClick = (e) => {
        e.preventDefault();
        navigate('/auth?mode=login');
    };

    const handleRegisterClick = (e) => {
        e.preventDefault();
        navigate('/auth?mode=register');
    };

    return (
        <>
            <div className='nav-bar-dsk'>
                <div className='nav-logo-wrapper'>
                    <img src="/images/59C5B3B8-3718-42B1-AFAD-F82AF582B5BF.PNG" alt="Logo" />
                    <Link to="/" className="title-link">
                        <h1>KAZOKU</h1>
                    </Link>
                </div>

                <div className='nav-links-dsk'>
                    <ul className='ul-dsk'>
                        <li className="nav-li-item">
                            <Link to="/">
                                Websites
                            </Link>
                        </li>
                        <li className="nav-li-item">
                            <Link to="/profiles">
                                Users
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className='nav-dsk-login'
                    onMouseEnter={() => setShowSubmenu(true)}
                    onMouseLeave={() => setShowSubmenu(false)}
                    >
                    <Link to="/" className="title-link">
                        <h1>Account</h1>
                    </Link>
                    {showSubmenu && (
                        <div className="submenu">
                            <a href="#" 
                               onClick={handleLoginClick} 
                               className="submenu-item">
                                Login
                            </a>
                            <a href="#" 
                               onClick={handleRegisterClick} 
                               className="submenu-item">
                                Register
                            </a>
                        </div>
                    )}
                </div>
            </div>
            {location.pathname === '/' && <SearchFilter />}
        </>
    );
}

export default NavBar;