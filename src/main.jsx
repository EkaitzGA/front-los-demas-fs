import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React, { Suspense, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Root.jsx'
import RootPhone from './RootPhone.jsx';
import { useMediaQuery } from 'react-responsive';

const RootWrapper = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    document.body.className = isMobile ? 'mobile' : 'desktop';
  }, [isMobile]);

  return (
    <>
    
      <Suspense fallback={<div>Loading...</div>}>
        {isMobile ? <RootPhone /> : <Root />}
      </Suspense>
    </>
  );
};

const AllProfiles = React.lazy(() => import('./routes/allProfiles/AllProfiles.jsx'));
const Chat = React.lazy(() => import('./routes/chat/Chat.jsx'));
const ClientProfile = React.lazy(() => import('./routes/clientProfile/ClientProfile.jsx'));
const Home = React.lazy(() => import('./routes/home/Home.jsx'));
const ProjectPage = React.lazy(() => import('./routes/projectPage/ProjectPage.jsx'));
const AuthPage = React.lazy(() => import('./routes/auth/Auth.jsx'));



const MobileAllProfiles = React.lazy(() => import('./routes/allProfiles/AllProfilesPhone.jsx'));
const MobileChat = React.lazy(() => import('./routes/chat/ChatPphone.jsx'));
const MobileClientProfile = React.lazy(() => import('./routes/clientProfile/ClientProfilePhone.jsx'));
const MobileHome = React.lazy(() => import('./routes/home/HomePhone.jsx'));
const MobileProjectPage = React.lazy(() => import('./routes/projectPage/ProjectPagePhone.jsx'));
const MobileAuthPage = React.lazy(() => import('./routes/auth/AuthPhone.jsx'));



const ResponsiveComponent = ({ MobileVersion, DesktopVersion }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Suspense fallback={<div>Loading content...</div>}>
          {isMobile ? <MobileVersion /> : <DesktopVersion />}
        </Suspense>
    </Suspense>
  );

};


const router = createBrowserRouter([
  {
    path: "/",             
    element: <RootWrapper />,   
    children: [    
      {
        index: true, 
        element: <ResponsiveComponent 
          MobileVersion={MobileHome} 
          DesktopVersion={Home} 
        />
      },       
      {
        path: "/profiles",          
        element: <ResponsiveComponent 
          MobileVersion={MobileAllProfiles} 
          DesktopVersion={AllProfiles} 
        />
      },
      {
        path: "/chats",     
        element: <ResponsiveComponent 
          MobileVersion={MobileChat} 
          DesktopVersion={Chat} 
        />,
      },
      {
        path: "/myprofile/:id",     
        element: <ResponsiveComponent 
          MobileVersion={MobileClientProfile} 
          DesktopVersion={ClientProfile} 
        />,
      },
      {
        path: "/webproject/:_id",    
        element: <ResponsiveComponent 
          MobileVersion={MobileProjectPage} 
          DesktopVersion={ProjectPage} 
        />,
      },
      {
        path: "/auth",    
        element: <ResponsiveComponent 
          MobileVersion={MobileAuthPage} 
          DesktopVersion={AuthPage} 
        />,
      },
     
    ],
  },
]);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);