import axios from "axios";

const DEBUG = false;

// Only needed if you still handle 401 globally in responses
function logout() {
    if (DEBUG) console.warn("🔐 Logging out user due to 401");

    localStorage.removeItem("token");
    window.location.href = "/login";
}

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

// Single token-handling request interceptor with race guard
instance.interceptors.request.use(
    async (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");

            if (!token && !window.location.pathname.startsWith("/login")) {
                await new Promise((res) => setTimeout(res, 100));
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

//  Response interceptor for 401 protection 
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            typeof window !== "undefined" &&
            error?.response?.status === 401
        ) {
            const path = window.location.pathname;
            const isAuthPage =
                path.startsWith("/login") ||
                path.startsWith("/signup") ||
                path.startsWith("/reset-password");

            if (!isAuthPage) {
                logout(); // still relevant here
            }
        }

        if (DEBUG) {
            console.error("🔴 Axios response error:", error);
        }

        return Promise.reject(error);
    }
);

export default instance;
