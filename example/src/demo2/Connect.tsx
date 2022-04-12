import React, { Component } from 'react';
import { View, Button, ScrollView, ViewStyle, Text } from 'react-native';
import {
  ChatClient,
  ChatConnectionListener,
  ChatError,
  ChatGroupMessageAck,
  ChatManagerListener,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageStatus,
  ChatMessageStatusCallback,
} from 'react-native-easemob';

const styleValue: ViewStyle = {
  alignItems: 'stretch',
  justifyContent: 'center',
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 8,
  paddingBottom: 8,
};

interface State {
  status: string;
  message: string;
}

export class ConnectScreen extends Component<{}, State, any> {
  static route = 'ConnectScreen';
  navigation: any;
  listener?: ChatConnectionListener;
  msgListener?: ChatManagerListener;
  msgId?: string;
  static count = 1;

  constructor(props: { navigation: any }) {
    super(props);
    this.navigation = props.navigation;
    this.state = {
      status: '',
      message: '',
    };
  }

  componentDidMount?(): void {
    console.log('ConnectScreen.componentDidMount');
    // if (this.listener) {
    //   ChatClient.getInstance().removeConnectionListener(this.listener);
    // }
    this.listener = new (class s implements ChatConnectionListener {
      that: ConnectScreen;
      constructor(parent: any) {
        this.that = parent as ConnectScreen;
      }
      onTokenWillExpire(): void {
        console.log('ConnectScreen.onTokenWillExpire');
        this.that.setState({ status: 'onTokenWillExpire' });
      }
      onTokenDidExpire(): void {
        console.log('ConnectScreen.onTokenDidExpire');
        this.that.setState({ status: 'onTokenDidExpire' });
      }
      onConnected(): void {
        console.log('ConnectScreen.onConnected');
        this.that.setState({ status: 'onConnected' });
      }
      onDisconnected(errorCode?: number): void {
        console.log('ConnectScreen.onDisconnected', errorCode);
        this.that.setState({ status: 'onDisconnected' });
      }
    })(this);
    ChatClient.getInstance().addConnectionListener(this.listener);

    if (this.msgListener) {
      ChatClient.getInstance().chatManager.delListener(this.msgListener);
    }
    this.msgListener = new (class ss implements ChatManagerListener {
      that: ConnectScreen;
      constructor(parent: any) {
        this.that = parent as ConnectScreen;
      }
      onMessagesReceived(messages: ChatMessage[]): void {
        console.log('ConnectScreen.onMessagesReceived', messages);
        this.that.msgId = (++ConnectScreen.count).toString();
        this.that.setState({ message: 'onMessagesReceived' });
      }
      onCmdMessagesReceived(messages: ChatMessage[]): void {
        console.log('ConnectScreen.onCmdMessagesReceived', messages);
        this.that.setState({ message: 'onCmdMessagesReceived' });
      }
      onMessagesRead(messages: ChatMessage[]): void {
        console.log('ConnectScreen.onMessagesRead', messages);
        this.that.setState({ message: 'onMessagesRead' });
      }
      onGroupMessageRead(groupMessageAcks: ChatGroupMessageAck[]): void {
        console.log('ConnectScreen.onGroupMessageRead', groupMessageAcks);
        this.that.setState({ message: 'onGroupMessageRead' });
      }
      onMessagesDelivered(messages: ChatMessage[]): void {
        console.log('ConnectScreen.onMessagesDelivered', messages);
        this.that.setState({ message: 'onMessagesDelivered' });
      }
      onMessagesRecalled(messages: ChatMessage[]): void {
        console.log('ConnectScreen.onMessagesRecalled', messages);
        this.that.setState({ message: 'onMessagesRecalled' });
      }
      onConversationsUpdate(): void {
        console.log('ConnectScreen.onConversationsUpdate');
        this.that.setState({ message: 'onConversationsUpdate' });
      }
      onConversationRead(from: string, to?: string): void {
        console.log('ConnectScreen.onConversationRead', from, to);
        this.that.setState({ message: 'onConversationRead' });
      }
    })(this);
    ChatClient.getInstance().chatManager.addListener(this.msgListener);
  }

  componentWillUnmount?(): void {
    console.log('ConnectScreen.componentWillUnmount');
    if (this.listener) {
      ChatClient.getInstance().removeConnectionListener(this.listener);
    }
    if (this.msgListener) {
      ChatClient.getInstance().chatManager.delListener(this.msgListener);
    }
  }

  connect(): void {
    console.log('ConnectScreen.connect');
    ChatClient.getInstance().login('asteriskhx1', 'qwer');
  }

  disconnect(): void {
    console.log('ConnectScreen.disconnect');
    ChatClient.getInstance().logout();
    this.setState({ status: 'disconnect' });
  }

  async sendMessage(): Promise<void> {
    console.log('ConnectScreen.sendMessage');
    let msg = ChatMessage.createTextMessage(
      'asteriskhx2',
      Date.now().toString(),
      ChatMessageChatType.PeerChat
    );
    const callback = new (class s implements ChatMessageStatusCallback {
      onProgress(progress: number): void {
        console.log('ConnectScreen.sendMessage.onProgress ', progress);
      }
      onError(error: ChatError): void {
        console.log('ConnectScreen.sendMessage.onError ', error);
      }
      onSuccess(): void {
        console.log('ConnectScreen.sendMessage.onSuccess');
      }
      onReadAck(): void {
        console.log('ConnectScreen.sendMessage.onReadAck');
      }
      onDeliveryAck(): void {
        console.log('ConnectScreen.sendMessage.onDeliveryAck');
      }
      onStatusChanged(status: ChatMessageStatus): void {
        console.log('ConnectScreen.sendMessage.onStatusChanged ', status);
      }
    })();
    let newmsg = await ChatClient.getInstance().chatManager.sendMessage(
      msg,
      callback
    );
    console.log(newmsg);
    // ChatClient.getInstance()
    //   .chatManager.sendMessage(msg, callback)
    //   .then((nmsg: ChatMessage) => {
    //     console.log(`${msg}, ${nmsg}`);
    //   })
    //   .catch((reason: any) => {
    //     this.setState({ status: reason as string });
    //   });
  }

  render() {
    const { status, message } = this.state;
    return (
      <ScrollView>
        <View style={styleValue}>
          <Button
            title="连接服务器"
            onPress={() => {
              this.connect();
            }}
          />
        </View>
        <View style={styleValue}>
          <Button
            title="从服务器断开"
            onPress={() => {
              this.disconnect();
            }}
          />
        </View>
        <View style={styleValue}>
          <Button
            title="发送消息"
            onPress={() => {
              this.sendMessage();
            }}
          />
        </View>
        <Text>连接状态: {status}</Text>
        <Text>消息状态: {message}</Text>
      </ScrollView>
    );
  }
}
