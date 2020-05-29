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

const emptyImage =
  "https://previews.123rf.com/images/blankstock/blankstock1811/blankstock181101708/112886250-add-user-line-icon-profile-avatar-sign-male-person-silhouette-symbol-gradient-pattern-line-button-ad.jpg"

export const FormImagePicker = ({ name, defaultValue, control, ...rest }) => {
  return (
    <Controller
      as={<ImagePicker {...rest} />}
      name={name}
      valueName="source"
      onChangeName="setSource"
      {...{ defaultValue, control }}
    />
  )
}

const getSource = (source, defaultImag, imageDimension) => {
  return typeof source?.name === "string" ? ( // is file
    <Image source={{ uri: source.uri }} style={{ ...imageDimension }} resizeMode="contain" />
  ) : typeof source === "string" && source ? ( // is string
    { uri: source }
  ) : typeof defaultImag === "string" ? (
    { uri: defaultImag }
  ) : (
    defaultImag
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

export const ImagePicker = ({ source, handleReject, children, setSource, maxSize = 1 }) => {
  const [isEmpty, setIsEmpty] = useState(true)
  const [imgDimension, setImgDimension] = useState({ width: 0, height: 0 })

  const handleImage = (selection: any) => {
    // handle cancel
    try {
      if (selection.didCancel) {
        throw new Error("Image selection canceled by user")
      }
      // handle error
      else if (selection.error) {
        throw new Error(selection.error.message)
      }
      // handle image size errors
      else if (selection.fileSize > maxSize * 1000 * 1000) {
        throw new Error(`Must be less than ${maxSize}MB`)
      }
      // set image
      else {
        setSource({
          name: selection.fileName,
          type: selection.type,
          uri: selection.uri,
        } as File)
      }
    } catch (e) {
      handleReject(e.message)
    }
  }

  const openPicker = () => {
    ImagePickerLib.showImagePicker(imagePickerOptions, handleImage)
  }

  React.useEffect(() => {
    if (typeof source?.name === "string") setIsEmpty(false)
    else if (typeof source === "string" && source !== "profile.png" && source) setIsEmpty(false)
  }, [source])

  return children ? (
    children({ source: getSource(source), openPicker, isEmpty })
  ) : (
    <View style={{ alignContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: "#000000",
          paddingVertical: `${spacing.medium}%`,
          paddingHorizontal: `${spacing.medium + 3}%`,
          borderRadius: 5,
        }}
        onPress={openPicker}
        onLayout={e => {
          setImgDimension({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          })
        }}
      >
        {getSource(
          source,
          <View style={{ alignItems: "center" }}>
            <Icon name="cloudupload" size={50} color={color.palette.blue} />
            <Text preset={["center", "primary", "small"]}>press to add the photo</Text>
          </View>,
          imgDimension,
        )}
      </TouchableOpacity>
    </View>
  )
}
