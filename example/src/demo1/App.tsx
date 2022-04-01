// import { Button, PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
// import { createAppContainer } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
// import { createStackNavigator } from '@react-navigation/stack';
// import ChatClient from "lib/typescript/src";
// import { ChatOptions } from 'react-native-easemob';
// import * as examples from './examples';
// import { appKey } from './configs/connect';
// import { ChatClient, ChatOptions } from '../../../src/index';
// import * as React from 'react';

// export default createAppContainer(
//   createStackNavigator(examples, { initialRouteName: 'default' })
// );

// import Example from './examples/example';
// import Connect from './examples/connect';
// import ReceiveMessage from './examples/receive-message';
// import SendMessage from './examples/send-message';

// const examples = [Connect, ReceiveMessage, SendMessage];

// class Cat extends React.Component {
//   render() {
//     return (
//       <Text>Hello, I am your cat!</Text>
//     );
//   }
// }

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Home" component={Cat} />
//     </Stack.Navigator>
//   );
// }

import * as React from 'react';
import {
  View,
  PermissionsAndroid,
  Button,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { appKey } from './configs/connect';
import { ChatClient, ChatOptions } from '../../../src/index';
import { Connect, ReceiveMessage, SendMessage } from './examples';

PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
).catch(() => {});
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
).catch(() => {});

ChatClient.getInstance().init(
  new ChatOptions({ appKey: appKey, autoLogin: false })
);

const styleValue: ViewStyle = {
  alignItems: 'stretch',
  justifyContent: 'center',
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 8,
  paddingBottom: 8,
};

function HomeScreen(params: { navigation: any }) {
  return (
    <ScrollView>
      <View style={styleValue}>
        <Button
          title="测试基础功能"
          onPress={() => params.navigation?.navigate(Connect.route)}
        />
      </View>
      <View style={styleValue}>
        <Button
          title="测试发送消息"
          onPress={() => params.navigation?.navigate(SendMessage.route)}
        />
      </View>
      <View style={styleValue}>
        <Button
          title="测试接收消息"
          onPress={() => params.navigation?.navigate(ReceiveMessage.route)}
        />
      </View>
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: true, title: 'SDK Test Item List' }}
        />
        <Stack.Screen name={Connect.route} component={Connect} />
        <Stack.Screen name={ReceiveMessage.route} component={ReceiveMessage} />
        <Stack.Screen name={SendMessage.route} component={SendMessage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
