import React from "react"
import { Screen, Text, Button } from "../components"
import { Switch, TextInput } from "react-native-paper"
import { View, ToastAndroid } from "react-native"
import { load, loadString, saveString, save } from "../utils/storage"
import { AGENT_NAME } from "../config/constanst"
import { useNavigation } from "@react-navigation/native"
import BackgroundJob from "react-native-background-job"
import { useStores } from "../models"
import Axios from "axios"
import { isAngry } from "../utils/apiHelpers"

const { API_URL } = require("../config/env")

export default function SettingScreen() {
  const [agentOptIn, setAgentOptIn] = React.useState(false)
  const [agentName, setAgentName] = React.useState("")
  const [isLoading, setLoading] = React.useState(false)

  const { navigate } = useNavigation()
  const {
    userProfileStore: { iUserId },
  } = useStores()

  React.useEffect(() => {
    ;(async function loader() {
      const agent = await load(AGENT_NAME)
      if (agent && agent?.agentName) {
        setAgentOptIn(true)
        setAgentName(agent.agentName)
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

        <View style={{ width: "80%", marginTop: 35 }}>
          <TextInput
            label="enter your username"
            disabled={!agentOptIn}
            value={agentName}
            onChangeText={setAgentName}
          />
        </View>
      </View>
      <Button
        loading={isLoading}
        disabled={isLoading}
        onPress={async () => {
          if (agentOptIn) {
            if (agentName) {
              try {
                const formData = new FormData()
                formData.append("action", "registerForAgent")
                formData.append("userid", iUserId)
                formData.append("name", agentName)
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
            } else {
              ToastAndroid.showWithGravity(
                "Username is required",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              )
            }
          } else {
            navigate("landing")
          }
        }}
      >
        <Text>Done</Text>
      </Button>
    </Screen>
  )
}
