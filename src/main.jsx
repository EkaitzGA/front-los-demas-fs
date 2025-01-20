// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React, { Suspense, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Root.jsx'
import RootPhone from './RootPhone.jsx';
import { useMediaQuery } from 'react-responsive';

const CustomErrorBoundary = ({ children }) => {
  return (
    <div className="error-container-dsk">
      {/* <h2>Error cargando el chat</h2> */}
     
      {children}
    </div>
  );
};

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

// Desktop components
const AllProfiles = React.lazy(() => import('./routes/allProfiles/AllProfiles.jsx'));
const ChatsList = React.lazy(() => import('./routes/chat/ChatsList.jsx'));
const ChatRoom = React.lazy(() => import('./routes/chat/ChatRoom.jsx'));
const ClientProfile = React.lazy(() => import('./routes/clientProfile/ClientProfile.jsx'));
const Home = React.lazy(() => import('./routes/home/Home.jsx'));
const ProjectPage = React.lazy(() => import('./routes/projectPage/ProjectPage.jsx'));
const AuthPage = React.lazy(() => import('./routes/auth/Auth.jsx'));
const TestChat = React.lazy(() => import('./components/chat/testChat.jsx'));

// Mobile components
const MobileAllProfiles = React.lazy(() => import('./routes/allProfiles/AllProfilesPhone.jsx'));
const MobileChat = React.lazy(() => import('./routes/chat/ChatPhone.jsx'));
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
          DesktopVersion={ChatsList} 
        />
      },
      // En main.jsx, en la ruta /chats/:chatId
      {
        path: "/chats/:chatId",
        element: (
          <Suspense fallback={<div>Cargando...</div>}>
            <CustomErrorBoundary>
              <ChatRoom />
            </CustomErrorBoundary>
          </Suspense>
        ),
        loader: async ({ params }) => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              throw new Error('No se encontró el token');
            }
      
            if (!params.chatId) {
              throw new Error('ID de chat no proporcionado');
            }
      
            const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3002';
            const url = `${baseUrl}/chats/${params.chatId}`;
            
            console.log('Fetching chat:', {
              url,
              chatId: params.chatId,
              hasToken: !!token
            });
      
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
      
            if (!response.ok) {
              if (response.status === 404) {
                throw new Error('Chat no encontrado');
              }
              const errorData = await response.text();
              console.error('Error response:', errorData);
              throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
      
            const data = await response.json();
            
            if (!data.success) {
              throw new Error(data.message || 'Error al cargar el chat');
            }
      
            return data;
          } catch (error) {
            console.error('Loader error:', error);
            throw error;
          }
        }
      },
      {
        path: "/myprofile/:id",     
        element: <ResponsiveComponent 
          MobileVersion={MobileClientProfile} 
          DesktopVersion={ClientProfile} 
        />
      },
      {
        path: "/webproject/:_id",    
        element: <ResponsiveComponent 
          MobileVersion={MobileProjectPage} 
          DesktopVersion={ProjectPage} 
        />
      },
      {
        path: "/auth",    
        element: <ResponsiveComponent 
          MobileVersion={MobileAuthPage} 
          DesktopVersion={AuthPage} 
        />
      },
      {
        path: "test-chat",
        element: <Suspense fallback={<div>Loading...</div>}>
          <TestChat />
        </Suspense>
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);