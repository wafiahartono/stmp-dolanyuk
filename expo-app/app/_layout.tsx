import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { SplashScreen, Stack } from "expo-router"
import { Suspense, useEffect } from "react"
import { useColorScheme } from "react-native"
import { TamaguiProvider, Text, Theme } from "tamagui"

import { MySafeAreaView } from "../components/MySafeAreaView"
import AuthProvider from "../providers/auth"
import config from "../tamagui.config"

SplashScreen.preventAutoHideAsync()

export default function Layout() {
  const colorScheme = useColorScheme()

  const [fontLoaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf")
  })

  useEffect(() => {
    fontLoaded && SplashScreen.hideAsync()
  }, [fontLoaded])

  if (!fontLoaded) return null

  return (
    <TamaguiProvider config={config}>
      <Suspense fallback={<Text>Loading...</Text>}>
        <Theme name={colorScheme}>
          <ThemeProvider
            value={colorScheme === "light" ? DefaultTheme : DarkTheme}
          >
            <AuthProvider>
              <MySafeAreaView>
                <Stack
                  screenOptions={{
                    statusBarTranslucent: true,
                    headerShown: false,
                  }} />
              </MySafeAreaView>
            </AuthProvider>
          </ThemeProvider>
        </Theme>
      </Suspense>
    </TamaguiProvider>
  )
}
