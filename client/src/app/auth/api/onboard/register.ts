export function findDuplicateUserEmail(email: string): boolean {
  if (email) {
    return true;
  }
  return false;
}

interface RegistrationResponse {
  status: string;
  error?: {
    code: number;
    message: string;
  };
  data?: {
    user: {
      id: string;
    };
  };
  message?: string;
}

export async function registration(
  email: string
): Promise<RegistrationResponse> {
  if (findDuplicateUserEmail(email)) {
    return {
      status: "error",
      error: {
        code: 400,
        message: "Duplicate email"
      }
    };
  }

  return {
    status: "success",
    data: {
      user: {
        id: "123"
      }
    },
    message: "Duplicate email"
  };
}
