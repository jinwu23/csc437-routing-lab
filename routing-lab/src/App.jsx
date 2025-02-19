import { useState } from "react";
import { Routes, Route } from 'react-router';

import { useImageFetching } from "./images/useImageFetching.js";

import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { MainLayout } from "./MainLayout.jsx";

function App() {
    const [accountName, setAccountName] = useState("John Doe");
    const { isLoading, fetchedImages } = useImageFetching("");

    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route path='/' element={<Homepage userName={accountName} />} />
                <Route path='/account' element={<AccountSettings accountName={ accountName } setAccountName={ setAccountName } /> } />
                <Route path='/images' element={<ImageGallery isLoading={isLoading} fetchedImages={fetchedImages} />} />
                <Route path='/images/:imageId' element={<ImageDetails />} />
            </Route>
        </Routes>
    );
}

export default App
