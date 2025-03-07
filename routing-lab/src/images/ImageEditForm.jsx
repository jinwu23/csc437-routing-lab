import { useState } from "react";

export function ImageEditForm() {
  const [imageId, setImageId] = useState("");
  const [imageName, setImageName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: imageName }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      console.log("Image name updated successfully");
    } catch (error) {
      console.error("Failed to update image name:", error);
    }

    setImageId("");
    setImageName("");
    setIsLoading(false);
  }

  return (
    <div>
      <label style={{ display: "block" }}>
        Image ID
        <input
          value={imageId}
          disabled={isLoading}
          onChange={(e) => setImageId(e.target.value)}
        />
      </label>
      <label style={{ display: "block" }}>
        New image name
        <input
          value={imageName}
          disabled={isLoading}
          onChange={(e) => setImageName(e.target.value)}
        />
      </label>
      <button onClick={handleSubmit} disabled={isLoading}>
        Send request
      </button>
    </div>
  );
}
