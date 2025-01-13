import { Outlet } from 'react-router-dom';
import NavBar from './components/navBar/NavBar'

function Root() {
    return (
        <div>
            <NavBar></NavBar>
            <main className='main-desktop-general'>
                <Outlet />
            </main>
        </div>
    )
}

export default Root;