import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {NativeModules, NativeEventEmitter} from 'react-native';
import dgram from 'react-native-udp';

const {AudioRecorder} = NativeModules;
const audioRecorderEvents = new NativeEventEmitter(AudioRecorder);

const localPort = 8081;
const ipAddress = '10.3.248.122';

let client;

const App = () => {
  const [isRecording, setIsRecording] = useState(true);
  const [recordingText, setIsRecordingText] = useState('Mute');
  const [isInRoom, setIsInRoom] = useState(false);
  const [isInRoomText, setIsInRoomText] = useState('Join Room');

  const joinRoom = () => {
    setIsInRoom(true);
    setIsInRoomText('Leave Room');

    AudioRecorder.start();
    audioRecorderEvents.addListener('opusAudio', event => {
      // Send OPUS data to the specified IP and port
      if (!client) {
        client = dgram.createSocket('udp4');

        client.on('message', function (opusData) {
          // setTimeout(() => {
          AudioRecorder.playAudio(JSON.parse(opusData.toString()));
          // }, 3000);
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

  const leaveRoom = () => {
    setIsInRoom(false);
    setIsInRoomText('Join Room');

    AudioRecorder.stop();
    if (client) {
      client.close();
      client = null; // Reset the client
    }
  };

  useEffect(() => {
    isRecording ? setIsRecordingText('Mute') : setIsRecordingText('Muted');
    AudioRecorder.toggleMute(isRecording);
  }, [isRecording]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Audio Encoder / Decoder Demo</Text>
      <Text>Click the button below to stream audio data</Text>
      <Pressable
        style={[
          !isRecording && styles.notRecording,
          isRecording && styles.recording,
        ]}
        onPress={() => setIsRecording(prev => !prev)}>
        <Text style={styles.recordText}>{recordingText}</Text>
      </Pressable>
      <Pressable
        style={isInRoom ? styles.leaveRoom : styles.joinRoom}
        onPress={isInRoom ? leaveRoom : joinRoom}>
        <Text style={styles.recordText}>{isInRoomText}</Text>
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
    backgroundColor: 'red',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginTop: '10%',
  },
  recording: {
    backgroundColor: 'grey',
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
  joinRoom: {
    backgroundColor: 'blue',
    opacity: 1.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginTop: '10%',
  },
  leaveRoom: {
    backgroundColor: 'red',
    opacity: 1.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginTop: '10%',
  },
});

export default App;
