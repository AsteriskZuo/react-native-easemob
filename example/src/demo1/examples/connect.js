import * as React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChatClient } from '../../../../src/index';
import { accounts } from '../configs/connect';
import { Picker } from '@react-native-picker/picker';
import FormItem from './form-item';

const style = StyleSheet.create({
  body: { padding: 16 },
  message: { marginTop: 16 },
});

export default class extends React.PureComponent {
  static route = 'Connect';
  static navigationOptions = { title: '连接服务器' };

  state = {
    message: '连接结果：',
    status: 0,
  };

  componentDidMount() {
    this.username = '';
    this.password = '';
    ChatClient.getInstance().init({ appKey: '', autoLogin: false });
    this.listener = {
      onConnected: () => {
        this.setState({ status: 1 });
        ChatClient.getInstance().addConnectionListener(this.listener);
      },

      /// 连接失败，原因是[errorCode]
      onDisconnected: function (errorCode) {
        this.setState({ status: 2 });
      },
    };
    // ChatClient.getInstance().addConnectionListener(this.listener);
  }

  componentWillUnmount() {
    ChatClient.getInstance().removeConnectionListener(this.listener);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    // todo:
  }

  componentDidCatch(error, errorInfo) {
    // todo:
  }

  _connect = () => {
    ChatClient.getInstance().login(this.username, this.password, true);
  };
  _disconnect = () => {
    ChatClient.getInstance().logout();
  };

  render() {
    const { status, message } = this.state;
    var items = [];
    accounts.forEach((element) => {
      items.push(
        <Picker.Item
          label={element.username}
          value={element.password}
        ></Picker.Item>
      );
    });

    return (
      <View style={style.body}>
        <FormItem label="请选择用户">
          <Picker
            selectedValue={{ username, password }}
            onValueChange={{ username: this.username, password: this.password }}
          >
            {items}
          </Picker>
        </FormItem>
        <FormItem>
          <Button title="连接服务器" onPress={this._connect} />
        </FormItem>
        <FormItem>
          <Button title="断开连接（继续接收推送）" onPress={this._disconnect} />
        </FormItem>
        <Text style={style.message}>{message}</Text>
        <Text style={style.message}>连接状态监听：{status}</Text>
      </View>
    );
  }
}
