import React, { useState } from "react"
import { Controller } from "react-hook-form"
import { TouchableOpacity, View, Image } from "react-native"
import ImagePickerLib from "react-native-image-picker"
import { spacing, color } from "../theme"
import Icon from "react-native-vector-icons/AntDesign"
import { Text } from "./text/text"

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
    <View style={{ alignContent: "center", alignItems: "center" }}>
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

export const FormImagePicker = ({ source, handleReject, handleCapture, maxSize = 1 }) => {
  const handleImage = (selection: any) => {
    // handle cancel
    if (selection.didCancel) handleReject("Image selection canceled by user")
    // handle error
    else if (selection.error) handleReject(selection.error.message)
    // handle image size errors
    else if (selection.fileSize > maxSize * 1000 * 1000) {
      handleReject(`Must be less than ${maxSize}MB`)
    }
    // set image
    else {
      handleCapture({
        name: selection.fileName,
        type: selection.type,
        uri: selection.uri,
      } as File)
    }
  }

  const openPicker = () => {
    ImagePickerLib.showImagePicker(imagePickerOptions, handleImage)
  }

  return (
    <TouchableOpacity onPress={openPicker}>
      <ImageHolder source={source} />
    </TouchableOpacity>
  )
}
