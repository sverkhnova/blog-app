export const getToken = (): string | null => {
    return localStorage.getItem('token');
  };
  
  export const isAuthenticated = (): boolean => {
    return !!getToken();
  };
  
  export const logout = (): void => {
    localStorage.removeItem('token');
  };
  