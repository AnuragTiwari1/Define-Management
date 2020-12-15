import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { StatusBar, ToastAndroid, View, TouchableOpacity } from "react-native"
import { Screen } from "../components"
import Axios from "axios"
import MapView, { Polyline } from "react-native-maps"
import Loader from "../components/loader"
import { Button } from "react-native-paper"
import CustomMarker from "../components/Marker"
import BottomSheet from "reanimated-bottom-sheet"
import AgentDetails from "../components/AgentDetails"
import moment from "moment"

const { API_URL } = require("../config/env")

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

interface ITimeSheet {
  latitude: string
  longitude: string
}

export const LandingScreen: Component = observer(function LandingScreen() {
  const [isLoading, setLoading] = React.useState(false)
  const [agents, setAgents] = React.useState([] as AgentsProps[])
  const [selectedAgent, setSelectedAgent] = React.useState(null as null | AgentsProps)
  const [timesheet, setTimeSheet] = React.useState([] as ITimeSheet[])
  const [selectedDate, setSelectedDate] = React.useState("" as string)
  const [mode, setMode] = React.useState<"agents" | "route">("agents")
  const [isLoadingTimeSheet, setTimeSheetLoading] = React.useState(false)

  const [region, setRegion] = React.useState({
    latitude: 0,
    longitude: 0,
    ...MAP_DELTA,
  })

  const sheetRef = React.useRef(null)

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

  React.useEffect(() => {
    if (selectedDate && selectedAgent) {
      setTimeSheetLoading(true)
      setTimeout(() => {
        setTimeSheet([
          { latitude: "25.6170267", longitude: "85.0913881" },
          { latitude: "25.6665248", longitude: "85.08161628" },
          { latitude: "25.6734153", longitude: "85.08577787" },
          { latitude: "25.6948605", longitude: "85.08596065" },
        ])
        setTimeSheetLoading(false)
      }, 2000)
    }
  }, [selectedAgent, selectedDate])

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
        {mode === "agents" &&
          agents.map((marker, index) => (
            <CustomMarker
              key={index}
              coordinate={{
                latitude: Number(marker.latitude),
                longitude: Number(marker.longitude),
              }}
              title={marker.name}
              picUrl={marker.picUrl}
              onPress={() => handleMarkerPress(marker)}
            />
          ))}
        {mode === "route" && (
          <Polyline
            coordinates={timesheet.map(({ latitude, longitude }) => ({
              latitude: Number(latitude),
              longitude: Number(longitude),
            }))}
            strokeColor="#000"
            strokeWidth={6}
          />
        )}
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
        onOpenEnd={() => {
          setMode("route")
          setRegion({
            ...MAP_DELTA,
            latitude: Number(timesheet[0].latitude),
            longitude: Number(timesheet[0].longitude),
          })
        }}
        onCloseEnd={() => {
          setMode("agents")
          setSelectedAgent(null)
          setSelectedDate("")
        }}
        borderRadius={10}
        renderContent={() => (
          <AgentDetails
            isLoadingTimeSheet={isLoadingTimeSheet}
            {...selectedAgent}
            onDatePress={setSelectedDate}
          />
        )}
      />
    </Screen>
  )
})
