import React from "react"
import { View, StyleSheet, Image, TouchableHighlight } from "react-native"
import { iconMicrophone, iconPlay, iconStop } from "../ui/icons"
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
        <Image style={{ width: 60, height: 80 }} source={iconPlay} />
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={"white"}
        onPress={() => setRecording(true)}
      >
        <Image style={{ width: 50, height: 90 }} source={iconMicrophone} />
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={"white"}
        onPress={() => recordingSound?.sound?.stopAsync()}
      >
        <Image style={{ width: 60, height: 60 }} source={iconStop} />
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
