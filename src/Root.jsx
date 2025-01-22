import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import NavBar from './components/navBar/NavBar'
import { FilterProvider } from './context/FilterProvider';
import SplashScreen from './components/splashScreen/SplashScreen';
import Footer from './components/footer/Footer';
import './Root.css'


function Root() {
    const location = useLocation();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    if (showSplash) {
        return <SplashScreen onDone={() => setShowSplash(false)} />;
    }

    return (
        <FilterProvider>
        <div>
            <NavBar></NavBar>
            <main className='main-desktop-general' key={location.pathname}>
                <Outlet />
            </main>
            <div className="fade-in" key={`footer-${location.pathname}`}>
                <Footer />
            </div>
        </div>
        </FilterProvider>
    )
}

export default Root;