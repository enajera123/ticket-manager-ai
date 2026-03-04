
export async function fetchData<T>(url: string, method?: string, authToken?: string, body?: any): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }
    const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
    });
    if (response.status === 401 || response.status === 403) {
        console.error("Unauthorized access - please log in again.");
        window.location.href = "/";
        return Promise.reject(new Error("Unauthorized access - please log in again."));
    }
    return await response.json() as T;
}
