// login.ts

export async function login(email: string, password: string) {
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
        console.log(response);
        throw new Error("Invalid credentials");
      case 500:
        console.log(response);
        throw new Error("Server error");
      default:
        console.log(response);
        throw new Error("Login failed");
    }
  }

  return data;
}
