import React, { useCallback, useEffect, useState } from "react";
import type { Employee } from "../types/employee";
import axios from "axios";
import { employeeService } from "../services/employeeService";
import { useNavigate } from "react-router-dom";

export const EmployeeList: React.FC = () => {
  const baseUrl = "http://localhost:5272";
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      if (typeof err.response?.data === "string") return err.response.data;
      if (err.response?.data?.message) return err.response.data.message;
    }
    if (err instanceof Error) return err.message;
    return "An unexpected error occured";
  };

  const fetchData = useCallback(async () => {
    try {
      setErrorMessage("");
      const [empData] = await Promise.all([
        employeeService.getAll(),
        employeeService.getTitles(),
      ]);
      setEmployees(empData);
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setErrorMessage("");
        const [empData] = await Promise.all([employeeService.getAll()]);
        if (isMounted) {
          setEmployees(empData);
        }
      } catch (err: unknown) {
        setErrorMessage(getErrorMessage(err));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => {
      isMounted = true;
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure to delete this employee record?")) {
      try {
        setLoading(true);
        await employeeService.delete(id);
        await fetchData();
      } catch (err: unknown) {
        setErrorMessage(getErrorMessage(err));
        setLoading(false);
      }
    }
  };
  return (
    <>
      {errorMessage && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {errorMessage}
          <button
            type="button"
            className="btn btn-close"
            onClick={() => setErrorMessage("")}
          ></button>
        </div>
      )}
      <div className="card shadow">
        <div className=" card-header bg-primary text-white">
          <h5>Employee List</h5>
        </div>
        <div className=" card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Active?</th>
                <th>Join Date</th>
                <th>Experiences</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={6}>No meployeees Found</td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td>
                      {emp.imageUrl ? (
                        <img
                          src={`${baseUrl}${emp.imageUrl}`}
                          style={{ width: "100px", objectFit: "cover" }}
                        />
                      ) : (
                        <span className="badge bg-secondary">
                          No Image Found
                        </span>
                      )}
                    </td>
                    <td>{emp.employeeName}</td>
                    <td>
                      {emp.isActive ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-danger">Inactive</span>
                      )}
                    </td>
                    <td>{new Date(emp.joinDate).toLocaleDateString()}</td>
                    <td>
                      {emp.experiences && emp.experiences.length > 0 ? (
                        <ul className="list-unstyled mb-0 small">
                          {emp.experiences.map((exp, i) => (
                            <li key={i}>
                              <strong>
                                {exp.experienceTitle?.titleName ||
                                  `Title ID:${exp.experienceTitleId}`}
                              </strong>
                              : {exp.duration} Yrs.
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>No Experience</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() =>
                          navigate(`/employees/edit/${emp.employeeId}`)
                        }
                      >
                        Edit
                      </button>
                      &nbsp;
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(emp.employeeId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
