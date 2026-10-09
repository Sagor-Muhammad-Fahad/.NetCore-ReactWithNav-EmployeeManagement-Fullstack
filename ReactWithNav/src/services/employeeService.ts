import axios  from "axios";
import type { Employee, ExperienceDTO, ExperienceTitle } from "../types/employee";
const apiBaseUrl='http://localhost:5272/api/Employees'

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const response = await axios.get<Employee[]>(`${apiBaseUrl}`);
    return response.data;
  },
  getTitles: async (): Promise<ExperienceTitle[]> => {
    const response = await axios.get<ExperienceTitle[]>(`${apiBaseUrl}/titles`);
    return response.data;
  },
  getbyId: async (id: number): Promise<Employee> => {
    const response = await axios.get<Employee>(`${apiBaseUrl}/${id}`);
    return response.data;
  },
  create: async (
    employeeName: string,
    isActive: boolean,
    joinDate: string,
    experiences: ExperienceDTO[],
    imageFile: File | null,
  ) => {
    const formData = new FormData();
    formData.append("EmployeeName", employeeName);
    formData.append("IsActive", String(isActive));
    formData.append("JoinDate", joinDate);
    formData.append("EXperiencesString", JSON.stringify(experiences));
    if (imageFile) {
      formData.append("ImageFile", imageFile);
    }
    const response = await axios.post<Employee>(`${apiBaseUrl}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  update: async (
    id: number,
    employeeName: string,
    isActive: boolean,
    joinDate: string,
    experiences: ExperienceDTO[],
    imageFile: File | null,
  ) => {
    const formData = new FormData();
    formData.append("EmployeeId", String(id));
    formData.append("EmployeeName", employeeName);
    formData.append("IsActive", String(isActive));
    formData.append("JoinDate", joinDate);
    formData.append("EXperiencesString", JSON.stringify(experiences));
    if (imageFile) {
      formData.append("ImageFile", imageFile);
    }
    const response = await axios.put<Employee>(
      `${apiBaseUrl}/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },
  delete: async (id: number) => {
    await axios.delete(`${apiBaseUrl}/${id}`);
  },
};
