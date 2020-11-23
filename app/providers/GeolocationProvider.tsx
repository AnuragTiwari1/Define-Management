import React, { useState, useEffect } from "react"
import { useStores } from "../models/root-store/root-store-context"
import { observer } from "mobx-react-lite"
import { Platform, PermissionsAndroid } from "react-native"
import Geolocation from "@react-native-community/geolocation"
import Geocoder from "react-native-geocoder"

export const GeolocationProvider = observer(() => {
  const { appStateStore } = useStores()
  let watchID: number

  const [currentLongitude, setCurrentLongitude] = useState(0)
  const [currentLatitude, setCurrentLatitude] = useState(0)

  useEffect(() => {
    const requestLocationPermission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Access Required",
          message: "This App needs to Access your location",
        },
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getOneTimeLocation()
        subscribeLocationLocation()
      }
    }
    requestLocationPermission()
    return () => {
      Geolocation.clearWatch(watchID)
    }
  }, [])

  useEffect(() => {
    if (currentLatitude && currentLongitude) {
      try {
        Geocoder.geocodePosition({
          lat: Number(currentLatitude),
          lng: Number(currentLongitude),
        }).then(res => {
          appStateStore.location.setLocation({
            latitude: Number(currentLatitude),
            longitude: Number(currentLongitude),
            address: res[0]?.formattedAddress,
          })
        })
      } catch (e) {
        console.log("the error>>>", e)
      }
    }
  }, [currentLatitude, currentLongitude])

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = Number(position.coords.longitude)

        const currentLatitude = Number(position.coords.latitude)

        setCurrentLongitude(currentLongitude)

        setCurrentLatitude(currentLatitude)
      },
      error => {},
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      },
    )
  }

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude)

        const currentLatitude = JSON.stringify(position.coords.latitude)

        setCurrentLongitude(currentLongitude)

        setCurrentLatitude(currentLatitude)
      },
      error => {},
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
      },
    )
  }

  return null
})
