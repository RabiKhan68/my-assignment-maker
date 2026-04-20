export async function processText(
  input,
  feature,
  studentName,
  studentId,
  course,
  faculty,
) {
  try {
    const res = await fetch("http://localhost:5000/api/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        feature,
        studentName,
        studentId,
        course,
        faculty,
      }),
    });

    // 🔥 Handle errors properly
    if (!res.ok) {
      let errorData;

      try {
        errorData = await res.json();
      } catch {
        errorData = { error: "Unknown server error" };
      }

      console.error("🔥 API ERROR:", errorData);

      // 🎯 Smart error messages
      if (errorData.error?.includes("quota")) {
        return "⚠️ Daily limit reached. Try again tomorrow.";
      }

      if (errorData.error?.includes("unavailable")) {
        return "⚠️ AI is busy right now. Try again in a few seconds.";
      }

      return `⚠️ ${errorData.error || "Server error"}`;
    }

    const data = await res.json();
    return data.output;

  } catch (error) {
    console.error("❌ Network/API Error:", error);

    return "⚠️ Cannot connect to server. Check if backend is running.";
  }
}