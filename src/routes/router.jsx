import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import TestChat from '../components/chat/testChat';


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            
            {
                path: "test-chat",
                element: <TestChat />
            }
        ]
    }
]);