import { DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { SplashScreen, Stack } from "expo-router"
import { Suspense, useEffect } from "react"
import { TamaguiProvider, Text, Theme } from "tamagui"

import { MySafeAreaView } from "../components/MySafeAreaView"
import AuthProvider from "../providers/auth"
import config from "../tamagui.config"

SplashScreen.preventAutoHideAsync()

export default function Layout() {
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
        <Theme name="light_blue_alt1">
          <ThemeProvider value={DefaultTheme}>
            <MySafeAreaView>
              <AuthProvider>
                <Stack
                  screenOptions={{
                    statusBarTranslucent: true,
                    statusBarStyle: "dark",
                    headerShown: false,
                  }} />
              </AuthProvider>
            </MySafeAreaView>
          </ThemeProvider>
        </Theme>
      </Suspense>
    </TamaguiProvider>
  )
}
