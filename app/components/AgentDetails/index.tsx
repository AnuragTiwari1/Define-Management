import React from "react"
import { View, Text, Image, FlatList } from "react-native"
import { AgentsProps } from "../../screens/landing-screen"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Axios from "axios"
import { ActivityIndicator } from "react-native-paper"
import moment from "moment"
import { defaultAvatar, generatePicUrl } from "../../utils/generatePIcUrl"
import { TouchableOpacity } from "react-native-gesture-handler"
import { color } from "../../theme"

interface ReportProps {
  date1: string
  distance: string
  onDatePress: (date: string) => void
}

const { API_URL } = require("../../config/env")

const Record = (props: ReportProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onDatePress(props.date1)
        // console.log("the date pressed", props.date1)
        // console.log("the jdkdkdkdkkddk")
      }}
    >
      <View
        style={{
          padding: 15,
          borderBottomWidth: 1,
          borderColor: "gray",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        pointerEvents="none"
      >
        <Text>{moment(props.date1, "YYYY-MM-DD").format("LL")}</Text>
        <Text>{props.distance} km</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function AgentDetails(
  props: AgentsProps & { isLoadingTimeSheet: boolean; onDatePress: (date: string) => void },
) {
  const [agentReport, setAgentReport] = React.useState([] as ReportProps[])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (props.userid) {
      const formData = new FormData()
      formData.append("action", "fetchUserReport")
      formData.append("userid", props.userid)

      setLoading(true)

      Axios.request({
        url: "",
        baseURL: API_URL,
        data: formData,
        method: "POST",
      })
        .then(({ data }) => {
          setAgentReport([...data])
          props.onDatePress(data[0].date1)
          setLoading(false)
        })
        .catch(e => {
          setLoading(false)
        })
    }
  }, [props.id])

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 16,
      }}
    >
      <View
        style={{
          width: 100,
          height: 5,
          borderRadius: 15,
          backgroundColor: color.line,
          alignSelf: "center",
          marginBottom: 15,
        }}
      ></View>
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: props.picUrl ? generatePicUrl(props.picUrl) : defaultAvatar }}
          style={{ width: 70, height: 70, borderRadius: 35 }}
        />
        <View style={{ margin: 10, flex: 1 }}>
          <Text>User Id: {props.userid}</Text>
          <Text>Name: {props.name}</Text>
        </View>
        <View style={{ margin: 10, alignItems: "flex-end" }}>
          <FontAwesome name="motorcycle" size={18} color={"gray"} />
          <Text> {props.distance || 0} km</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 15 }}>
          Travel Record
        </Text>
        <View style={{ position: "absolute", right: 10 }}>
          {props.isLoadingTimeSheet && <ActivityIndicator />}
        </View>
      </View>
      <FlatList
        data={agentReport}
        inverted
        renderItem={({ item }) => <Record {...item} onDatePress={props.onDatePress} />}
        ListEmptyComponent={
          loading ? <ActivityIndicator /> : <Text>Reports are unavailable for this user</Text>
        }
      />
    </View>
  )
}
