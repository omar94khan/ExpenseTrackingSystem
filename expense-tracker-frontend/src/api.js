const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function apiFetch(path, options = {}, { skipAuthRedirect = false } = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(BASE_URL + path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": "Bearer " + token } : {}),
            ...options.headers,
        },
    });

    if (response.status === 401 && !skipAuthRedirect) {
        localStorage.removeItem("token");
        alert("Login expired. Logging out.")
        window.location.href = "/login";
        return;
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
    }

    return response;
}