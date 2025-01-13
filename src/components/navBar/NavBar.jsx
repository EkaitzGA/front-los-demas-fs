import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchFilter from '../searchFilter/SearchFilter';
import './NavBar.css'

function NavBar() {
    const location = useLocation();
    const [showSubmenu, setShowSubmenu] = useState(false);

    return (
        <>
            <div className='nav-bar-dsk'>

                <div className='nav-logo-wrapper'>
                    <img src="" alt="Logo" />
                    <Link to="/" className="title-link">
                        <h1>CodeOrbit</h1>
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
                    onMouseLeave={() => setShowSubmenu(false)}>
                    <Link to="/" className="title-link">
                        <h1>Account</h1>
                    </Link>
                    {showSubmenu && (
                        <div className="submenu">
                            <Link to="/login" className="submenu-item">Login</Link>
                            <Link to="/register" className="submenu-item">Register</Link>
                        </div>
                    )}
                </div>
                
            </div>
            {location.pathname === '/' && <SearchFilter />}
        </>
    )
}

export default NavBar;