import React, { FunctionComponent as Component, useState } from "react"
import { View, ViewStyle, TextStyle, StatusBar, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Screen, Text } from "../../components"
import { spacing } from "../../theme"
import Lottie from "lottie-react-native"
import Carousel, { Pagination } from "react-native-snap-carousel"
import { useStores } from "../../models"

const { width, height } = Dimensions.get("window")

const FULL: ViewStyle = { flex: 1 }

const CONTAINER: ViewStyle = { backgroundColor: "transparent", alignItems: "center" }

const HEADING: TextStyle = {
  marginBottom: spacing.medium,
}

const SUB_HEADING: TextStyle = {
  marginHorizontal: `${spacing.medium}%`,
}

export const WelcomeScreen: Component = observer(function WelcomeScreen() {
  const navigation = useNavigation()
  const { appStateStore } = useStores()

  const nextScreen = () => {
    appStateStore.setWelcome(true)
    navigation.navigate("demo")
  }

  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <View style={FULL}>
      <StatusBar barStyle="light-content" backgroundColor="blue" />
      <Screen style={CONTAINER} preset="fixed">
        <Carousel
          data={["welcome", "document", "sugar"]}
          renderItem={({ item }) => {
            switch (item) {
              case "welcome":
                return <Welcome />
              case "document":
                return <Document />
              case "sugar":
                return <Sugar onLoginPress={nextScreen} />
              default:
                return null
            }
          }}
          sliderWidth={width}
          itemWidth={width}
          onSnapToItem={setActiveSlide}
        />
        <PaginationComponent length={3} activeSlide={activeSlide} />
      </Screen>
    </View>
  )
})

const Sugar = ({ onLoginPress }) => {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View
        style={{ flex: 1, marginTop: spacing.huge, alignItems: "center", justifyContent: "center" }}
      >
        <Lottie
          source={require("./4251-plant-office-desk.json")}
          autoPlay
          loop
          style={{ width: width * 0.33, height: 200, marginBottom: spacing.medium }}
          colorFilters={[
            {
              keypath: "Layer 2/Scan animation Outlines",
              color: "blue",
            },
          ]}
        />
        <Text style={[HEADING, { fontSize: 32 }]} preset="header">
          That's it folk
        </Text>
        <Text preset={["center", "small"]} style={SUB_HEADING}>
          Sounds simple right. So get on
        </Text>
      </View>
      <Text
        preset={["center", "primaryDarker", "bold"]}
        style={{ padding: spacing.medium }}
        onPress={onLoginPress}
      >
        Login now
      </Text>
    </View>
  )
}

const Document = () => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Lottie
        source={require("./7151-document-scanning.json")}
        autoPlay
        loop
        style={{ width: width * 0.33, height: 200, marginBottom: spacing.medium }}
        colorFilters={[
          {
            keypath: "Layer 2/Scan animation Outlines",
            color: "blue",
          },
        ]}
      />

      <Text preset="header" style={[HEADING, { fontSize: 22 }]}>
        Let's get started
      </Text>
      <Text preset={["center", "small"]} style={SUB_HEADING}>
        Get on-board by following these simple steps. Our app will guide you for hassle free process
      </Text>

      <View style={{ flex: 1, justifyContent: "center" }}>
        <StepComponent
          source={require("./21170-password-protected-cloud-computing.json")}
          style={{ marginStart: 9, marginBottom: -10 }}
          text="Get your credentials"
        />
        <StepComponent
          source={require("./8502-scan-receipt.json")}
          style={{ height: 80 }}
          text="Scan your document"
          textStyle={{ marginStart: spacing.small, marginTop: 10 }}
        />
        <StepComponent
          source={require("./5323-uploading-completed.json")}
          text="Upload documents"
          textStyle={{ marginStart: 5 }}
        />
      </View>
    </View>
  )
}

const StepComponent = ({ source, text, style, textStyle }) => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: `${spacing.tiny}%` }}
    >
      <Lottie
        source={source}
        style={{
          width: 50,
          height: 50,
          marginHorizontal: `${spacing.small}%`,
          marginStart: 5,
          ...style,
        }}
        autoPlay
        loop
      />
      <Text preset={["center", "small", "bold"]} style={textStyle}>
        {text}
      </Text>
    </View>
  )
}

const PaginationComponent = props => {
  return (
    <Pagination
      dotsLength={props.length}
      activeDotIndex={props.activeSlide}
      containerStyle={{ backgroundColor: "transparent" }}
      dotStyle={{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "rgba(0, 0, 255, 0.92)",
      }}
      inactiveDotStyle={
        {
          // Define styles for inactive dots here
        }
      }
      inactiveDotOpacity={0.4}
      inactiveDotScale={0.6}
    />
  )
}

const Welcome = () => (
  <View style={{ alignItems: "center", justifyContent: "center" }}>
    <Lottie
      style={{ width: width * 0.5, height: height * 0.5, marginBottom: spacing.huge }}
      source={require("./21468-my-desk.json")}
      autoPlay
      loop
    />
    <Text preset="header" style={HEADING}>
      Welcome
    </Text>
    <Text preset={["center", "small"]} style={SUB_HEADING}>
      Automatic idenitity verification which enables you to verify your idenitity
    </Text>
  </View>
)
