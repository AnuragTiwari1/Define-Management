import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { StatusBar, ToastAndroid, View, TouchableOpacity, Text } from "react-native"
import { Screen } from "../components"
import Axios from "axios"
import MapView from "react-native-maps"
import Loader from "../components/loader"
import { Button } from "react-native-paper"
import CustomMarker from "../components/Marker"
import BottomSheet from "reanimated-bottom-sheet"
import AgentDetails from "../components/AgentDetails"
import moment from "moment"

const { API_URL } = require("../config/env")

const defaultPicUrl =
  "https://media-exp1.licdn.com/dms/image/C5103AQGndgxdx1_crA/profile-displayphoto-shrink_400_400/0/1549609591750?e=1613001600&v=beta&t=lpvIestzINfeSDORJWqepMm458MrfW8pGSIrrowkraA"

export interface AgentsProps {
  date1: string // "yyyy-mm-dd"
  distance: string
  id: string
  latitude: string
  longitude: string
  name: string
  userid: string
  picUrl: string
}

const MAP_DELTA = {
  latitudeDelta: 0.07,
  longitudeDelta: 0.04,
}

export const LandingScreen: Component = observer(function LandingScreen() {
  const [isLoading, setLoading] = React.useState(false)
  const [agents, setAgents] = React.useState([] as AgentsProps[])
  const [selectedAgent, setSelectedAgent] = React.useState(null as null | AgentsProps)
  const [region, setRegion] = React.useState({
    latitude: 0,
    longitude: 0,
    ...MAP_DELTA,
  })

  const sheetRef = React.useRef(null)
  console.log("the agentss are>>>>", agents)

  React.useEffect(() => {
    if (agents.length && agents?.[0]) {
      setRegion({
        ...MAP_DELTA,
        latitude: Number(agents?.[0]?.latitude),
        longitude: Number(agents?.[0]?.longitude),
      })
    }
  }, [agents])

  React.useEffect(() => {
    fetchList()
  }, [])

  const fetchList = () => {
    const formData = new FormData()
    formData.append("action", "getAllAgents")
    formData.append("date1", moment().format("YYYY-MM-DD"))

    setLoading(true)

    Axios.request({
      url: "",
      baseURL: API_URL,
      data: formData,
      method: "POST",
    })
      .then(({ data }) => {
        setAgents([...data])
        setLoading(false)
      })
      .catch(e => {
        ToastAndroid.showWithGravity(
          "Something went wrong. Please try again later",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        )
        setLoading(false)
      })
  }

  const handleMarkerPress = (agent: AgentsProps) => {
    setSelectedAgent(agent)
    sheetRef.current.snapTo(1)
  }

  return (
    <Screen style={{ flex: 1 }} preset="fixed">
      <StatusBar barStyle="light-content" backgroundColor="blue" />
      <MapView region={region} style={{ flex: 1 }}>
        {agents.map((marker, index) => (
          <CustomMarker
            key={index}
            coordinate={{ latitude: Number(marker.latitude), longitude: Number(marker.longitude) }}
            title={marker.name}
            picUrl={marker.picUrl}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>
      <Loader loading={isLoading} />

      <TouchableOpacity onPress={fetchList} style={{ position: "absolute", bottom: 15, right: 15 }}>
        <View pointerEvents="none">
          <Button icon={require("../components/icon/icons/reload.png")}>Reload</Button>
        </View>
      </TouchableOpacity>
      <BottomSheet
        ref={ele => (sheetRef.current = ele)}
        snapPoints={[450, 150, 0]}
        initialSnap={2}
        borderRadius={10}
        renderContent={() => <AgentDetails {...selectedAgent} />}
      />
    </Screen>
  )
})
