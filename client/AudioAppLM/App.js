import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {NativeModules} from 'react-native';
const {AudioRecorder} = NativeModules;

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setIsRecordingText] = useState('Record');

  const startRecording = () => {
    AudioRecorder.startRecording();
    setIsRecording(true);
    setIsRecordingText('Recording');
  };

  const stopRecording = () => {
    AudioRecorder.stopRecording();
    setIsRecording(false);
    setIsRecordingText('Record');
  };

  const playAudio = () => {
    AudioRecorder.playAudio();
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
});

export default App;
