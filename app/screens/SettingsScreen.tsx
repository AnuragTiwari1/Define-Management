import React from "react"
import { Screen, Text, Button } from "../components"
import { Switch, TextInput } from "react-native-paper"
import { View, ToastAndroid, Alert } from "react-native"
import { load, save } from "../utils/storage"
import { AGENT_NAME } from "../config/constanst"
import { useNavigation } from "@react-navigation/native"
import BackgroundJob from "react-native-background-job"
import { useStores } from "../models"
import Axios from "axios"
import { isAngry } from "../utils/apiHelpers"
import { File, FormImagePicker } from "../components/ImagePicker"

const { API_URL } = require("../config/env")

export default function SettingScreen() {
  const [agentOptIn, setAgentOptIn] = React.useState(false)
  const [agentName, setAgentName] = React.useState("")
  const [isLoading, setLoading] = React.useState(false)
  const [isFirstTime, setFirstTime] = React.useState(true)
  const [avatar, setAvatar] = React.useState(null as null | File)
  const {
    userProfileStore: { iUserId },
    appStateStore,
  } = useStores()

  const { navigate } = useNavigation()

  const doRegister = async () => {
    try {
      const formData = new FormData()
      formData.append("action", "registerForAgent")
      formData.append("userid", iUserId)
      formData.append("name", agentName)
      // formData.append("avatar", avatar)
      setLoading(true)
      const { data } = await Axios.request({
        url: "",
        baseURL: API_URL,
        data: formData,
        method: "POST",
      })

      if (isAngry(data)) {
        ToastAndroid.showWithGravity(
          "Registering Failed. Try Again or contact admin",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        )
        setLoading(false)
      } else {
        ToastAndroid.showWithGravity(
          "You have successfully opted in for agent workflow",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        )

        await save(AGENT_NAME, { agentName, iUserId })
        setLoading(false)

        const backgroundSchedule = {
          jobKey: "myJob",
          allowExecutionInForeground: true,
        }

        BackgroundJob.schedule(backgroundSchedule)
          .then(() => {
            console.log("job is scheduled successfully")
            navigate("landing")
          })
          .catch(err => console.err(err))
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        "Registering Failed. Try Again or contact admin",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      )
    }
  }

  const handleRegisterPress = () => {
    if (agentOptIn) {
      if (agentName && avatar) {
        Alert.alert("Attention!", "The information cannot be edited later. Are you sure?", [
          {
            text: "No",
            onPress: () => {},
          },
          {
            text: "Yes",
            onPress: doRegister,
          },
        ])
      } else {
        appStateStore.toast.setToast({
          text: "Username and profile picture is required",
          styles: "angry",
        })
      }
    } else {
      navigate("landing")
    }
  }

  React.useEffect(() => {
    ;(async function loader() {
      const agent = await load(AGENT_NAME)
      if (agent && agent?.agentName) {
        setAgentOptIn(true)
        setAgentName(agent.agentName)
        setFirstTime(false)
      }
    })()
  }, [])

  return (
    <Screen preset="fixed" style={{ paddingHorizontal: 5, justifyContent: "space-between" }}>
      <View>
        <Text preset={["header", "center"]}>Settings</Text>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Text style={{ width: "80%" }}>Do you want to opt in for agent workflow?</Text>

          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={agentOptIn ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setAgentOptIn}
            value={agentOptIn}
          />
        </View>

        <View style={{ width: "80%", marginVertical: 35 }}>
          <TextInput
            label="enter your username"
            disabled={!agentOptIn}
            value={agentName}
            onChangeText={setAgentName}
          />
        </View>

        {isFirstTime ? (
          <FormImagePicker
            handleCapture={setAvatar}
            source={avatar}
            preOpen={() => {}}
            handleReject={console.log}
            noLocation={true}
          />
        ) : null}
      </View>
      <Button
        loading={isLoading}
        disabled={isLoading || !isFirstTime}
        onPress={handleRegisterPress}
      >
        <Text>{isFirstTime ? "Register" : "Registered"}</Text>
      </Button>
    </Screen>
  )
}
