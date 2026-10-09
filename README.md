A full-stack web application to manage employees and their work experiences. Built with **ASP.NET Core Web API** on the backend and **React (TypeScript)** on the frontend. Supports nested experiences, employee photo uploads, and active/inactive status tracking.

---

## 📌 Features

- ✅ Create, Read, Update, Delete Employees
- ✅ Add multiple Experiences (title + duration) to a single Employee
- ✅ Upload employee profile photos (Guid-based filenames)
- ✅ Active / Inactive status tracking
- ✅ Flexible experiences JSON parsing on backend (single object or array)
- ✅ Searchable dropdowns for Experience Titles
- ✅ Responsive UI with Bootstrap 5
- ✅ React Hooks + TypeScript for type safety
- ✅ Static file serving for employee images

---

## 🧱 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| ASP.NET Core 8 Web API | REST API |
| Entity Framework Core | ORM |
| SQL Server | Database |
| Newtonsoft.Json | JSON serialization (reference loop handling) |
| Swagger / OpenAPI | API documentation |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | SPA framework |
| TypeScript | Type safety |
| Axios | HTTP client |
| React Router v6 | Routing |
| React Hooks | State management |
| Bootstrap 5 | Styling |

---

## 📁 Project Structure

```
employee-app/
├── backend/                         # ResumeApi
│   ├── Controllers/
│   │   └── EmployeesController.cs
│   ├── Models/
│   │   ├── ServerContext.cs
│   │   ├── Employee.cs
│   │   ├── Experience.cs
│   │   ├── ExperienceTitle.cs
│   │   └── DTOs/
│   │       ├── EmployeeDTO.cs
│   │       └── ExperienceDTO.cs
│   ├── wwwroot/images/              # uploaded photos (gitignored)
│   ├── appsettings.json
│   ├── ResumeApi.csproj
│   └── Program.cs
│
├── frontend/                        # React + TypeScript app
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmployeeList.tsx
│   │   │   ├── EmployeeForm.tsx
│   │   │   ├── EmployeeManagement.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── services/
│   │   │   └── employeeService.ts
│   │   ├── types/
│   │   │   └── employee.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
