export const getToken = () => {
  return localStorage.getItem("token");
};
export const removeToken = () => {
  localStorage.removeItem("token");
};
export const setToken = (val) => {
  localStorage.setItem("token", val);
};

export const getUser = () => {
  localStorage.getItem("user");
};

export const removeUser = () => {
  localStorage.removeItem("user");
};

export const setUser = (val) => {
  localStorage.setItem("user", val);
};

export const capitalizeFirstLetter = (string: string) => {
  if (string === null || string === undefined) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};
