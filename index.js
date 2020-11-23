// This is the first file that ReactNative will run when it starts up.
//
// We jump out of here immediately and into our main entry point instead.
//
// It is possible to have React Native load our main module first, but we'd have to
// change that in both AppDelegate.m and MainApplication.java.  This would have the
// side effect of breaking other tooling like mobile-center and react-native-rename.
//
// It's easier just to leave it here.
import App from "./app/app.tsx"
import { AppRegistry } from "react-native"
import PushNotification from "react-native-push-notification"
import { LOCATION_STORAGE_KEY, DISTANCE_TRAVELLED } from "./app/config/constanst"
import Geolocation from "@react-native-community/geolocation"
import BackgroundJob from "react-native-background-job"
import { load, save } from "./app/utils/storage"
import geodist from "geodist"

PushNotification.configure({
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function(notification) {
    console.log("NOTIFICATION:", notification)

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
})

const backgroundJob = {
  jobKey: "myJob",
  job: async () => {
    const locationObj = await load(LOCATION_STORAGE_KEY)
    const prevDistance = await load(DISTANCE_TRAVELLED)

    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = Number(position.coords.longitude)

        const currentLatitude = Number(position.coords.latitude)

        if (locationObj?.lat && locationObj?.lon) {
          const displacement = geodist(
            locationObj,
            { lat: currentLatitude, lon: currentLongitude },
            { unit: "km" },
          )

          const totalDistance = Number(prevDistance || 0) + displacement

          save(DISTANCE_TRAVELLED, totalDistance)

          PushNotification.localNotification({
            autoCancel: true,
            bigText: `the distance moved is>>> ${totalDistance}. The new Coordinates are >>> ${currentLatitude},${currentLongitude}.`,
            subText: "Local Notification Demo",
            title: "Local Notification Title",
            message: "Expand me to see more",
            vibrate: true,
            vibration: 300,
            playSound: true,
            soundName: "default",
          })
        }
        save(LOCATION_STORAGE_KEY, {
          lat: currentLatitude,
          lon: currentLongitude,
        })
      },
      () => {},
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      },
    )
  },
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = "DMI"

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.
const SHOW_STORYBOOK = false

let RootComponent = App
if (__DEV__ && SHOW_STORYBOOK) {
  // Only include Storybook if we're in dev mode
  const { StorybookUIRoot } = require("./storybook")
  RootComponent = StorybookUIRoot
}

BackgroundJob.register(backgroundJob)

AppRegistry.registerComponent(APP_NAME, () => RootComponent)
