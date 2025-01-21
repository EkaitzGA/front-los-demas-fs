import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useFilters } from '../../context/FilterProvider';
import { getUnreadMessagesCount } from '../../services/chatService';
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

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

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setShowSubmenu(false);
        navigate('/');
    };

    const handleAccountClick = (e) => {
        if (isAuthenticated) {
            e.preventDefault();
            const id = localStorage.getItem('userId');
            navigate(`/myprofile/${id}`);  
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
        };

        // Verificar al montar el componente
        checkAuth();

        // Escuchar cambios en el localStorage
        window.addEventListener('storage', checkAuth);

        // También podemos crear un evento personalizado para el login
        window.addEventListener('login', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('login', checkAuth);
        };
    }, []);
    const checkUnreadMessages = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const count = await getUnreadMessagesCount(token);
            setUnreadCount(count);
        }
    };

    useEffect(() => {
        // Verificar mensajes no leídos al montar y cada 30 segundos
        checkUnreadMessages();
        const interval = setInterval(checkUnreadMessages, 30000);
        
        return () => clearInterval(interval);
    }, []);
   

    useEffect(() => {
        // Verificar mensajes no leídos al montar y cada 30 segundos
        checkUnreadMessages();
        const interval = setInterval(checkUnreadMessages, 30000);
        
        return () => clearInterval(interval);
    }, []);

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
        <div className={`nav-bar-dsk 
            ${isVisible ? 'nav-visible' : 'nav-hidden'}
            ${isCompact ? 'nav-compact' : ''}
            ${isTransitioning ? 'transitioning' : ''}
        `}>
            <div className={`nav-content-wrapper ${isCompact ? 'nav-content-compact' : ''}`}>
                <div className='logo-section'>
                    <Link onClick={resetFilters} to="/">
                        <img src="/images/gato.jpg" alt="Logo" />
                    </Link>
                </div>

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

                        <li className="nav-li-item">
                            <NavLink
                                to="/chats"
                                className={({ isActive }) => `chat-link ${isActive ? 'active-link' : ''}`}
                            >
                                Chats
                                {unreadCount > 0 && (
                                    <span className="unread-badge">{unreadCount}</span>
                                )}
                            </NavLink>
                        </li>

                        <li className={`nav-li-item ${location.pathname.includes('/auth') ? 'auth-active' : ''}`}
                            onMouseEnter={() => setShowSubmenu(true)}
                            onMouseLeave={() => setShowSubmenu(false)}
                        >
                            {isAuthenticated ? (
                                <span 
                                    onClick={handleAccountClick}
                                    className={`account-trigger ${showSubmenu ? 'active-trigger' : ''} clickable`}
                                >
                                    Account
                                </span>
                            ) : (
                                <span className={`account-trigger ${showSubmenu ? 'active-trigger' : ''}`}>
                                    Account
                                </span>
                            )}
                            
                            {showSubmenu && (
                                <div className="submenu">
                                    {isAuthenticated ? (
                                        <button
                                            onClick={handleLogout}
                                            className="submenu-item"
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
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