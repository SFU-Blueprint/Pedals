import {registration, findDuplicateUserEmail}  from "./register";

jest.mock('./register', () => {
	return {
		...jest.requireActual('./register'),
		findDuplicateUserEmail: jest.fn()
	}
})

describe('Testing Registration on volunteer ', () => {
	test("If there is a duplicate in the email, it should return an errors", async () => {
		const {findDuplicateUserEmail} = require("./register");

		findDuplicateUserEmail.mockImplementation(() => true);
		const result = await registration(
			"Test 1",
			"test@gmail.com",
			true
		);
		expect(result.status).toBe("error");
	})
});

