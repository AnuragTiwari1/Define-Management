import { Instance, SnapshotOut, types } from "mobx-state-tree"
import omit from "ramda/src/omit"

/**
 * this model contains possible state
 * the app can be in
 * eg: toast, network error
 */

export const DEFAULT_APPSTATE = {
  toast: {
    text: "",
    styles: "",
  },
  location: {
    latitude: null,
    longitude: null,
    address: null,
  },
}

const toastModal = types
  .model("toastModal", {
    text: types.optional(types.string, ""),
    styles: types.optional(types.string, ""),
  })
  .actions(self => ({
    setToast(newToast) {
      self.text = newToast.text
      self.styles = newToast.styles
    },
  }))

const locationModal = types
  .model({
    latitude: types.maybeNull(types.number),
    longitude: types.maybeNull(types.number),
    address: types.maybeNull(types.string),
  })
  .actions(self => ({
    setLocation({ latitude, longitude, address }) {
      self.latitude = latitude
      self.longitude = longitude
      self.address = address
    },
  }))

export const AppStateModel = types
  .model("AppStateModel", {
    toast: types.optional(toastModal, DEFAULT_APPSTATE.toast),
    hasWelcomed: types.optional(types.boolean, false),
    isLoggedIn: types.optional(types.boolean, false),
    location: types.optional(locationModal, DEFAULT_APPSTATE.location),
  })
  .props({})
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setWelcome(bool) {
      self.hasWelcomed = bool
    },
    setLoggedIn(bool) {
      self.isLoggedIn = bool
    },
  }))
  .postProcessSnapshot(omit(["toast"]))

type AppStateType = Instance<typeof AppStateModel>
export interface AppState extends AppStateType {}
type AppStateSnapshotType = SnapshotOut<typeof AppStateModel>
export interface AppStateSnapshot extends AppStateSnapshotType {}
