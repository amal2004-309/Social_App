import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
            <div className="text-center">
                
                <h1 className="text-7xl md:text-9xl font-extrabold text-amber-500 animate-bounce">
                    404
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold mt-4">
                    Page Not Found
                </h2>
                <p className="text-gray-400 mt-3 max-w-md mx-auto">
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>
                <Link 
                    to="/"
                    className="inline-block mt-6 px-6 py-3 bg-amber-500 text-black font-semibold rounded-xl shadow-lg hover:bg-amber-400 transition duration-300"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    )
}
