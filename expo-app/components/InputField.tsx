import { memo, useId } from "react"
import { Input, InputProps, Label, Text, useTheme } from "tamagui"

type InputFieldProps = InputProps &
{
  label: string
  error: string | null
}

export const InputField = memo(Component)

function Component(props: InputFieldProps) {
  const theme = useTheme()

  const id = useId()

  return <>
    <Label htmlFor={id} col={props.error ? theme.red10 : "unset"}>
      {props.label}
    </Label>

    <Input id={id} theme={props.error ? "red" : "alt1"} {...props} />

    {props.error && <Text mt="$2" col={theme.red10}>{props.error}</Text>}
  </>
}
