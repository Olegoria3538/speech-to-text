import React from "react"
import { View, StyleSheet, Image, TouchableHighlight } from "react-native"
import {
  ICON_RECORD_BUTTON,
  ICON_PLAY_BUTTON,
  ICON_STOP_BUTTON,
} from "../ui/icons"
import { setRecording, $recording } from "../model/record"
import { useStore } from "effector-react"
import { Recording } from "../molecules/recording"

export const Main = () => {
  const recording = useStore($recording)
  if (recording) return <Recording />
  return (
    <View style={styled.mainWrapper}>
      <View style={styled.texWrapper}></View>
      <View style={styled.menuWrapper}>
        <TouchableHighlight underlayColor={"white"} onPress={() => alert("f")}>
          <Image source={ICON_PLAY_BUTTON} />
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={"white"}
          onPress={() => setRecording(true)}
        >
          <Image
            style={{ width: 50, height: 60 }}
            source={ICON_RECORD_BUTTON}
          />
        </TouchableHighlight>
        <TouchableHighlight underlayColor={"white"} onPress={() => alert("f")}>
          <Image style={{ width: 30, height: 30 }} source={ICON_STOP_BUTTON} />
        </TouchableHighlight>
      </View>
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
  menuWrapper: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
  },
})
