import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { Calendar } from "@tamagui/lucide-icons"
import { memo, useCallback, useId } from "react"
import { Label, ListItem, Text, useTheme } from "tamagui"

export type DateTimeFieldProps = {
  label: string
  placeholder: string
  value?: Date
  onValueChange?: (datetime: Date) => void
  displayValue?: (datetime: Date) => string
  error: string | null
}

export const DateTimeField = memo(Component)

function Component(props: DateTimeFieldProps) {
  const theme = useTheme()

  const id = useId()

  const openDialog = useCallback(() => {
    DateTimePickerAndroid.open({
      value: props.value ?? new Date(),
      mode: "date",
      onChange: (e, date) => {
        if (e.type !== "set") return

        DateTimePickerAndroid.open({
          value: date!,
          mode: "time",
          onChange: (e, datetime) => {
            if (e.type !== "set") return

            props.onValueChange && props.onValueChange(datetime!)
          },
        })
      },
    })
  }, [props.value])

  return <>
    <Label htmlFor={id} col={props.error ? theme.red10 : undefined}>
      {props.label}
    </Label>

    <ListItem
      bc={props.error ? theme.red2 : theme.color2}
      bw="$0.5"
      boc={props.error ? theme.red6 : theme.color6}
      color={props.error
        ? theme.red10
        : props.value
          ? theme.gray12
          : theme.color7}
      focusable
      pressTheme
      radiused
      iconAfter={<Calendar size="$1" color={props.error ? theme.red6.val : theme.color6.val} />}
      onPress={openDialog}
    >
      {props.value
        ? props.displayValue ? props.displayValue(props.value) : props.value.toLocaleString()
        : props.placeholder}
    </ListItem>

    {props.error && <Text mt="$2" col={theme.red10}>{props.error}</Text>}
  </>
}
