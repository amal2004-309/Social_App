import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import NotFound from "./Components/NotFound/NotFound";
import Layout from "./Components/Layout/Layout";
import { Toaster } from "react-hot-toast";
import AuthContextProvider from "./Context/AuthContext";
import { ThemeProvider } from "./Context/ThemeContext";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Profile from "./Components/Profile/Profile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from "./Components/PostDetails/PostDetails";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: "postDetails/:id", element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthContextProvider>
          <QueryClientProvider client={client}>
            <RouterProvider router={router} />
          </QueryClientProvider>
          <Toaster
            position="bottom-left"
            toastOptions={{
              className: 'border border-fb bg-fb-surface text-fb-primary text-xs font-medium rounded-xl shadow-lg',
              duration: 3000,
            }}
          />
        </AuthContextProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
