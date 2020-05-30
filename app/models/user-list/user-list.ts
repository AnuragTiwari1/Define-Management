import { Instance, SnapshotOut, types } from "mobx-state-tree"

const personModal = types.model("person", {
  sName: types.string,
  sStatus: types.string, // where "0" means "incomplete"
  sId: types.number,
  sLabel: types.string,
  iPhotoId: types.string,

  // optional feilds
  sImage: types.optional(types.string, ""),
  sCaption: types.optional(types.string, ""),
  sImage1: types.optional(types.string, ""),
  sCaption1: types.optional(types.string, ""),
  sImage2: types.optional(types.string, ""),
  sCaption2: types.optional(types.string, ""),
  sImage3: types.optional(types.string, ""),
  sCaption3: types.optional(types.string, ""),
  sImage4: types.optional(types.string, ""),
  sCaption4: types.optional(types.string, ""),
  iTaskId: types.optional(types.number, 0),
  iMemberId: types.optional(types.string, ""),
  sAnnexure: types.optional(types.string, ""),
  sAnnexure1: types.optional(types.string, ""),
  sAnnexure2: types.optional(types.string, ""),
  sAnnexure3: types.optional(types.string, ""),
  sAnnexure4: types.optional(types.string, ""),
})

/**
 * Model description here for TypeScript hints.
 */
export const UserListModel = types
  .model("UserList", {
    peoplelist: types.optional(types.array(personModal), []),
    activeIndex: types.optional(types.number, -1)
  })
  .props({})
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setPeopleList(data) {
      self.peoplelist = data
    },
    updatePeopleList(index, data) {
      self.peoplelist[index] = data
    },
    setEditIndex(index) {
      self.activeIndex = index
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type UserListType = Instance<typeof UserListModel>
export interface UserList extends UserListType {}
type UserListSnapshotType = SnapshotOut<typeof UserListModel>
export interface UserListSnapshot extends UserListSnapshotType {}

type PersonModalSnapshotType = SnapshotOut<typeof personModal>
export interface PersonModalSnapshot extends PersonModalSnapshotType {}
