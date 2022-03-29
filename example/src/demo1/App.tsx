import { PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import ChatClient from "lib/typescript/src";
// import { ChatOptions } from 'react-native-easemob';
import * as examples from './examples';
import { appKey } from './configs/connect';
import { ChatClient, ChatOptions, multiply } from 'react-native-easemob';
import * as React from 'react';

PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
).catch(() => {});
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
).catch(() => {});

ChatClient.getInstance().init(
  new ChatOptions({ appKey: appKey, autoLogin: false })
);

// export default createAppContainer(
//   createStackNavigator(examples, { initialRouteName: 'default' })
// );

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
