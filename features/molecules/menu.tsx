import React from "react"
import { View, StyleSheet, Image, TouchableHighlight } from "react-native"
import {
  ICON_RECORD_BUTTON,
  ICON_PLAY_BUTTON,
  ICON_STOP_BUTTON,
} from "../ui/icons"
import { setRecording, $recordingSound } from "../model/record"
import { useStore } from "effector-react"

export const Menu = () => {
  const recordingSound = useStore($recordingSound)

  return (
    <View style={styled.menuWrapper}>
      <TouchableHighlight
        underlayColor={"white"}
        onPress={() => recordingSound?.sound?.playAsync()}
      >
        <Image source={ICON_PLAY_BUTTON} />
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={"white"}
        onPress={() => setRecording(true)}
      >
        <Image style={{ width: 50, height: 60 }} source={ICON_RECORD_BUTTON} />
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={"white"}
        onPress={() => recordingSound?.sound?.stopAsync()}
      >
        <Image style={{ width: 30, height: 30 }} source={ICON_STOP_BUTTON} />
      </TouchableHighlight>
    </View>
  )
}

const styled = StyleSheet.create({
  menuWrapper: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
  },
})
