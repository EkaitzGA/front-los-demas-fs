import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import NavBar from './components/navBar/NavBar'
import { FilterProvider } from './context/FilterProvider';
import './Root.css'


function Root() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <FilterProvider>
        <div>
            <NavBar></NavBar>
            <main className='main-desktop-general'>
                <Outlet />
            </main>
        </div>
        </FilterProvider>
    )
}

export default Root;