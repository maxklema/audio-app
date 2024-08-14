import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {NativeModules} from 'react-native';
import {Slider} from '@rneui/themed';
const {AudioRecorder} = NativeModules;

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setIsRecordingText] = useState('Record');
  const [volume, setVolume] = useState(0.3);

  const startRecording = () => {
    AudioRecorder.start();
    setIsRecording(true);
    setIsRecordingText('Recording');
  };

  const stopRecording = () => {
    AudioRecorder.stop();
    setIsRecording(false);
    setIsRecordingText('Record');
  };

  const playAudio = () => {
    AudioRecorder.play();
  };

  const toggleVolume = audioVolume => {
    setVolume(audioVolume);
    // AudioRecorder.toggleVolume(audioVolume);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Audio Encoder / Decoder Demo</Text>
      <Text>Click the button below to record audio Data</Text>
      <Pressable
        style={[
          !isRecording && styles.notRecording,
          isRecording && styles.recording,
        ]}
        onPressIn={startRecording}
        onPressOut={stopRecording}>
        <Text style={styles.recordText}>{recordingText}</Text>
      </Pressable>
      <Pressable style={styles.recording} onPress={playAudio}>
        <Text style={styles.recordText}>Play Recording</Text>
      </Pressable>
      <Slider
        value={volume}
        onValueChange={value => toggleVolume(value)}
        maximumValue={1.0}
        minimumValue={0.0}
        step={0.01}
        allowTouchTrack
        trackStyle={{height: 5, width: 200, backgroundColor: 'red'}}
        thumbStyle={{height: 20, width: 20, backgroundColor: 'red'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  notRecording: {
    backgroundColor: 'blue',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginTop: '10%',
  },
  recording: {
    backgroundColor: 'orange',
    opacity: 1.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginTop: '10%',
  },
  recordText: {
    fontSize: 19,
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 21,
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  slider: {
    marginTop: 100,
    width: 200,
  },
});

export default App;
