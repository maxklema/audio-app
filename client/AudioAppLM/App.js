import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {NativeModules, NativeEventEmitter} from 'react-native';
import dgram from 'react-native-udp';

const {AudioRecorder} = NativeModules;
const audioRecorderEvents = new NativeEventEmitter(AudioRecorder);

const localPort = 8081;
const ipAddress = '10.3.248.122';

let client;

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setIsRecordingText] = useState('Record');

  const startRecording = () => {
    setIsRecording(true);
    setIsRecordingText('Recording');

    AudioRecorder.start();
    audioRecorderEvents.addListener('opusAudio', event => {
      // Send OPUS data to the specified IP and port
      if (!client) {
        client = dgram.createSocket('udp4');
        const localPort = 8081;

        client.on('message', function (opusData) {
          // console.log(opusData);
          setTimeout(() => {
            AudioRecorder.playAudio(JSON.parse(opusData.toString()));
          }, 5000);
        });

        client.bind(localPort);
      }

      client.send(
        JSON.stringify(event.buffer),
        undefined,
        undefined,
        3001,
        ipAddress,
        err => {
          if (err) console.error('Error sending data:', err);
        },
      );
    });
  };

  const stopRecording = () => {
    AudioRecorder.stop();
    if (client) {
      client.close();
      client = null; // Reset the client
      setIsRecording(false);
      setIsRecordingText('Stopped');
    }
  };

  const playAudio = () => {
    //nothing
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
});

export default App;
