import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, Image, FlatList, StatusBar, TouchableOpacity } from "react-native"
import { Screen, Text } from "../components"
import { useStores, PersonModalSnapshot } from "../models"
import { color } from "../theme"
import { PRETTY_ERROR_MESSAGE, LOCATION_STORAGE_KEY, DISTANCE_TRAVELLED } from "../config/constanst"
import Axios from "axios"
import Icon from "react-native-vector-icons/AntDesign"
import { load } from "../utils/storage"
import { useNavigation } from "@react-navigation/native"

const { API_URL } = require("../config/env")

const CONTAINER: ViewStyle = {
  backgroundColor: "blue",
}

const BORDER_RADIUS = 50

const HEADER: ViewStyle = {
  marginTop: "25%",
  alignItems: "center",
  justifyContent: "center",
}

const BODY: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.white,
  borderTopLeftRadius: BORDER_RADIUS,
  borderTopRightRadius: BORDER_RADIUS,
  paddingTop: BORDER_RADIUS,
}

const getCleanList = (data): PersonModalSnapshot[] => {
  return Array.isArray(data)
    ? data.map(e => {
        let user = {
          sId: e.iTaskId,
          sName: e.can_unique_id,
          sLabel: e.name_candi,
          iPhotoId: "0",
          sStatus: "0",
        }

        if (data.taskcompleted) {
          const photoObj = data.taskcompleted
          const { type, type1, type2, type3, type4, ...rest } = photoObj
          user = {
            ...user,
            ...rest,
            sStatus: "1",
            sAnnexure: type,
            sAnnexure1: type1,
            sAnnexure2: type2,
            sAnnexure3: type3,
            sAnnexure4: type4,
          }
        }

        return user
      })
    : []
}

export const LandingScreen: Component = observer(function LandingScreen() {
  const { userListStore, appStateStore, userProfileStore } = useStores()

  const [isLoading, setLoading] = React.useState(false)
  const { navigate } = useNavigation()

  const [location, setLocation] = React.useState({ lat: undefined, lon: undefined, dist: 0 })

  React.useEffect(() => {
    ;(async function loadStorage() {
      const locationObj = await load(LOCATION_STORAGE_KEY)
      const prevDistance = await load(DISTANCE_TRAVELLED)

      setLocation({ dist: prevDistance, ...locationObj })
    })()
  }, [])

  React.useEffect(() => {
    fetchList()
  }, [])

  const fetchList = () => {
    const formData = new FormData()
    formData.append("action", "getTodayUsers")
    formData.append("userid", userProfileStore.iUserId)

    setLoading(true)

    Axios.request({
      url: "",
      baseURL: API_URL,
      data: formData,
      method: "POST",
    })
      .then(({ data }) => {
        const userList = getCleanList(data)
        userListStore.setPeopleList(userList)
        setLoading(false)
      })
      .catch(() => {
        appStateStore.toast.setToast({ text: PRETTY_ERROR_MESSAGE, styles: "angry" })
        setLoading(false)
      })
  }

  return (
    <Screen style={CONTAINER} preset="fixed">
      <StatusBar barStyle="light-content" backgroundColor="blue" />
      <View style={HEADER}>
        <Image
          source={require("../theme/assets/logo.png")}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 10,
            backgroundColor: "blue",
          }}
        />
        <Text preset={["white", "large", "bold"]}>We are the best</Text>
      </View>
      <View style={BODY}>
        <FlatList
          data={userListStore.peoplelist}
          renderItem={({ item }) => {
            return (
              <TaskCard
                {...item}
                handlePress={() => {
                  userListStore.setEditIndex(index)
                  navigate("uploadPhoto")
                }}
              />
            )
          }}
          ListHeaderComponent={<Text preset={["large", "bold"]}>Activites</Text>}
          ListHeaderComponentStyle={{ paddingLeft: "5%" }}
          ListEmptyComponent={
            <View style={{ marginTop: "50%" }}>
              <Text preset={["center", "large", "muted"]}>
                {isLoading ? "Loading..." : "No Task for Today"}
              </Text>
            </View>
          }
          keyExtractor={(item, index) => `${index}`}
        />
      </View>

      <View style={{ top: 0, right: 10, position: "absolute" }}>
        <Icon name="setting" size={24} color="white" onPress={() => navigate("settingScreen")} />
      </View>
    </Screen>
  )
})

const TaskCard = ({ sLabel, sName, sStatus, handlePress }) => {
  const isCompleted = sStatus === "1"
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        padding: "5%",
        margin: 10,
        alignItems: "center",
        paddingRight: "10%",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
        borderRadius: 5,
        justifyContent: "space-between",
      }}
      onPress={handlePress}
    >
      <View>
        <Text>{sName}</Text>
        <Text preset={["bold"]} style={{ fontSize: 32 }}>
          {sLabel}
        </Text>
      </View>
      <Icon
        name={isCompleted ? "checkcircle" : "checkcircleo"}
        size={36}
        color={isCompleted ? "green" : "black"}
      />
    </TouchableOpacity>
  )
}
