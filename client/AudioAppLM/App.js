import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {NativeModules, NativeEventEmitter} from 'react-native';
import dgram from 'react-native-udp';
import TcpSocket from 'react-native-tcp-socket';

const {AudioRecorder} = NativeModules;
const audioRecorderEvents = new NativeEventEmitter(AudioRecorder);

const localPort = 8081;
const ipAddress = '10.3.196.53';

let udpSocket;
let tcpSocket;

const options = {
  port: 3000,
  localport: 5000,
  host: ipAddress,
};

tcpSocket = TcpSocket.createConnection(options, () => {
  tcpSocket.write(JSON.stringify({type: 'Office'}));
});

const App = () => {
  const [isRecording, setIsRecording] = useState(true);
  const [recordingText, setIsRecordingText] = useState('Mute');
  const [activeRoom, setActiveRoom] = useState('Office');

  const joinRoom = room => {
    setActiveRoom(room);

    tcpSocket.write(JSON.stringify({type: room}));
    

    AudioRecorder.start();
    audioRecorderEvents.addListener('opusAudio', event => {
      if (!udpSocket) {
        udpSocket = dgram.createSocket('udp4');

        udpSocket.on('message', function (opusData) {
          let compressedOpus = JSON.parse(opusData.toString()).opus;
          AudioRecorder.playAudio(compressedOpus);
        });
        udpSocket.bind(localPort, () => {
          udpSocket.dropMembership()
          udpSocket.addMembership(room === "Office" ? "239.1.1.1" : "239.2.2.2")
        });
       
      }

      let audioData = {
        opus: event.buffer,
      };

      udpSocket.send(
        JSON.stringify(audioData),
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
    setActiveRoom('');

    AudioRecorder.stop();
    if (udpSocket) {
      udpSocket.close();
      udpSocket = null; // Reset the udpSocket
    }

    audioRecorderEvents.removeAllListeners('opusAudio');
  };

  useEffect(() => {
    isRecording ? setIsRecordingText('Mute') : setIsRecordingText('Unmute');
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
      <View style={styles.roomContainer}>
        <Pressable
          style={activeRoom === 'Office' ? styles.leaveRoom : styles.joinRoom}
          onPress={
            activeRoom === 'Office' ? leaveRoom : () => joinRoom('Office')
          }>
          <Text style={styles.recordText}>
            {activeRoom === 'Office' ? 'Leave' : 'Office'}
          </Text>
        </Pressable>
        <Pressable
          style={
            activeRoom === 'Conference' ? styles.leaveRoom : styles.joinRoom
          }
          onPress={
            activeRoom === 'Conference'
              ? leaveRoom
              : () => joinRoom('Conference')
          }>
          <Text style={styles.recordText}>
            {activeRoom === 'Conference' ? 'Leave' : 'Conference'}
          </Text>
        </Pressable>
      </View>
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
  roomContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignContent: 'center',
    flexDirection: 'row',
    width: '80%',
  },
});

export default App;
