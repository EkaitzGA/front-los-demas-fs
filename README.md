# Kazoku - Red Social para Desarrolladores Web

Kazoku es una red social diseñada para desarrolladores web especializados en UI/UX, frontend, backend y fullstack. El objetivo es proporcionar un espacio donde los desarrolladores puedan compartir sus proyectos, recibir retroalimentación y colaborar con otros profesionales del sector.

## Características Principales

### 1. Publicación de Proyectos
- Los desarrolladores pueden publicar enlaces a sus proyectos web.
- Los proyectos se generan directamente desde la plataforma.

### 2. Sistema de Likes e Interacción
- Los usuarios registrados pueden interactuar con los proyectos mediante un sistema de likes.
- Posibilidad de abrir un chat con otros usuarios para colaboraciones o discusiones sobre proyectos.

### 3. Visualización Pública
- Los proyectos son visibles para todos los usuarios, incluso para los que no están registrados.

### 4. Experiencia Responsive
- La aplicación está optimizada para dispositivos móviles y de escritorio.
- Usa la biblioteca `react-responsive` para adaptarse dinámicamente al tamaño de la pantalla.

## Tecnologías Utilizadas

### Frontend
- **React.js**: Librería principal para la construcción de la interfaz de usuario.
- **React Router**: Manejo de rutas para navegación.
- **Suspense y Lazy Loading**: Mejora el rendimiento cargando componentes de forma diferida.
- **CSS**: Diseño responsivo adaptable a dispositivos móviles y de escritorio.

### Backend
- **Node.js** y **Express.js**: Creación del servidor y manejo de endpoints API.

### Base de Datos
- **MongoDB**: Base de datos NoSQL para almacenar usuarios, proyectos y chats.

## Estructura del Proyecto

### Frontend
El archivo principal del frontend es `main.jsx`, donde se configura la aplicación y se define el comportamiento responsive:

```javascript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import React, { Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Root.jsx';
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

// Configuración de rutas
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
```

### Backend
- El backend utiliza Node.js y Express.js para manejar la lógica del servidor y las operaciones CRUD.
- MongoDB almacena la información de los usuarios, proyectos y chats.

## Instalación y Configuración

### Prerrequisitos
- Node.js v16+  
- MongoDB
- npm (Node Package Manager)

### Pasos
1. Clona este repositorio:
   ```bash
   git clone https://github.com/tuusuario/kazoku.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd kazoku
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Configura las variables de entorno en un archivo `.env`:
   ```env
   MONGO_URI=tu_ruta_de_mongodb
   PORT=3000
   ```
5. Inicia el servidor:
   ```bash
   npm run start
   ```
6. Accede a la aplicación en [http://localhost:3000](http://localhost:3000).

## Contribuciones

¡Las contribuciones son bienvenidas! Si deseas contribuir, por favor sigue estos pasos:
1. Haz un fork del repositorio.
2. Crea una rama nueva:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza los cambios y haz commit:
   ```bash
   git commit -m "Añadir nueva funcionalidad"
   ```
4. Haz un push a tu rama:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Crea un Pull Request.


