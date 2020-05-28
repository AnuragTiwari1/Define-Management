import * as React from "react"
import { Button as PaperButton } from "react-native-paper"
import { spacing } from "../../theme"
import { viewPresets } from "./button.presets"

type ButtonProps = React.ComponentProps<typeof PaperButton>

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export const Button = (props: ButtonProps) => {
  const { children, style, ...rest } = props
  return (
    <PaperButton mode="contained" style={{ ...viewPresets.primary }}>
      {children}
    </PaperButton>
  )
}
