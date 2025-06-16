import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './HomePage';
import AccountPage from './AccountPage';

const router = createBrowserRouter([
    { path: "/home", element: <HomePage /> },
    { path: "/account", element: <AccountPage /> }
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
);