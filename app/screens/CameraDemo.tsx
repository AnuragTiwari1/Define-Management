import React, { useRef } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { RNCamera } from "react-native-camera"
import MapView, { Marker } from "react-native-maps"
import { color } from "../theme"
import { useStores } from "../models"
import ViewShot from "react-native-view-shot"
import { Text } from "../components"
import { observer } from "mobx-react-lite"
import { Button } from "react-native-paper"

const CameraDemo = ({ route, navigation }) => {
  const {
    appStateStore: { location },
  } = useStores()

  const viewShotRef = useRef(null)

  const onCapture = () => {
    viewShotRef.current.capture().then(uri => {
      route.params.handleImage(uri)
      navigation.goBack()
    })
  }

  const [region, setRegion] = React.useState({
    latitude: location?.latitude || 0,
    longitude: location?.longitude || 0,
    latitudeDelta: 0.0023,
    longitudeDelta: 0.00442,
  })

  const [isMapOff] = React.useState(route.params?.noLocation || false)
  const [isBackFacing, setBackFacing] = React.useState(false)

  const toggleCamera = () => {
    setBackFacing(!isBackFacing)
  }

  return (
    <View style={styles.container}>
      <ViewShot
        style={{ flex: 1 }}
        ref={element => {
          viewShotRef.current = element
        }}
      >
        <RNCamera
          style={{ ...styles.preview, height: isMapOff ? "90%" : "75%" }}
          type={isBackFacing ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: "Permission to use camera",
            message: "We need your permission to use camera",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
          androidRecordAudioPermissionOptions={{
            title: "Permission to use audio recording",
            message: "We need your permission to use audio",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {}}
        />

        {isMapOff ? null : (
          <View style={styles.infoContainer}>
            <MapView initialRegion={region} onRegionChange={setRegion} style={{ flex: 1 }}>
              <Marker
                coordinate={{
                  latitude: location?.latitude || 0,
                  longitude: location?.longitude || 0,
                }}
                title={""}
                description={""}
              ></Marker>
            </MapView>
            <View style={{ flex: 1, borderLeftWidth: 1, borderStyle: "dashed" }}>
              <Text preset={["center", "small"]}>{location?.address}</Text>
            </View>
          </View>
        )}
      </ViewShot>
      <View
        style={{
          flex: 0,
          flexDirection: "row",
          justifyContent: "space-around",
          position: "absolute",
          bottom: 10,
          left: 0,
          right: 0,
        }}
      >
        <TouchableOpacity onPress={() => onCapture()} style={styles.capture}>
          <View pointerEvents="none">
            <Text style={{ fontSize: 18, color: color.primary, fontWeight: "bold" }}>Capture</Text>
          </View>
        </TouchableOpacity>
        <Button
          style={{ ...styles.capture, paddingHorizontal: 10, paddingVertical: 5 }}
          icon={require("../components/icon/icons/rotate.png")}
          onPress={toggleCamera}
        >
          Rotate
        </Button>
      </View>
    </View>
  )
}

export default observer(CameraDemo)

const styles = StyleSheet.create({
  capture: {
    flex: 0,
    paddingHorizontal: 25,
    alignSelf: "center",
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "blue",
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  preview: {
    alignItems: "center",
    height: "75%",
    justifyContent: "flex-end",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    height: "15%",
  },
})
