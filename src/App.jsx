import React, { useState } from "react";
import "./index.css";
function App() {
  const [researchDetails, setResearchDetails] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleGenerateSummary = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ details: researchDetails }),
      });

      const data = await response.json();
      setSummary(data.summary || "No summary generated");
    } catch (error) {
      console.error("Error:", error);
      setSummary("Error generating summary. Please try again.");
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">

        Publication Summary Generator
      </h1>

       {/* Filters */}
       <div className="flex space-x-4 mt-4">
       <div className="flex flex-col">
          <label className="text-gray-700 text-base font-semibold mb-2">From Date:</label>
          <input type="date" className="border border-gray-300 p-3 rounded-md text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200" />
          </div>
          <div className="flex flex-col">
          <label className="text-gray-700 text-base font-semibold mb-2">To Date:</label>
          <input type="date" className="border border-gray-300 p-3 rounded-md text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200" />
        </div>
        


  {/* Publication Type */}
  <div>
    <select className="border p-2 rounded-md">
      <option>Publication Type</option>
      <option>Journal</option>
      <option>Conference</option>
    </select>
  </div>
</div>


      {/* File Upload Section */}
      <div className="file-upload-container mt-4">
        <input type="file" id="file-upload" onChange={handleFileChange} />
        <label htmlFor="file-upload" className="file-upload-label flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="29px" height="19px">
            <path d="M5 20h14a2 2 0 0 0 2-2v-4h2v4a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4v-4h2v4a2 2 0 0 0 2 2zm6-6V7.83l-2.59 2.58L7 9l5-5 5 5-1.41 1.41L13 7.83V14h-2z" />
          </svg>
          <span>Upload File</span>
        </label>
        {selectedFile && <p className="selected-file">{selectedFile.name}</p>}
      </div>

      {/* Input Box */}
      <div className="w-34 bg-white p-6 rounded-2xl shadow-xl border border-gray-300 mt-6">
  <textarea
    className="w-full p-4 border border-gray-300 rounded-2xl shadow-sm text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 ease-in-out resize-none"
    rows="5"
    placeholder="Enter research details..."
    value={researchDetails}
    onChange={(e) => setResearchDetails(e.target.value)}
  />
</div>
      {/* Button */}
      <button
        onClick={handleGenerateSummary}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
      >
        Generate Summary
      </button>

      {/* Export Buttons */}
      <div className="mt-4 flex space-x-4">
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md flex items-center space-x-2 transition duration-300">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="20px">
      <path d="M5 20h14a2 2 0 0 0 2-2v-4h2v4a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4v-4h2v4a2 2 0 0 0 2 2zm7-4l-5-5h3V4h4v7h3l-5 5z"/>
    </svg>
    <span>Export to Excel</span>
  </button>

  <button className="bg-blue-600 hover:bg-gray-800 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md flex items-center space-x-2 transition duration-300">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="19px" height="19px">
      <path d="M5 20h14a2 2 0 0 0 2-2v-4h2v4a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4v-4h2v4a2 2 0 0 0 2 2zm7-4l-5-5h3V4h4v7h3l-5 5z"/>
    </svg>
    <span>Export to Word</span>
  </button>
</div>


      {/* Summary Box */}
      <div className="summary-box">
        <strong>Summary:</strong>
        <p>{summary}</p>
      </div>
    </div>
  );
}

export default App;
