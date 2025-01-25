import React from 'react';
import NavigationBar from './NavigationBar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <NavigationBar /> {}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
