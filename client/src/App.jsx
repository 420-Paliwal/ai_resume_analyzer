import { useState, useEffect } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const [history, setHistory] = useState([])


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDesc);

    setLoading(true);
    setResult(null);

    const res = await fetch("https://ai-resume-analyzer-gcky.onrender.com/upload", {
      method: "POST",
      body: formData,
    });
    
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchHistory()
  }, []);

  const fetchHistory = async () => {
    const res = await fetch("https://ai-resume-analyzer-gcky.onrender.com/history")
    const data = await res.json();
    setHistory(data);
  }
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          AI Resume Analyzer 🤖
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="border-2 border-dashed border-indigo-400 rounded-lg p-6 text-center cursor-pointer hover:bg-indigo-50 transition">
            <input
              type="file"
              accept="application/pdf"
              id="resumeUpload"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="resumeUpload" className="cursor-pointer">
              {file ? (
                <p className="text-green-600 font-semibold">
                  Selected: {file.name}
                </p>
              ) : (
                <p className="text-gray-600">
                  📄 Drag & drop your resume here, or <span className="text-indigo-600 underline">browse</span>
                </p>
              )}
            </label>
          </div>

          <textarea
            placeholder="Paste Job Description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            rows={6}
          />


          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
          >
            Analyze Resume
          </button>
        </form>

        {loading && (
          <p className="text-center text-indigo-600 mt-4 animate-pulse">
            Analyzing your resume...
          </p>
        )}


        {result && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-500">
              Compared with given Job Description
            </p>
            <div className="bg-green-100 p-4 rounded-lg">

              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: result.match_percentage }}
                ></div>
              </div>

              <p className="mt-3 text-lg font-semibold">
                Match Percentage:{" "}
                <span className="text-green-700">
                  {result.match_percentage}
                </span>
              </p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Missing Skills</h3>
              <ul className="list-disc list-inside">
                {result.missing_skills &&
                  result.missing_skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
              </ul>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Improvement Tips</h3>
              <ul className="list-disc list-inside">
                {result.improvement_tips &&
                  result.improvement_tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-3">Previous Analyses</h2>

            {history.map((item) => (
              <div key={item.id} className="border p-3 rounded mb-3 bg-gray-50">
                <p><b>Match:</b> {item.match_percentage}</p>
                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
