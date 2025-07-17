// Utility functions for authentication and role management

export const decodeToken = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  return decodeToken(token);
};

export const getUserRole = () => {
  const user = getUserFromToken();
  return user?.role || null;
};

export const isAdmin = () => {
  return getUserRole() === 'admin';
};

export const isDeveloper = () => {
  return getUserRole() === 'developer';
};

export const getUsername = () => {
  const user = getUserFromToken();
  return user?.username || null;
};

export const clearInvalidToken = () => {
  const token = localStorage.getItem('token');
  if (token && !decodeToken(token)) {
    localStorage.removeItem('token');
    return true;
  }
  return false;
};
