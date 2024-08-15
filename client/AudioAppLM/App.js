import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {NativeModules, NativeEventEmitter} from 'react-native';
import {Slider} from '@rneui/themed';
import dgram from 'react-native-udp';

const {AudioRecorder} = NativeModules;
const audioRecorderEvents = new NativeEventEmitter(AudioRecorder);

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setIsRecordingText] = useState('Record');
  const [volume, setVolume] = useState(0.3);

  const client = dgram.createSocket('udp4');
  client.bind(8081);
  const ipAddress = '10.3.196.53';

  client.on('message', function (msg, rinfo) {
    console.log('New Message', msg.toString(), rinfo);
  });

  // client.on('listening', () => {
  //   client.addMembership('239.99.211.90');
  // });

  const startRecording = () => {
    setIsRecording(true);
    setIsRecordingText('Recording');

    AudioRecorder.start();

    audioRecorderEvents.addListener('opusAudio', event => {
      //send OPUS data to multicast group
      client.send(
        JSON.stringify(event.buffer),
        undefined,
        undefined,
        3000,
        ipAddress,
        err => {
          if (err) {
            console.error('error sending data', err);
          } else {
            console.log('data sent successfully!');
          }
        },
      );
    });
  };

  const stopRecording = () => {
    AudioRecorder.stop();
    setIsRecording(false);
    setIsRecordingText('Record');
  };

  const playAudio = () => {
    //nothing
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
