import React, { FunctionComponent as Component } from "react"
import { Image, ImageStyle, Platform, TextStyle, View, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { BulletItem, Button, Header, Text, Screen, Wallpaper } from "../../components"
import { color, spacing } from "../../theme"
import { Api } from "../../services/api"
import { save } from "../../utils/storage"
export const logoIgnite = require("./logo-ignite.png")
export const heart = require("./heart.png")

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: "blue",
  paddingHorizontal: spacing[4],
}

export const DemoScreen: Component = observer(function DemoScreen() {
  const navigation = useNavigation()
  const goBack = () => () => navigation.goBack()

  return (
    <View style={FULL}>
      <Screen style={CONTAINER} preset="fixed">
        <Text preset="white">Login screen comes here</Text>
      </Screen>
    </View>
  )
})
