import React from "react"
import { View, Text, Image, ImageBackground } from "react-native"
import MapView, { Marker } from "react-native-maps"

export default function CustomMarker(props) {
  const { picUrl, ...rest } = props
  return (
    <Marker {...rest}>
      {/* <ImageBackground source={require("./marker.png")} style={{ width: 15, height: 25 }}>
        <Text>SF</Text>
      </ImageBackground> */}
      <View>
        <Image
          source={require("./marker.png")}
          style={{ width: 50, height: 100 }}
          resizeMode="contain"
        />
        <View
          style={{
            position: "absolute",
            top: 20,
            left: 5,
          }}
        >
          <Image
            source={{ uri: picUrl }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
          ></Image>
        </View>
      </View>
    </Marker>
  )
}
