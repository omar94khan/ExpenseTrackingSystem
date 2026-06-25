const BASE_URL = "http://localhost:8000";

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
        window.location.href = "/login";
        return;
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
    }

    return response;
}