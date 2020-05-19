//импорт зависимостей
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

// стора в которой хранится флаг идет ли запись
const $recording = createStore<boolean>(false)
const setRecording = createEvent<boolean>()
$recording.on(setRecording, (_, x) => x)
/////

//тут хранится информациия  записи
const $recordingData = createStore<null | Audio.Recording>(null)

const recordingStart = createEffect({
  handler: async () => {
    // проверка разрешенна ли запись
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
    // если не завершина ничего не поделать
    if (status !== "granted") return null

    // инициализируем аудио
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    })

    const recording = new Audio.Recording()
    try {
      // передаем опции для записи
      await recording.prepareToRecordAsync(recordingOptions)
      // запускаем запись
      await recording.startAsync()
    } catch (error) {
      console.log(error)
      alert("Ошибка")
      return null
    }

    //и возращаем запись
    return recording
  },
})
$recordingData.on(recordingStart.done, (_, { result }) => result)

const stopRecording = async (recording: Audio.Recording | null) => {
  //останавливаем запись
  if (!recording) return
  try {
    //останавливаем запись
    await recording.stopAndUnloadAsync()

    //отправляем uri файла в стору
    setRecordingSoundUrl(recording.getURI())
  } catch (error) {
    console.log("error stop")
  }
}

//композиция флага записи и информации записи
// если запись идет или записи нет то возращаем нул
const $recordingSoundFx = combine({
  recording: $recording,
  recordingData: $recordingData,
}).map(async ({ recording, recordingData }) => {
  if (!recordingData || recording) return null

  // загружем звуковой файл для воспроизведения, эта функция асинхрона
  // поэтому вернется промис, это что-то схоже на обынчый колбек
  const { sound, status } = await recordingData.createNewLoadedSoundAsync({
    volume: 1,
  })
  return { sound, status }
})

//функция просмотра изменений из прошлой сторы
$recordingSoundFx.watch(async (x) => {
  const res = await x
  //дожидаемся промис (колбек) и отправляем наш звуковой файл в стору
  if (res?.sound && res.status) recordingSoundSet(res)
})

//стора для звукового файла
const $recordingSound = createStore<{
  sound: Audio.Sound
  status: AVPlaybackStatus
} | null>(null)

const recordingSoundSet = createEvent<{
  sound: Audio.Sound
  status: AVPlaybackStatus
} | null>()
$recordingSound.on(recordingSoundSet, (_, x) => x)

// стора uri
const $recordingSoundUrl = createStore<string | null>(null)
const setRecordingSoundUrl = createEvent<string | null>()
$recordingSoundUrl.on(setRecordingSoundUrl, (_, x) => x)

$recordingSoundUrl.watch((uri) => {
  // при каждом изменении сторы отправлем запрос на сервер
  if (uri) {
    fetchSpeech(uri)
    setLoad(false)
  }
})

//стора-флаг обрабатывется ли сейчас файл
const $load = createStore<boolean>(true)
const setLoad = createEvent<boolean>()
$load.on(setLoad, (_, x) => x)

// тут хранятся результаты
const $text = createStore<string>("")

//запрос на сервер
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
    const req = await fetch("http://192.168.0.35:3005/speech", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    }).then((x) => x.json())

    return req.data
  },
})

//запись результата
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
