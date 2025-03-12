import { useState, useEffect } from "react";
import { Routes, Route } from 'react-router';

import { jwtDecode } from "jwt-decode";

import { useImageFetching } from "./images/useImageFetching.js";

import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { MainLayout } from "./MainLayout.jsx";
import { LoginPage } from "./auth/LoginPage.jsx";
import { RegisterPage } from "./auth/RegisterPage.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

function App() {
    const [accountName, setAccountName] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const { isLoading, fetchedImages } = useImageFetching("", authToken);

    useEffect(() => {
        if (authToken) {
            try {
                const decoded = jwtDecode(authToken);
                setAccountName(decoded.username); 
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, [authToken]);

    return (
        <Routes>
            <Route path="/" element={<MainLayout setAuthToken={setAuthToken} />}> 
                    <Route path='/' element={ 
                        <ProtectedRoute authToken={authToken} > 
                            <Homepage userName={accountName} /> 
                        </ProtectedRoute>} />
                    <Route path='/account' element={ 
                        <ProtectedRoute authToken={authToken} > 
                            <AccountSettings accountName={ accountName } setAccountName={ setAccountName } authToken={ authToken } />
                        </ProtectedRoute>} />
                    <Route path='/images' element={ 
                        <ProtectedRoute authToken={authToken} > 
                        <ImageGallery isLoading={isLoading} fetchedImages={fetchedImages} authToken={authToken} /> 
                        </ProtectedRoute>} />
                    <Route path='/images/:imageId' element={ 
                        <ProtectedRoute authToken={authToken} > 
                            <ImageDetails authToken={authToken}/>
                        </ProtectedRoute>} />
            </Route>
            <Route path='/login' element={<LoginPage setAuthToken={setAuthToken}/>} />
            <Route path='/register' element={<RegisterPage setAuthToken={setAuthToken} />} />
        </Routes>
    );
}

export default App
