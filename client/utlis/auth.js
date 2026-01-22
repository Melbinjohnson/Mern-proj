export const isLoggedIn = () => !!localStorage.getItem("token");

export const getRole = () => localStorage.getItem("role");

export const isOwner = () => getRole() === "owner";
export const isAdmin = () => getRole() === "admin";
