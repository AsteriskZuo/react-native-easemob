import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ChatClient, ChatConnectionListener } from '../../../../src/index';
import { accounts } from '../configs/connect';
import { Picker } from '@react-native-picker/picker';
import FormItem from '../components/form-item';

const style = StyleSheet.create({
  body: { padding: 16 },
  message: { marginTop: 16 },
});

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

  username: string = '';
  password: string = '';
  listener?: ChatConnectionListener;

  componentDidMount() {
    this.username = '';
    this.password = '';
    this.listener = {
      onConnected: () => {
        this.setState({ status: 1 });
      },

      /// 连接失败，原因是[errorCode]
      onDisconnected: (errorCode: any) =>{
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

  connect = () => {
    ChatClient.getInstance().login(this.username, this.password, true);
  };
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
    accounts.forEach((element) => {
      items.push(
        <Picker.Item
          label={element.username}
          value={{ username: element.username, password: element.password }}
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
          <Button title="断开连接（继续接收推送）" onPress={this.disconnect} />
        </FormItem>
        <Text style={style.message}>{message}</Text>
        <Text style={style.message}>连接状态监听：{status}</Text>
      </View>
    );
  }
}
