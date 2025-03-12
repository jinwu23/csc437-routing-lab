import { Link } from "react-router";
import { MainLayout } from "../MainLayout.jsx";
import "./ImageGallery.css";
import { ImageUploadForm } from "./ImageUploadForm.jsx";

export function ImageGallery({isLoading, fetchedImages, authToken}) {

    const imageElements = fetchedImages.map((image) => (
        <div key={image.id} className="ImageGallery-photo-container">
            <Link to={"/images/" + image.id}>
                <img src={image.src} alt={image.name}/>
            </Link>
        </div>
    ));
    return (
        <>
            <h2>Image Gallery</h2>
            <h3>
                Upload an Image
            </h3>
            <ImageUploadForm authToken={authToken} />

            {isLoading && "Loading..."}
            <div className="ImageGallery">
                {imageElements}
            </div>
        </>
    );
}
