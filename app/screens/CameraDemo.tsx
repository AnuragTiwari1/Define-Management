import React, { PureComponent } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RNCamera } from "react-native-camera"
import MapView from "react-native-maps"
import { color } from "../theme"

export default class CameraDemo extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      btnWidth: 0,
    }
  }
  render() {
    console.log("the btn width >> ", this.state.btnWidth)
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: "Permission to use camera",
            message: "We need your peo use your camera",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
          androidRecordAudioPermissionOptions={{
            title: "Permission to use audio recording",
            message: "We need your permission to use your audio",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes)
          }}
        />
        <View
          style={styles.infoContainer}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <View style={{ flex: 2 }}>
            <Text>Maps will appear here</Text>
          </View>
          <View style={{ flex: 3 }}>
            <Text>Address will appear here</Text>
          </View>
        </View>
        <View
          onLayout={event => {
            this.setState({ btnWidth: event.nativeEvent.layout.width })
          }}
          style={{
            flex: 0,
            flexDirection: "row",
            justifyContent: "center",
            position: "absolute",
            // bottom: 10,
            top: 10,
            left: "50%",
            transform: [{ translateX: -(this.state.btnWidth / 2) }],
          }}
        >
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 18, color: color.primary, fontWeight: "bold" }}>Capture</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true }
      const data = await this.camera.takePictureAsync(options)
      console.log(data.uri)
    }
  }
}

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
    height: "25%",
    backgroundColor: "red",
  },
})
