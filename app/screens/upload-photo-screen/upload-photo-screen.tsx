import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, Image, Alert, TouchableOpacity } from "react-native"
import { Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { FormImagePicker } from "../../components/ImagePicker"
import { useNavigation } from "@react-navigation/native"
import Modal from "react-native-modal"

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
  // const { someStore, anotherStore } = useStores()
  const navigation = useNavigation()

  const [activeTab, setActiveTab] = React.useState(null as null | typeof taskList[number])
  const hasUnsavedChanges = true

  const goToLanding = () => {
    navigation.navigate("landing")
  }

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", e => {
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
      }),
    [navigation, hasUnsavedChanges],
  )
  return (
    <Screen style={ROOT} preset="fixed">
      <Text preset={["header", "center"]}>Upload Images</Text>
      {taskList.map(e => {
        return (
          <TouchableOpacity
            style={TASK_ITEM_CONTAINER}
            key={e.task}
            onPress={() => setActiveTab(e)}
          >
            <Text>{e.introHeading}</Text>
            <Image source={e.introImage} style={{ width: 55, height: 45 }} resizeMode="contain" />
          </TouchableOpacity>
        )
      })}

      <ScannerIntro
        isActive={Boolean(activeTab)}
        introHeading={activeTab?.introHeading}
        introImage={activeTab?.introImage}
        introText={activeTab?.introText}
        onDismiss={() => setActiveTab(null)}
        defaultImage={null}
      />

      <View style={TAB_BAR_CONTAINER}>
        <Text preset={["bold", "angry", "large"]} onPress={goToLanding}>
          Cancel
        </Text>
        <Text preset={["bold", "primary", "large"]}>Upload</Text>
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
            handleCapture={img => {
              setCapturedImage(img)
            }}
            source={capturedImage}
            handleReject={console.log}
          />
        </View>
      ) : null}
    </Modal>
  )
}
