import { Check, ChevronDown } from "@tamagui/lucide-icons"
import { memo, useId, useMemo } from "react"
import {
  Adapt,
  Label,
  Select,
  SelectProps,
  Sheet,
  Spinner,
  Text,
  useTheme,
} from "tamagui"

export type Item = {
  key: string
  value: string
  text: string
}

export type SelectFieldProps = {
  label: string
  placeholder: string
  items: Item[]
  error: string | null
  selectProps: SelectProps
}

export const SelectField = memo(Component)

function Component(props: SelectFieldProps) {
  const theme = useTheme()

  const id = useId()

  return <>
    <Label htmlFor={id} col={props.error ? theme.red10 : undefined}>
      {props.label}
    </Label>

    <Select id={id} {...props.selectProps}>
      <Select.Trigger
        disabled={props.items.length === 0}
        bc={props.error ? theme.red2 : theme.color2}
        bw="$0.5"
        boc={props.error ? theme.red6 : theme.color6}
        iconAfter={
          props.items.length === 0
            ? <Spinner />
            : <ChevronDown size="$1" color={props.error ? theme.red6.val : theme.color6.val} />
        }
      >
        <Select.Value
          col={props.error
            ? theme.red10
            : props.selectProps.value
              ? theme.gray12
              : theme.color7}
          placeholder={props.placeholder} />
      </Select.Trigger>

      <Adapt>
        <Sheet native modal snapPointsMode="fit">
          <Sheet.Frame>
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <Select.Content>
        <Select.Viewport>
          <Select.Group>
            <Select.Label>{props.label}</Select.Label>

            {useMemo(() =>
              props.items.map((item, i) =>
                <Select.Item
                  index={i}
                  key={item.key}
                  value={item.value}
                >
                  <Select.ItemText>{item.text}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size="$1" color={theme.color8.val} />
                  </Select.ItemIndicator>
                </Select.Item>
              ),
              [props.items],
            )}
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>

    {props.error && <Text mt="$2" col={theme.red10}>{props.error}</Text>}
  </>
}
