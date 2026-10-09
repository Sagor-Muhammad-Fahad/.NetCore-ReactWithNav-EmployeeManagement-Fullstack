import React from 'react'

import { Outlet } from 'react-router-dom'
import { Footer } from './Footer';
import { Header } from './Header';


export const MainLayout: React.FC = () => {
  return (
    <div className="  d-flex flex-column min-vh-100 bg-light">
      <Header />
      <main className=" flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
