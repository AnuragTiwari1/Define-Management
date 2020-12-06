import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { StatusBar, ToastAndroid, View, TouchableOpacity } from "react-native"
import { Screen } from "../components"
import Axios from "axios"
import MapView, { Marker } from "react-native-maps"
import Loader from "../components/loader"
import { Button } from "react-native-paper"

const { API_URL } = require("../config/env")

export const LandingScreen: Component = observer(function LandingScreen() {
  const [isLoading, setLoading] = React.useState(false)
  const [agents, setAgents] = React.useState([])
  const [region, setRegion] = React.useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.07,
    longitudeDelta: 0.04,
  })

  React.useEffect(() => {
    setRegion({
      ...region,
      latitude: Number(agents?.[0]?.latitude || 0),
      longitude: Number(agents?.[0]?.longitude) || 0,
    })
  }, [agents])

  React.useEffect(() => {
    fetchList()
  }, [])

  const fetchList = () => {
    const formData = new FormData()
    formData.append("action", "getAllAgents")

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

  return (
    <Screen style={{ flex: 1 }} preset="fixed">
      <StatusBar barStyle="light-content" backgroundColor="blue" />
      <MapView initialRegion={region} style={{ flex: 1 }}>
        {agents.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: Number(marker.latitude), longitude: Number(marker.longitude) }}
            title={marker.name}
            description={`userId:${marker.userId} distance travelled: ${marker.distance}km`}
          />
        ))}
      </MapView>
      <Loader loading={isLoading} />

      <TouchableOpacity onPress={fetchList} style={{ position: "absolute", bottom: 15, right: 15 }}>
        <View pointerEvents="none">
          <Button icon={require("../components/icon/icons/reload.png")}>Reload</Button>
        </View>
      </TouchableOpacity>
    </Screen>
  )
})
