
export const validateTokenAndRedirect = async () => {
    try {
      const res = await fetch("/api/access-code", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
  
      if (!res.ok) {
        return { isValid: false, error: "Session Expired" };
      }
  
      return { isValid: true, error: null };
    } catch (error) {
      return { isValid: false, error: "Session Expired" };
    }
  };
  