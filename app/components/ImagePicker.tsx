import React, { useState } from "react"
import { TouchableOpacity, View, Image } from "react-native"
import { spacing, color } from "../theme"
import Icon from "react-native-vector-icons/AntDesign"
import { Text } from "./text/text"
import { useNavigation } from "@react-navigation/native"

export interface File {
  uri: string
  size: number
  name: string
  type: string
}

const IMAGE_STYLE = {
  width: 250,
  height: 300,
}

const getSource = source => {
  return typeof source?.name === "string" ? ( // is file
    <Image source={{ uri: source.uri }} style={IMAGE_STYLE} resizeMode="contain" />
  ) : typeof source === "string" && source ? ( // is string
    <Image source={{ uri: source }} style={IMAGE_STYLE} resizeMode="contain" />
  ) : (
    <View
      style={{
        alignItems: "center",
        marginVertical: `${spacing.medium}%`,
        marginHorizontal: `${spacing.medium + 3}%`,
      }}
    >
      <Icon name="cloudupload" size={50} color={color.palette.blue} />
      <Text preset={["center", "primary", "small"]}>press to add the photo</Text>
    </View>
  )
}

const imagePickerOptions = {
  title: "Select Avatar",
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
  rotation: 0,
}

const ImageHolder = ({ source }) => {
  return (
    <View style={{ alignContent: "center", alignItems: "center" }} pointerEvents="none">
      <View
        style={{
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: "#000000",
          borderRadius: 5,
        }}
      >
        {getSource(source)}
      </View>
    </View>
  )
}

export const FormImagePicker = ({ source, handleReject, handleCapture, preOpen, maxSize = 1 }) => {
  const { navigate } = useNavigation()

  const handleImage = (uri: string) => {
    const fileName = uri.substring(uri.lastIndexOf("/") + 1, uri.length)

    const [fileNameWithoutExtn, fileType] = fileName.split(".")

    handleCapture({
      name: fileName,
      type: `image/${fileType}`,
      uri,
    } as File)
  }

  const openPicker = () => {
    preOpen()
    navigate("cameraScreen", { handleImage })
  }

  return (
    <TouchableOpacity onPress={openPicker}>
      <ImageHolder source={source} />
    </TouchableOpacity>
  )
}
