import React from "react"
import { Screen, Text, Button } from "../components"
import { Switch, TextInput } from "react-native-paper"
import { View, ToastAndroid } from "react-native"
import { load, loadString, saveString } from "../utils/storage"
import { AGENT_NAME } from "../config/constanst"
import { useNavigation } from "@react-navigation/native"
import BackgroundJob from "react-native-background-job"

export default function SettingScreen() {
  const [agentOptIn, setAgentOptIn] = React.useState(false)
  const [agentName, setAgentName] = React.useState("")

  const { navigate } = useNavigation()

  React.useEffect(() => {
    ;(async function loader() {
      const agentName = await loadString(AGENT_NAME)
      if (agentName) {
        setAgentOptIn(true)
        setAgentName(agentName)
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
        onPress={async () => {
          if (agentOptIn) {
            if (agentName) {
              ToastAndroid.showWithGravity(
                "You have successfully opted in for agent workflow",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              )

              await saveString(AGENT_NAME, agentName)

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
