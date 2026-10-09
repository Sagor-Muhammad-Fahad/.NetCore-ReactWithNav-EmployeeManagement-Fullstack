import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className=" bg-dark text-light py-3 mt-auto">
      <div className=" container text-center">
        <p className=" mb-0 small">
          &copy; {new Date().getFullYear()} Employee Management. All right
          reserved
        </p>
      </div>
    </footer>
  );
};
