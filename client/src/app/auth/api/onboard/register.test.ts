import { registration } from "./register";

// jest.mock("./register", () => ({
//   ...jest.requireActual("./register"),
//   findDuplicateUserEmail: jest.fn().mockReturnValue(false)
// }));

describe("Testing Registration on volunteer ", () => {
  // beforeAll(() => {
  // 	return {
  // 		findDuplicateUserEmail: () => true
  // 	}
  // })

  test("If there is a duplicate in the email, it should return an errors", async () => {
    const result = await registration("test");
    expect(result.status).toBe("error");
    // expect(test).toBe(true);
  });
});
