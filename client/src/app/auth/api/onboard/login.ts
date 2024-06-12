// login.ts

export default async function login(email: string, password: string) {
  const response = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    // Handle specific HTTP status codes
    switch (response.status) {
      case 401:
        throw new Error("Invalid credentials");
      case 500:
        throw new Error("Server error");
      default:
        throw new Error("Login failed");
    }
  }

  return data;
}
