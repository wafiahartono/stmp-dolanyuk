import { CalendarCheck2, Search, User } from "@tamagui/lucide-icons"
import { Tabs } from "expo-router"
import { SizableText, getTokens } from "tamagui"

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: getTokens().size["7"].val
        },
      }}>

      <Tabs.Screen
        name="events"
        options={{
          tabBarLabel: ({ focused }) => (
            <SizableText
              size="$3"
              mt="$-2.5"
              mb="$2.5"
              ta="center"
              col={focused ? "$blue10" : "$gray10"}>
              Events
            </SizableText>
          ),

          tabBarIcon: ({ focused }) => (
            <CalendarCheck2
              size="$1.5"
              color={focused ? "$blue10" : "$gray10"} />
          )
        }} />

      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: ({ focused }) => (
            <SizableText
              size="$3"
              mt="$-2.5"
              mb="$2.5"
              ta="center"
              col={focused ? "$blue10" : "$gray10"}>
              Search
            </SizableText>
          ),

          tabBarIcon: ({ focused }) => (
            <Search
              size="$1.5"
              color={focused ? "$blue10" : "$gray10"} />
          )
        }} />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: ({ focused }) => (
            <SizableText
              size="$3"
              mt="$-2.5"
              mb="$2.5"
              ta="center"
              col={focused ? "$blue10" : "$gray10"}>
              Profile
            </SizableText>
          ),

          tabBarIcon: ({ focused }) => (
            <User
              size="$1.5"
              color={focused ? "$blue10" : "$gray10"} />
          )
        }} />
    </Tabs>
  )
}
