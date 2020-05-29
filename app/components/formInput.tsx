import React from "react"
import { Controller, ControllerProps, useFormContext } from "react-hook-form"
import { TextInput, HelperText } from "react-native-paper"
import { color, spacing } from "../theme"
import { Text } from "./text/text"
import { View } from "react-native"

export interface FormInputProps
  extends React.ComponentProps<typeof TextInput>,
    Omit<ControllerProps<any>, "as"> {
  required?: boolean
  placeholder?: string
  value?: string
  label?: string
}

export const inputContainerStyle = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 0.4,
  },
  shadowOpacity: 0.3,
  shadowRadius: 1.65,
  elevation: 2,
  backgroundColor: color.palette.white,
  borderWidth: 0.4,
  marginVertical: `${spacing.tiny}%`,
}

export const FormInput = (props: FormInputProps) => {
  const {
    name,
    required = false,
    label,
    placeholder = label,
    defaultValue = "",
    value,
    onChange,
    ...rest
  } = props
  const { errors, control } = useFormContext()
  const isErrored = `${errors?.[name]?.message ?? ""}`.length > 0
  return (
    <View>
      <Controller
        as={
          <StyledTextInput
            label={required ? `${label}*` : label}
            error={isErrored}
            placeholder={placeholder}
            style={inputContainerStyle}
            {...rest}
          />
        }
        name={name}
        onChangeName={props.mask ? "onChangeText" : "onChange"}
        onChange={
          onChange && typeof onChange === "function"
            ? onChange
            : args => (props.mask ? args[0] : args[0].nativeEvent.text)
        }
        {...{ defaultValue, control }}
      />
      <HelperText type="error" visible={isErrored}>
        {errors?.[name]?.message}
      </HelperText>
    </View>
  )
}

export const StyledTextInput = props => {
  return <TextInput {...props} />
}

export const FormTextArea = (props: FormInputProps & { limit?: number }) => {
  const { watch } = useFormContext()
  const value = watch(props.name) || ""
  const { limit = 500 } = props
  return (
    <View style={{ marginVertical: `${spacing[1]}%` }}>
      <FormInput
        multiline={true}
        numberOfLines={3}
        textAlignVertical="top"
        style={[inputContainerStyle, { marginVertical: 0, height: 150 }]}
        {...props}
      />
      <Text
        preset={["small", "muted"]}
        style={{ alignSelf: "flex-end", paddingHorizontal: `${spacing[0]}%` }}
      >
        {value.length}/{limit.toString()}
      </Text>
    </View>
  )
}
