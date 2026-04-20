const API_URL = "http://localhost:5000";

export async function processText(input, feature, studentName, studentId, course, faculty) {
  try {
    const res = await fetch(`${API_URL}/api/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input, feature, studentName, studentId, course, faculty }),
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();
    return data.output;

  } catch (error) {
    console.error("API Error:", error);
    return "⚠️ Failed to process. Try again.";
  }
}