import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ChatClient, ChatConnectionListener } from '../../../../src/index';
import { accounts } from '../configs/connect';
import { Picker } from '@react-native-picker/picker';
import FormItem from '../components/form-item';

const style = StyleSheet.create({
  body: { padding: 16 },
  message: { marginTop: 16 },
});

const TAG = 'ConnectComponent';
export default class extends React.PureComponent {
  static route = 'Connect';
  static navigationOptions = { title: '连接服务器' };

  constructor(props: {}) {
    super(props);
    // this.state = {
    //   message: '连接结果：',
    //   status: 0,
    // };
  }

  state = {
    message: '连接结果：',
    status: 0,
  };

  // const [value, setValue] = useState('key1');

  username: string = '';
  password: string = '';
  listener?: ChatConnectionListener;

  componentDidMount() {
    this.username = accounts[0].username;
    this.password = accounts[0].password;
    this.listener = {
      onConnected: () => {
        console.log(`${TAG}: onConnected`);
        this.setState({ status: 1 });
      },

      /// 连接失败，原因是[errorCode]
      onDisconnected: (errorCode: any) => {
        console.log(`${TAG}: onDisconnected`);
        this.setState({ status: 2 });
      },
    };
    ChatClient.getInstance().addConnectionListener(this.listener);
  }

  componentWillUnmount() {
    if (this.listener) {
      ChatClient.getInstance().removeConnectionListener(this.listener);
    }
  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   // todo:
  // }

  // componentDidCatch(error, errorInfo) {
  //   // todo:
  // }

  connect(): void {
    ChatClient.getInstance().login(this.username, this.password, true);
  }
  disconnect = () => {
    ChatClient.getInstance().logout();
  };

  setToken(params: { username: string; password: string }) {
    this.username = params.username;
    this.password = params.password;
  }

  render() {
    const { status, message } = this.state;
    var items = new Array<any>();
    const Item: any = Picker.Item;
    accounts.forEach((element) => {
      items.push(
        <Picker.Item
          label={element.username}
          value={{ username: element.username, password: element.password }}
          key={element.username}
        ></Picker.Item>
      );
    });

    let username = '';
    let password = '';

    return (
      <View style={style.body}>
        <FormItem label="请选择用户">
          <Picker
            selectedValue={{ username, password }}
            onValueChange={this.setToken}
          >
            {items}
          </Picker>
        </FormItem>
        <FormItem label={'a'}>
          <Button title="连接服务器" onPress={this.connect} />
        </FormItem>
        <FormItem label={'b'}>
          <Button title="断开连接" onPress={this.disconnect} />
        </FormItem>
        <Text style={style.message}>{message}</Text>
        <Text style={style.message}>连接状态监听：{status}</Text>
      </View>
    );
  }
}
