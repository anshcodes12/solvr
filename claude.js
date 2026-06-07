const BACKEND_URL = "https://solvr-26r9.onrender.com";

export async function generateProblemInsights(title, description) {
  const response = await fetch(`${BACKEND_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    throw new Error("Server error: " + response.status);
  }

  return await response.json();
}
