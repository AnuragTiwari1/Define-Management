import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, StyleSheet, Image, TextStyle, Dimensions } from "react-native"
import { Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { color, spacing } from "../../theme"
import ActionButton from "react-native-circular-action-menu"
import Icon from "react-native-vector-icons/AntDesign"
import MaterialComunity from "react-native-vector-icons/MaterialCommunityIcons"
import { FormImagePicker } from "../../components/ImagePicker"
import { FormContext, useForm } from "react-hook-form"

const TAB_BAR_HEIGHT = 80
const { width } = Dimensions.get("window")

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

const ACTION_BUTTON_ICON: TextStyle = {
  fontSize: 30,
  height: 32,
  color: "white",
}

type TabNames = "selfie" | "document" | "building" | "locality" | "landmark"

const FABIcons = props => {
  const { name, ...rest } = props
  let renderIcon = null
  switch (name) {
    case "selfie": {
      renderIcon = (
        <MaterialComunity
          name="face-recognition"
          color="white"
          style={ACTION_BUTTON_ICON}
          {...rest}
        />
      )
      break
    }
    case "id-card": {
      renderIcon = (
        <Icon name="idcard" size={35} color="white" style={ACTION_BUTTON_ICON} {...rest} />
      )
      break
    }
    case "home": {
      renderIcon = <Icon name="home" size={35} color="white" style={ACTION_BUTTON_ICON} {...rest} />
      break
    }
    case "bridge": {
      renderIcon = (
        <MaterialComunity name="bridge" color="white" style={ACTION_BUTTON_ICON} {...rest} />
      )
      break
    }
    case "locality": {
      renderIcon = (
        <Icon name="enviromento" size={35} color="white" style={ACTION_BUTTON_ICON} {...rest} />
      )
      break
    }
  }
  return renderIcon
}

export const UploadPhotoScreen: Component = observer(function UploadPhotoScreen() {
  // const { someStore, anotherStore } = useStores()
  // const navigation = useNavigation()
  //

  const [activeTab, setActiveTab] = React.useState("selfie" as TabNames)

  return (
    <Screen style={ROOT} preset="fixed">
      {
        {
          selfie: (
            <ScannerIntro
              name="image1"
              introHeading="Take a selfie"
              introImage={require("./selfie.png")}
              introText="
          Please take a photo of your self ensuring that your face is clearly visible. In case of
          picking from gallary make sure it is one of your latest clicks
        "
            />
          ),
          document: (
            <ScannerIntro
              name="image2"
              introText="Please take a photo of your self ensuring that your face is clearly visible. In case of
          picking from gallary make sure it is one of your latest clicks
"
              introHeading="Upload a id proof"
              introImage={require("./id-card.png")}
            />
          ),
          building: (
            <ScannerIntro
              name="image2"
              introText="Please take a photo of your self ensuring that your face is clearly visible. In case of
          picking from gallary make sure it is one of your latest clicks
"
              introHeading="Snap a picture of your building"
              introImage={require("./home.png")}
            />
          ),
          locality: (
            <ScannerIntro
              name="image2"
              introText="Please take a photo of your self ensuring that your face is clearly visible. In case of
          picking from gallary make sure it is one of your latest clicks
"
              introHeading="shows us your locality"
              introImage={require("./place.png")}
            />
          ),
          landmark: (
            <ScannerIntro
              name="image2"
              introText="Please take a photo of your self ensuring that your face is clearly visible. In case of
          picking from gallary make sure it is one of your latest clicks
"
              introHeading="Know a landmark"
              introImage={require("./bridge.png")}
            />
          ),
        }[activeTab as TabNames]
      }

      <View style={TAB_BAR_CONTAINER}>
        <Text preset={["bold", "angry", "large"]}>Cancel</Text>
        <Text preset={["bold", "primary", "large"]}>Save</Text>
      </View>
      <ActionButton
        buttonColor={color.palette.blue}
        bgColor="rgba(0, 0, 0, 0.75)"
        size={TAB_BAR_HEIGHT}
        radius={width / 3}
        icon={<Icon name="scan1" color={color.palette.white} size={35} degrees={360} />}
      >
        <ActionButton.Item
          buttonColor={color.palette.blue}
          title="New Task"
          size={60}
          onPress={() => setActiveTab("selfie")}
        >
          <FABIcons name="selfie" />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor={color.palette.blue}
          title="Notifications"
          size={60}
          onPress={() => setActiveTab("document")}
        >
          <FABIcons name="id-card" />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor={color.palette.blue}
          size={60}
          title="All Tasks"
          onPress={() => setActiveTab("building")}
        >
          <FABIcons name="home" />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor={color.palette.blue}
          size={60}
          title="All Tasks"
          onPress={() => setActiveTab("landmark")}
        >
          <FABIcons name="bridge" />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor={color.palette.blue}
          size={60}
          title="All Tasks"
          onPress={() => setActiveTab("locality")}
        >
          <FABIcons name="locality" />
        </ActionButton.Item>
      </ActionButton>
    </Screen>
  )
})

const ScannerIntro = ({ name, introImage, introText, introHeading }) => {
  const methods = useForm({ defaultValues: {} })
  return (
    <View style={ITEMS_CONTAINER}>
      <View style={{ width: "100%", alignItems: "center", padding: `${spacing.medium}%` }}>
        <Image source={introImage} style={{ width: "50%", height: 150 }} resizeMode="contain" />
        <Text preset={["bold"]} style={{ marginTop: spacing.large }}>
          {introHeading}
        </Text>
        <Text preset={["small", "center", "muted"]}>{introText}</Text>
      </View>
      <FormContext {...methods}>
        <FormImagePicker name="profilePic" handleReject={text => console.log("the cond is bad")} />
      </FormContext>
    </View>
  )
}
