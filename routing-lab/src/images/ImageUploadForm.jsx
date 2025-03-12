import { useId, useState, useActionState } from 'react';

function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = (err) => reject(err);
        fr.readAsDataURL(file);
    });
}

export function ImageUploadForm( {authToken} ) {
    const [dataUrl, setDataUrl] = useState(null);
    const inputId = useId();

    const handleFileSelected = async (e) => {
        const fileObj = e.target.files?.[0]; 
        if (!fileObj) return;  
    
        try {
            const dataUrl = await readAsDataURL(fileObj);
            setDataUrl(dataUrl);
        } catch (error) {
            console.error("Error reading file:", error);
        }
    };


    const [result, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
            const file = formData.get("image");
            const title = formData.get("name").trim();

            if (!file) {
                return { type: "error", message: "Please select an image." };
            }
            if (!title) {
                return { type: "error", message: "Please enter an image title." };
            }

            console.log("Trying to upload image", file);

            try {
                const response = await fetch("/api/images", {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    return { type: "error", message: "Failed to upload. Please try again." };
                }

                return { type: "success", message: "Upload successful!" };
            } catch (error) {
                console.error(error);
                return { type: "error", message: "Network error. Please try again later." };
            }
        },
        null
    );
    

    return (
        <form action={submitAction}>
            <div>
                <label htmlFor={inputId}>Choose image to upload: </label>
                <input
                    id={inputId}
                    name="image"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileSelected}
                />
            </div>
            <div>
                <label>
                    <span>Image title: </span>
                    <input name="name" />
                </label>
            </div>

            <div> {/* Preview img element */}
                <img style={{maxWidth: "20em"}} src={dataUrl} alt="" />
            </div>

            {result && <p>{result.message}</p>}

            <button type="submit" disabled={isPending}>
                {isPending ? "Uploading..." : "Confirm upload"}
            </button>
        
        </form>
    );
}