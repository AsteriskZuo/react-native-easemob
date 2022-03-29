import { PermissionsAndroid } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import ChatClient from "lib/typescript/src";
// import { ChatOptions } from 'react-native-easemob';
import * as examples from './examples';
import { appKey } from './configs/connect';
import { ChatClient, ChatOptions } from '../../../src';

PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
).catch(() => {});
PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
).catch(() => {});

ChatClient.getInstance().init(
  new ChatOptions({ appKey: appKey, autoLogin: false })
);

export default createAppContainer(
  createStackNavigator(examples, { initialRouteName: 'default' })
);
