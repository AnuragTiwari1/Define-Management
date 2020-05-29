import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AppStateModel, DEFAULT_APPSTATE } from "../app-state-model"
import { UserProfileModel } from "../user-profile/user-profile"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  appStateStore: types.optional(AppStateModel, DEFAULT_APPSTATE),
  userProfileStore: types.optional(UserProfileModel, {})
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
