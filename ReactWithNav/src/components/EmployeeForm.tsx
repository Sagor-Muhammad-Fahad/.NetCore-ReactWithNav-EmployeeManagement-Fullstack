import axios from "axios";
import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { employeeService } from "../services/employeeService";
import type { ExperienceDTO, ExperienceTitle } from "../types/employee";

interface ExperienceFormItem extends ExperienceDTO {
  tempId: string;
}

export const EmployeeForm: React.FC = () => {
  const baseUrl = "http://localhost:5272";
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [titles, setTitels] = useState<ExperienceTitle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [joindate, setJoinDate] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [employeeName, setEmployeeName] = useState<string>("");
  const [experiences, setExperiences] = useState<ExperienceFormItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      if (typeof err.response?.data === "string") return err.response.data;
      if (err.response?.data?.message) return err.response.data.message;
    }
    if (err instanceof Error) return err.message;
    return "An unexpected error occured";
  };

  useEffect(() => {
    let mounted = true;
    const loadFormData = async () => {
      try {
        setErrorMessage("");
        const titleData = await employeeService.getTitles();
        if (mounted) setTitels(titleData);
        if (id) {
          const emp = await employeeService.getbyId(Number(id));
          if (mounted) {
            setEmployeeName(emp.employeeName);
            setIsActive(emp.isActive);
            setJoinDate(emp.joinDate ? emp.joinDate.split("T")[0] : "");
            setImagePreview(emp.imageUrl ? `${baseUrl}${emp.imageUrl}` : "");
            const mappedExperiences: ExperienceFormItem[] = (
              emp.experiences || []
            ).map((exp) => ({
              tempId: crypto.randomUUID(),
              experienceTitleId: exp.experienceTitleId,
              duration: exp.duration,
            }));
            setExperiences(mappedExperiences);
          }
        }
      } catch (err: unknown) {
        if (mounted) {
          setErrorMessage(getErrorMessage(err));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadFormData();
    return () => {
      mounted = false;
    };
  }, [id]);

  const resetFrom = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setEditingId(null);
    setEmployeeName("");
    setIsActive(true);
    setJoinDate("");
    setImageFile(null);
    setImagePreview("");
    setExperiences([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddExperiencesRow = () => {
    if (titles.length === 0) return;
    setExperiences((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        experienceTitleId: titles[0].experienceTitleId,
        duration: 1,
      },
    ]);
  };

  const handleRemoveExperiencesRow = (tempId: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.tempId !== tempId));
  };

  const handleExperienceChange = (
    tempId: string,
    field: keyof ExperienceDTO,
    value: number,
  ) => {
    setExperiences((prev) =>
      prev.map((item) =>
        item.tempId === tempId ? { ...item, [field]: value } : item,
      ),
    );
  };

  if (loading) {
    return <div className=" container my-5 text-center">Loading Data.....</div>;
  }

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErrorMessage("");
      const loadExperiences: ExperienceDTO[] = experiences.map(
        ({ experienceTitleId, duration }) => ({ experienceTitleId, duration }),
      );
      if (isEditMode && id) {
        await employeeService.update(
          Number(id),
          employeeName,
          isActive,
          joindate,
          loadExperiences,
          imageFile,
        );
      } else {
        await employeeService.create(
          employeeName,
          isActive,
          joindate,
          loadExperiences,
          imageFile,
        );
      }
      navigate("/employees");
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setSubmitting(false);
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
      <div className="card shadow mb-5">
        <div className=" card-header bg-primary text-white">
          <h5 className="mb-0">
            {editingId ? "Update Employee" : "Add New Employee"}
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className=" col-md-6">
                <label className=" form-label">Employee Name</label>
                <input
                  required
                  type="text"
                  className=" form-control"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </div>
              <div className=" col-md-6">
                <label className=" form-label">Join Date</label>
                <input
                  required
                  type="date"
                  className=" form-control"
                  value={joindate}
                  onChange={(e) => setJoinDate(e.target.value)}
                />
              </div>
              <div className=" col-md-6">
                <label className=" form-label">Image File</label>
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  type="file"
                  className=" form-control"
                  onChange={handleImageChange}
                />
              </div>
              <div className="col-md-6 d-flex align-items-center mt-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className=" form-check-input"
                    id="isActiveCheck"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <label htmlFor="isActiveCheck" className=" form-check-label">
                    Is Active
                  </label>
                </div>
              </div>
              {imagePreview && (
                <div className=" col-12">
                  <label className="form-label d-block">Image Preview:</label>
                  <img
                    src={imagePreview}
                    alt="preview"
                    className=" img-thumbnail"
                    style={{ width: "100px", objectFit: "cover" }}
                  />
                </div>
              )}
            </div>
            <hr className=" my-4" />
            <div className=" d-flex justify-content-between align-items-center mb-3">
              <h5 className=" mb-0">Experiences</h5>
              <button
                onClick={handleAddExperiencesRow}
                disabled={titles.length == 0}
                type="button"
                className="btn btn-sm btn-outline-primary"
              >
                +Add Experience
              </button>
            </div>
            {experiences.length === 0 ? (
              <p className=" text-muted small">No Experiences added yet</p>
            ) : (
              experiences.map((exp) => (
                <div
                  key={exp.tempId}
                  className=" row g-2 mb-2 align-items-center"
                >
                  <div className="col-md-5">
                    <select
                      className=" form-select"
                      value={exp.experienceTitleId}
                      onChange={(e) =>
                        handleExperienceChange(
                          exp.tempId,
                          "experienceTitleId",
                          Number(e.target.value),
                        )
                      }
                    >
                      {titles.map((t) => (
                        <option
                          value={t.experienceTitleId}
                          key={t.experienceTitleId}
                        >
                          {t.titleName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className=" col-md-5">
                    <input
                      required
                      type="number"
                      min="1"
                      className=" form-control"
                      placeholder="Duration(in years)"
                      value={exp.duration}
                      onChange={(e) =>
                        handleExperienceChange(
                          exp.tempId,
                          "duration",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className=" col-md-2 ">
                    <button
                      type="button"
                      className="btn btn-outline-danger w-100"
                      onClick={() => handleRemoveExperiencesRow(exp.tempId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
            <div className="mt-4 d-flex justify-content-end gap-2">
              <button
                type="submit"
                className="btn btn-success me-2"
                disabled={submitting}
              >
                {editingId
                  ? submitting
                    ? "Updating..."
                    : "Update Employee"
                  : submitting
                    ? "Saving..."
                    : "Save Employee"}
              </button>
              {editingId && (
                <button
                  onClick={resetFrom}
                  disabled={submitting}
                  type="button"
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
