import React, { useState, useEffect } from "react"
import { View, StyleSheet, Text } from "react-native"
import { $recording, $text, $load } from "../model/record"
import { useStore } from "effector-react"
import { Recording } from "../molecules/recording"
import { Menu } from "../molecules/menu"
import Constants from "expo-constants"

export const Main = () => {
  const recording = useStore($recording)
  const text = useStore($text)
  const load = useStore($load)
  const [dot, setDot] = useState("..")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDot(dot.length === 3 ? "." : `${dot}.`)
    }, 300)
    return () => {
      clearTimeout(timer)
    }
  }, [load, dot])

  if (recording) return <Recording />
  return (
    <View style={styled.mainWrapper}>
      <View style={styled.texWrapper}>
        <Text>{load ? text : `Обрабатываем соообшение${dot}`}</Text>
      </View>
      <Menu />
    </View>
  )
}

const styled = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  texWrapper: {
    flex: 1,
    padding: 10,
  },
})
