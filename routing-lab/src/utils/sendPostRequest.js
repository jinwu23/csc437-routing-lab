export async function sendPostRequest(url, payload) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const responseData = await response.json();
        console.log("Response Data:", responseData); 

        if (!response.ok) {
            return { type: "error", message: responseData.message || "Request failed" };
        }

        return { type: "success", message: "Success!", data: responseData };
    } catch (error) {
        console.error("Network error:", error);
        return { type: "error", message: "Network error. Please try again." };
    }
}
