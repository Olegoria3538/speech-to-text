import React from "react"
import { View, StyleSheet } from "react-native"
import { $recording } from "../model/record"
import { useStore } from "effector-react"
import { Recording } from "../molecules/recording"
import { Menu } from "../molecules/menu"

export const Main = () => {
  const recording = useStore($recording)
  if (recording) return <Recording />
  return (
    <View style={styled.mainWrapper}>
      <View style={styled.texWrapper}></View>
      <Menu />
    </View>
  )
}

const styled = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  texWrapper: {
    flex: 1,
  },
})
