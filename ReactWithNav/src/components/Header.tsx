import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export const Header: React.FC = () => {
  return (
    <nav className=" navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
      <div className=" container">
        <Link className=" navbar-brand fw-bold" to="/employees">
          Employee Management
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className=" collapse navbar-collapse" id="navbarNav">
          <div className=" navbar-nav ms-auto">
            <NavLink
              className={({ isActive }) =>
                `nav-link ${isActive ? "active fw-semibold" : ""}`
              }
              to="/employees"
              end
            >
              Employee List
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `nav-link ${isActive ? "active fw-semibold" : ""}`
              }
              to="/employees/create"
            >
              Add Employee
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

