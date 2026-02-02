import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF");

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);

    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    console.log(data)
    setLoading(false);
  };


  return (
    <div style={{ padding: "40px" }}>
      <h1>AI Resume Analyzer</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br /><br />
        <button type="submit">Analyze Resume</button>
      </form>

      {loading && <p>Analyzing...</p>}

{result && (
  <div>
    <h2>Result</h2>
    <p><b>Match %:</b> {result.match_percentage}</p>

    <h3>Missing Skills</h3>
    <ul>
      {result.missing_skills && result.missing_skills.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ul>

    <h3>Improvement Tips</h3>
    <ul>
      {result.improvement_tips && result.improvement_tips.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  </div>
)}

    </div>
  );
}

export default App;
