import React from 'react';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="min-h-screen bg-fb-bg text-fb-primary flex flex-col font-sans antialiased transition-colors duration-200">
            <Navbar />
            <main className="flex-1 w-full">
                <Outlet />
            </main>
        </div>
    );
}
