import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, StyleSheet, Image } from "react-native"
import { Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"
import { color, spacing } from "../../theme"
import ActionButton from "react-native-circular-action-menu"
import Icon from "react-native-vector-icons/AntDesign"
import { FormImagePicker } from "../../components/ImagePicker"
import { FormContext, useForm } from "react-hook-form"

const TAB_BAR_HEIGHT = 80

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
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

export const UploadPhotoScreen: Component = observer(function UploadPhotoScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={ROOT} preset="fixed">
      <ScannerIntro />
      <View style={TAB_BAR_CONTAINER}>
        <Text preset={["bold", "angry", "large"]}>Cancel</Text>
        <Text preset={["bold", "primary", "large"]}>Save</Text>
      </View>
      <ActionButton
        buttonColor={color.palette.blue}
        bgColor="rgba(0, 0, 0, 0.75)"
        size={TAB_BAR_HEIGHT}
        icon={<Icon name="scan1" color={color.palette.white} size={35} degrees={360} />}
      >
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="New Task"
          onPress={() => console.log("notes tapped!")}
        >
          <Icon name="android-create" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor="#3498db" title="Notifications" onPress={() => {}}>
          <Icon name="android-notifications-none" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor="#1abc9c" title="All Tasks" onPress={() => {}}>
          <Icon name="android-done-all" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </Screen>
  )
})

const ScannerIntro = () => {
  const methods = useForm({ defaultValues: {} })
  return (
    <View style={ITEMS_CONTAINER}>
      <View style={{ width: "100%", alignItems: "center", padding: `${spacing.medium}%` }}>
        <Image
          source={require("./selfie.png")}
          style={{ width: "50%", height: 150 }}
          resizeMode="contain"
        />
        <Text preset={["bold"]} style={{ marginTop: spacing.large }}>
          Take A Selfie
        </Text>
        <Text preset={["small", "center", "muted"]}>
          Please take a photo of your self ensuring that your face is clearly visible. In case of
          picking from gallary make sure it is one of your latest clicks
        </Text>

      </View>
					 <FormContext {...methods}>
        <FormImagePicker
          name="profilePic"
          handleReject={(text) => console.log("the cond is bad")}
        />
      </FormContext>

    </View>
  )
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    color: color.palette.white,
    fontSize: 20,
    height: 22,
  },
})
