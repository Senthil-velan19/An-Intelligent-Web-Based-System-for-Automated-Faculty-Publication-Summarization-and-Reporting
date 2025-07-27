import React, { useState } from "react";
import axios from "axios";

const ResearchSummary = () => {
  const [facultyData, setFacultyData] = useState([]);
  const [file, setFile] = useState(null);
  const [startYear, setStartYear] = useState(2000);
  const [endYear, setEndYear] = useState(2025);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("start_year", startYear);
    formData.append("end_year", endYear);

    try {
      const response = await axios.post("http://localhost:5000/upload-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFacultyData(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to fetch publications.");
    }
  };

  const handleExportWord = async () => {
    try {
      const response = await axios.post("http://localhost:5000/export-word", facultyData, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "faculty_publications.docx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting Word file:", error);
      alert("Failed to export file.");
    }
  };

 
};

export default ResearchSummary;
