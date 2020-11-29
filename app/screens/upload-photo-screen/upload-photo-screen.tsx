import React, { FunctionComponent as Component, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, Image, Alert, TouchableOpacity, ToastAndroid } from "react-native"
import { Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { FormImagePicker, File } from "../../components/ImagePicker"
import { useNavigation } from "@react-navigation/native"
import Modal from "react-native-modal"
import { useStores } from "../../models"
import Axios from "axios"
import { isAngry } from "../../utils/apiHelpers"

const { API_URL } = require("../../config/env")

const TAB_BAR_HEIGHT = 80

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  justifyContent: "space-around",
}

const ITEMS_CONTAINER: ViewStyle = {
  backgroundColor: color.palette.lighterGrey,
  flex: 1,
  alignItems: "center",
  justifyContent: "space-around",
}

const TAB_BAR_CONTAINER: ViewStyle = {
  height: TAB_BAR_HEIGHT,
  backgroundColor: "white",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
}

const TASK_ITEM_CONTAINER: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingHorizontal: 10,
  paddingVertical: 15,
  margin: 5,
  borderWidth: 1,
  borderRadius: 5,
  alignItems: "center",
}

const taskList = [
  {
    task: "selfie",
    introHeading: "Taka a selfie",
    introText:
      "Please take a photo of your self ensuring that your face is clearly visible. In case of picking from gallery make sure it is one of your latest clicks",
    introImage: require("./selfie.png"),
  },
  {
    task: "document",
    introText:
      "Please take a photo of your self ensuring that your face is clearly visible. In case of picking from gallery make sure it is one of your latest clicks",
    introHeading: "Upload a id proof",
    introImage: require("./id-card.png"),
  },
  {
    task: "building",
    introText:
      "Please take a photo of your self ensuring that your face is clearly visible. In case of picking from gallery make sure it is one of your latest clicks",
    introHeading: "Snap a picture of your building",
    introImage: require("./home.png"),
  },
  {
    task: "locality",
    introText:
      "Please take a photo of your self ensuring that your face is clearly visible. In case of picking from gallery make sure it is one of your latest clicks",
    introHeading: "shows us your locality",
    introImage: require("./place.png"),
  },
  {
    task: "landmark",
    introText:
      "Please take a photo of your self ensuring that your face is clearly visible. In case of picking from gallery make sure it is one of your latest clicks",
    introHeading: "Know a landmark",
    introImage: require("./bridge.png"),
  },
]

export const UploadPhotoScreen: Component = observer(function UploadPhotoScreen() {
  const {
    appStateStore,
    userProfileStore,
    userListStore: { peoplelist, activeIndex },
  } = useStores()
  const navigation = useNavigation()
  const [photos, setPhotos] = useState([null, null, null, null, null])
  const [loading, setLoading] = React.useState(false)

  const [activeTab, setActiveTab] = React.useState(
    null as null | (typeof taskList[number] & { index: number }),
  )
  const [hasUnsavedChanges, setIsUnSaved] = useState(false)

  const goToLanding = () => {
    navigation.navigate("landing")
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", e => {
      if (!hasUnsavedChanges) {
        // If we don't have unsaved changes, then we don't need to do anything
        return
      }

      // Prevent default behavior of leaving the screen
      e.preventDefault()

      // Prompt the user before leaving the screen
      Alert.alert(
        "Discard changes?",
        "You have unsaved changes. Are you sure to discard them and leave the screen?",
        [
          { text: "Don't leave", style: "cancel", onPress: () => {} },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ],
      )
    })
    return unsubscribe
  }, [navigation, hasUnsavedChanges])
  return (
    <Screen style={ROOT} preset="fixed">
      <Text preset={["header", "center"]}>Upload Images</Text>
      {taskList.map((e, i) => {
        return (
          <TouchableOpacity key={e.task} onPress={() => setActiveTab({ ...e, index: i })}>
            <View style={TASK_ITEM_CONTAINER} pointerEvents="none">
              <Text>{e.introHeading}</Text>
              <Image source={e.introImage} style={{ width: 55, height: 45 }} resizeMode="contain" />
            </View>
          </TouchableOpacity>
        )
      })}

      <ScannerIntro
        isActive={Boolean(activeTab)}
        index={activeTab?.index}
        introHeading={activeTab?.introHeading}
        introImage={activeTab?.introImage}
        introText={activeTab?.introText}
        onDismiss={() => setActiveTab(null)}
        defaultImage={photos[activeTab?.index || 0]}
        reviveModal={(index, img) => {
          setPhotos(prevPhotos => {
            return prevPhotos.map((e, i) => {
              return i === index ? img : e
            })
          })
          setIsUnSaved(true)
          appStateStore.toast.setToast({ text: "Photo captured successfully", styles: "success" })
        }}
      />

      <View style={TAB_BAR_CONTAINER}>
        <Text preset={["bold", "angry", "large"]} onPress={goToLanding}>
          Cancel
        </Text>
        <Text
          onPress={() => {
            if (!loading) {
              const formData = new FormData()
              formData.append("action", "uploadPhoto")
              formData.append("lat", appStateStore.location.latitude)
              formData.append("lon", appStateStore.location.longitude)
              formData.append("address", appStateStore.location.address)
              formData.append("userid", userProfileStore.iUserId)
              formData.append("taskid", peoplelist[activeIndex].sId)
              formData.append("photoid", peoplelist[activeIndex].iPhotoId)

              formData.append("annexure", "A")
              formData.append("annexure1", "A")
              formData.append("annexure2", "A")
              formData.append("annexure3", "A")
              formData.append("annexure4", "A")

              formData.append("caption", "")
              formData.append("caption1", "")
              formData.append("caption2", "")
              formData.append("caption3", "")
              formData.append("caption4", "")

              formData.append("uploadimage", photos[0])
              formData.append("uploadimage1", photos[1])
              formData.append("uploadimage2", photos[2])
              formData.append("uploadimage3", photos[3])
              formData.append("uploadimage4", photos[4])

              setLoading(true)

              setIsUnSaved(false)
              Axios.request({
                baseURL: API_URL,
                url: "",
                method: "post",
                data: formData,
                headers: {
                  "content-type": "multipart/form-data",
                },
              })
                .then(({ data }) => {
                  console.log("the photss are uploaded", data)
                  if (!isAngry(data)) {
                    ToastAndroid.showWithGravity(
                      "Photos uploaded successfully",
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM,
                    )
                    setLoading(false)

                    goToLanding()
                  } else {
                    setLoading(false)

                    ToastAndroid.showWithGravity(
                      "Photos upload failed",
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM,
                    )
                  }
                })
                .catch(e => {
                  setLoading(false)
                  console.log(e)
                })
            }
          }}
          preset={["bold", "primary", "large"]}
        >
          {loading ? "Uploading" : "Upload"}
        </Text>
      </View>
    </Screen>
  )
})

const ScannerIntro = ({
  onDismiss,
  isActive,
  introImage,
  introText,
  introHeading,
  defaultImage,
  reviveModal,
  index,
  onDone,
}) => {
  const [capturedImage, setCapturedImage] = React.useState(null)

  React.useEffect(() => {
    setCapturedImage(defaultImage)
  }, [defaultImage])

  return (
    <Modal isVisible={isActive} onRequestClose={onDismiss}>
      {isActive ? (
        <View style={ITEMS_CONTAINER}>
          <View style={{ width: "100%", alignItems: "center", padding: `${spacing.medium}%` }}>
            <Image source={introImage} style={{ width: "50%", height: 150 }} resizeMode="contain" />
            <Text preset={["bold"]} style={{ marginTop: spacing.large }}>
              {introHeading}
            </Text>
            <Text preset={["small", "center", "muted"]}>{introText}</Text>
          </View>
          <FormImagePicker
            handleCapture={(img: File) => {
              reviveModal(index, img)
            }}
            preOpen={onDismiss}
            source={capturedImage}
            handleReject={console.log}
          />
        </View>
      ) : null}
    </Modal>
  )
}
