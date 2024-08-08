import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {NativeModules} from 'react-native';
const {CalenderModule} = NativeModules;

const App = () => {
  const onPress = () => {
    // CalenderModule.createCalendarEvent('testName', 'testLocation');
    const moduleNames = Object.keys(NativeModules);
    console.log(moduleNames);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to My React Native App!</Text>
      <Button
        title="Click to invoke your native module!"
        color="#841584"
        onPress={onPress}
      />
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
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;
