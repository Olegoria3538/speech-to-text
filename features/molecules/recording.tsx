import React, { useState, useEffect } from "react"
import { View, StyleSheet, Image, TouchableHighlight, Text } from "react-native"
import { iconMicrophone } from "../ui/icons"
import {
  recordingStart,
  setRecording,
  $recordingData,
  stopRecording,
} from "../model/record"
import { useStore } from "effector-react"

export const Recording = () => {
  const recordingData = useStore($recordingData)
  const [time, setTime] = useState<number>(0)
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(time + 1)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [time])
  useEffect(() => {
    recordingStart()
  }, [])

  return (
    <View style={styled.wrapper}>
      <TouchableHighlight
        underlayColor={"white"}
        onPress={async () => {
          await stopRecording(recordingData)
          setRecording(false)
        }}
      >
        <Image
          style={{ width: 50 * 3, height: 90 * 3 }}
          source={iconMicrophone}
        />
      </TouchableHighlight>
      <Text style={styled.text}>{time}</Text>
    </View>
  )
}

const styled = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 20,
  },
})
