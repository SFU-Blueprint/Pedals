import {registration}  from "./register";


jest.mock('./register.ts', () => ({
	...(jest.requireActual('./register')),
	findDuplicateUserEmail: jest.fn().mockReturnValue(false)
}))

describe('Testing Registration on volunteer ', () => {

	// beforeAll(() => {
	// 	return {
	// 		findDuplicateUserEmail: () => true
	// 	}
	// })

	test("If there is a duplicate in the email, it should return an errors", async () => {

		const result = await registration(
			"Test 1",
			"test@gmail.com",
			true
		);
		expect(result.status).toBe("error");
		// expect(test).toBe(true);
	})

	test("If there is no duplicates email, it should return a success", async () => {


		// const test = findDuplicateUserEmail("test");
		const result = await registration(
			"Test 1",
			"test@gmail.com",
			true
		);
		expect(result.status).toBe("success");
		// expect(test).toBe(false);
	})
});

