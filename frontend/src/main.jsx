import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './HomePage';
import AccountPage from './AccountPage';
import LogInPage from './LogInPage';
import RegisterPage from './RegisterPage';

const router = createBrowserRouter([
    { path: "/home", element: <HomePage /> },
    { path: "/account", element: <AccountPage /> },
    { path: "/login", element: <LogInPage /> },
    { path: "/register", element: <RegisterPage /> }
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
);