import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const UserProfileModel = types
  .model("UserProfile", {
    iUserId: types.optional(types.number, 0),
    can_id: types.optional(types.number, 0),
    sUsername: types.optional(types.string, ""),
    iActive: types.optional(types.number, 0),
    sCreatedTimestamp: types.optional(types.string, ""),
  })
  .props({})
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setUserProfile(newProfile) {
      self.iUserId = newProfile.iUserId
      self.can_id = newProfile.can_id
      self.sUsername = newProfile.sUsername
      self.iActive = newProfile.isAcive
      self.sCreatedTimestamp = newProfile.sCreatedTimestamp
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type UserProfileType = Instance<typeof UserProfileModel>
export interface UserProfile extends UserProfileType {}
type UserProfileSnapshotType = SnapshotOut<typeof UserProfileModel>
export interface UserProfileSnapshot extends UserProfileSnapshotType {}
