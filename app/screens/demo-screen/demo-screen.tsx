import React, { FunctionComponent as Component } from "react"
import { View, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Text, Screen, Button } from "../../components"
import { spacing } from "../../theme"
import { useForm, FormContext } from "react-hook-form"
import * as Yup from "yup"
import { FormInput } from "../../components/formInput"
import { useFetch } from "use-fetch-lib"
import { isAngry } from "../../utils/apiHelpers"
import { useStores } from "../../models"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: "blue",
  justifyContent: "flex-end",
}

const FORM_CONTAINER: ViewStyle = {
  backgroundColor: "white",
  paddingTop: `${spacing.large}%`,
  borderTopLeftRadius: spacing.huge * 0.75,
  borderTopRightRadius: spacing.huge * 0.75,
  paddingHorizontal: spacing.large,
  paddingBottom: spacing.large,
}

export const DemoScreen: Component = observer(function DemoScreen() {
  const methods = useForm({
    defaultValues: {
      userId: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      userId: Yup.string().required(),
      password: Yup.string().required(),
    }),
  })

  const { navigate } = useNavigation()
  const nextScreen = () => navigate("uploadPhoto")

  const { appStateStore } = useStores()

  const [{ data, status }, doLogin] = useFetch({
    url: "",
    method: "post",
  })

  React.useEffect(() => {
    if (status.isFulfilled) {
      if (isAngry(data)) {
        appStateStore.toast.setToast({ text: isAngry(data), styles: "angry" })
      }
    }
  }, [status])

  const onSubmit = data => {
    const formData = new FormData()
    formData.append("action", "login")
    formData.append("phone", data.userId)
    formData.append("password", data.password)

    doLogin(formData)
  }

  return (
    <View style={FULL}>
      <Screen style={CONTAINER} preset="fixed">
        <Text
          preset={["header", "white"]}
          style={{ paddingStart: spacing.large, paddingBottom: spacing.large }}
        >
          Sign in
        </Text>
        <View style={FORM_CONTAINER}>
          <Text preset={["xLarge", "bold"]}>Hello</Text>
          <Text preset={["small"]}>create an account and let us handle the rest</Text>
          <FormContext {...methods}>
            <FormInput name="userId" label="User name" />
            <FormInput name="password" label="Password" secureTextEntry />
            <Button onPress={methods.handleSubmit(onSubmit)}>Get Started</Button>
          </FormContext>
        </View>
      </Screen>
    </View>
  )
})
