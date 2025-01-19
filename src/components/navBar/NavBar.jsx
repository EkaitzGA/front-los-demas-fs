import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useFilters } from '../../context/FilterProvider';
import './NavBar.css';

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showSubmenu, setShowSubmenu] = useState(false);
    const { setSelectedFilters } = useFilters();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isCompact, setIsCompact] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);


    const resetFilters = () => {
        setSelectedFilters({
            styles: [],
            types: [],
            subjects: []
        });
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        navigate('/auth?mode=login');
    };

    const handleRegisterClick = (e) => {
        e.preventDefault();
        navigate('/auth?mode=register');
    };


    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY) { 
                setIsVisible(false);
            } else { 
                setIsVisible(true);
            }
    
            if (currentScrollY > 100) {  
                setIsCompact(true);
            } else {
                setIsCompact(false);
            }
            
            setLastScrollY(currentScrollY);
        };
    
        window.addEventListener('scroll', controlNavbar);
    
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);



    return (
        // <div className={`nav-bar-dsk ${isVisible ? 'nav-visible' : 'nav-hidden'}`}>
        // <div className={`nav-bar-dsk ${isVisible ? 'nav-visible' : 'nav-hidden'} ${isCompact ? 'nav-compact' : ''}`}>
        <div className={`nav-bar-dsk 
            ${isVisible ? 'nav-visible' : 'nav-hidden'}
            ${isCompact ? 'nav-compact' : ''}
            ${isTransitioning ? 'transitioning' : ''}
        `}>

            {/* <div className='nav-content-wrapper'> */}
            <div className={`nav-content-wrapper ${isCompact ? 'nav-content-compact' : ''}`}>

                <div className='logo-section'>
                    <Link onClick={resetFilters} to="/">
                        <img src="/images/gato.jpg" alt="Logo" />
                    </Link>
                </div>
                {/* 
                <div className='title-section'>
                    <Link onClick={resetFilters} to="/" className="title-link">
                        <h1>Kazoku</h1>
                    </Link>
                </div> */}

                <nav className='nav-links-dsk'>
                    <ul className='ul-dsk'>
                        <li className="nav-li-item">
                            <NavLink
                                onClick={resetFilters}
                                to="/"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                Websites
                            </NavLink>
                        </li>

                        <li className="nav-li-item">
                            <NavLink
                                onClick={resetFilters}
                                to="/profiles"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                Users
                            </NavLink>
                        </li>

                        <li className={`nav-li-item ${location.pathname.includes('/auth') ? 'auth-active' : ''}`}

                            onMouseEnter={() => setShowSubmenu(true)}
                            onMouseLeave={() => setShowSubmenu(false)}
                        >
                            <span className={`account-trigger ${showSubmenu ? 'active-trigger' : ''}`}>Account</span>
                            {showSubmenu && (
                                <div className="submenu">
                                    <NavLink
                                        to="/auth?mode=login"
                                        onClick={handleLoginClick}
                                        className="submenu-item"
                                    >
                                        Login
                                    </NavLink>
                                    <NavLink
                                        to="/auth?mode=register"
                                        onClick={handleRegisterClick}
                                        className="submenu-item"
                                    >
                                        Register
                                    </NavLink>
                                </div>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>

        </div>
    );
}

export default NavBar;