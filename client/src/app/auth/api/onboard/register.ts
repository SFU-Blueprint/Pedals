import { warn } from "console"

export function findDuplicateUserEmail(
	email: string
): boolean {
	return true
}

interface RegistrationResponse {
	status: string,
	error?: {
		code: number,
		message: string
	}
	data?: {
		user: {
			id: string
		}
	}
	message?: string
}

export async function registration(
	name: string,
	email: string,
	isOver18: boolean
): Promise<RegistrationResponse> {
	//Verify user information
	if ( findDuplicateUserEmail (email) ) {
		return {
			status: "error",
			error: {
				code: 400,
				message: "Duplicate email"
			}
		}
	}
	//Connects to the database
	//
	//If the database failed return 400, else 200
	
	return {
		status: "success",
		data: {
			user: {
				id: "123"
			},
		},
		message: "Duplicate email"
	}
}
