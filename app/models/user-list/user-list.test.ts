import { UserListModel, UserList } from "./user-list"

test("can be created", () => {
  const instance: UserList = UserListModel.create({})

  expect(instance).toBeTruthy()
})