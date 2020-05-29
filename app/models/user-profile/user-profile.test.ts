import { UserProfileModel, UserProfile } from "./user-profile"

test("can be created", () => {
  const instance: UserProfile = UserProfileModel.create({})

  expect(instance).toBeTruthy()
})