import {
  createEvent,
  createStore,
  createEffect,
  combine,
  Store,
} from "effector"
import { Audio, AVPlaybackStatus } from "expo-av"
import * as Permissions from "expo-permissions"
import { recordingOptions } from "../utils/recording"
import * as FileSystem from "expo-file-system"

const $recording = createStore<boolean>(false)
const setRecording = createEvent<boolean>()
$recording.on(setRecording, (_, x) => x)

const $recordingData = createStore<null | Audio.Recording>(null)

const recordingStart = createEffect({
  handler: async () => {
    // request permissions to record audio
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
    // if the user doesn't allow us to do so - return as we can't do anything further :(
    if (status !== "granted") return null
    // when status is granted - setting up our state

    // basic settings before we start recording,
    // you can read more about each of them in expo documentation on Audio
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    })
    const recording = new Audio.Recording()
    try {
      // here we pass our recording options
      await recording.prepareToRecordAsync(recordingOptions)
      // and finally start the record
      await recording.startAsync()
    } catch (error) {
      console.log(error)
      // we will take a closer look at stopRecording function further in this article
      alert("Ошибка")
      return null
    }

    // if recording was successful we store the result in variable,
    // so we can refer to it from other functions of our component
    return recording
  },
})
$recordingData.on(recordingStart.done, (_, { result }) => result)

const stopRecording = async (recording: Audio.Recording | null) => {
  // set our state to false, so the UI knows that we've stopped the recording
  if (!recording) return
  try {
    // stop the recording
    await recording.stopAndUnloadAsync()
    setRecordingSoundUrl(recording.getURI())
  } catch (error) {
    console.log("error stop")
  }
}

const $recordingSoundFx = combine({
  recording: $recording,
  recordingData: $recordingData,
}).map(async ({ recording, recordingData }) => {
  if (!recordingData || recording) return null
  const { sound, status } = await recordingData.createNewLoadedSoundAsync({
    volume: 1,
  })
  return { sound, status }
})

$recordingSoundFx.watch(async (x) => {
  const res = await x
  if (res?.sound && res.status) recordingSoundSet(res)
})

const $recordingSound = createStore<{
  sound: Audio.Sound
  status: AVPlaybackStatus
} | null>(null)

const recordingSoundSet = createEvent<{
  sound: Audio.Sound
  status: AVPlaybackStatus
} | null>()
$recordingSound.on(recordingSoundSet, (_, x) => x)

const $recordingSoundUrl = createStore<string | null>(null)
const setRecordingSoundUrl = createEvent<string | null>()
$recordingSoundUrl.on(setRecordingSoundUrl, (_, x) => x)

$recordingSoundUrl.watch((uri) => {
  if (uri) {
    fetchSpeech(uri)
    setLoad(false)
  }
})

const $load = createStore<boolean>(true)
const setLoad = createEvent<boolean>()
$load.on(setLoad, (_, x) => x)

const $text = createStore<string>("")

const fetchSpeech = createEffect<string, string, any>({
  handler: async (datum) => {
    const { uri } = await FileSystem.getInfoAsync(datum)
    const formData = new FormData()
    const meta = {
      uri,
      type: "audio/x-wav",
      name: "speech2text",
    }
    formData.append(
      "file",
      //@ts-ignore
      meta
    )
    const req = await fetch("http://172.16.45.154:3005/speech", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    }).then((x) => x.json())

    return req.data
  },
})

$text.on(fetchSpeech.done, (_, { result }) => result)
$load.on(fetchSpeech.done, (_) => true)

export {
  $recording,
  setRecording,
  $recordingData,
  recordingStart,
  stopRecording,
  $recordingSound,
  $recordingSoundUrl,
  $text,
  $load,
}
