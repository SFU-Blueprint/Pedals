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

  // If there is a networking issues
  if (!response.ok) {
    if (response.status === 500) {
      throw new Error("Server error");
    } else {
      throw new Error("Login Failed");
    }
  }

  // If there is a user related issue
  if (data.message !== "Login successful") {
    throw new Error(data.message);
  }

  return data;
}
