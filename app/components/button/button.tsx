import * as React from "react"
import { Button as PaperButton } from "react-native-paper"
import { viewPresets } from "./button.presets"
import { spacing } from "../../theme"

type ButtonProps = React.ComponentProps<typeof PaperButton>

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export const Button = (props: ButtonProps) => {
  const { children, style, ...rest } = props
  return (
    <PaperButton
      mode="contained"
      style={[viewPresets.primary, style]}
      contentStyle={{
        paddingVertical: spacing.medium,
        paddingHorizontal: spacing.medium,
      }}
      {...rest}
    >
      {children}
    </PaperButton>
  )
}
