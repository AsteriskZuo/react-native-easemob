import React, { Component } from 'react';
import { View, Button, ScrollView, ViewStyle } from 'react-native';
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

export class ConnectScreen extends Component {
  static route = 'ConnectScreen';
  navigation: any;
  listener?: ChatConnectionListener;
  msgListener?: ChatManagerListener;

  constructor(props: { navigation: any }) {
    super(props);
    this.navigation = props.navigation;
  }

  componentDidMount?(): void {
    console.log('ConnectScreen.componentDidMount');
    this.listener = new (class s implements ChatConnectionListener {
      onTokenWillExpire(): void {
        console.log('ConnectScreen.onTokenWillExpire');
      }
      onTokenDidExpire(): void {
        console.log('ConnectScreen.onTokenDidExpire');
      }
      onConnected(): void {
        console.log('ConnectScreen.onConnected');
      }
      onDisconnected(errorCode?: number): void {
        console.log('ConnectScreen.onDisconnected', errorCode);
      }
    })();
    ChatClient.getInstance().addConnectionListener(this.listener);

    this.msgListener = new (class ss implements ChatManagerListener {
      onMessagesReceived(messages: ChatMessage[]): void {
        console.log('ConnectScreen.onMessagesReceived', messages);
      }
      onCmdMessagesReceived(messages: ChatMessage[]): void {
        console.log('ConnectScreen.onCmdMessagesReceived', messages);
      }
      onMessagesRead(messages: ChatMessage[]): void {
        console.log('ConnectScreen.onMessagesRead', messages);
      }
      onGroupMessageRead(groupMessageAcks: ChatGroupMessageAck[]): void {
        console.log('ConnectScreen.onGroupMessageRead', groupMessageAcks);
      }
      onMessagesDelivered(messages: ChatMessage[]): void {
        console.log('ConnectScreen.onMessagesDelivered', messages);
      }
      onMessagesRecalled(messages: ChatMessage[]): void {
        console.log('ConnectScreen.onMessagesRecalled', messages);
      }
      onConversationsUpdate(): void {
        console.log('ConnectScreen.onConversationsUpdate');
      }
      onConversationRead(from: string, to?: string): void {
        console.log('ConnectScreen.onConversationRead', from, to);
      }
    })();
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
  }

  sendMessage(): void {
    console.log('ConnectScreen.sendMessage');
    let msg = ChatMessage.createTextMessage(
      'asteriskhx2',
      Date.now().toString(),
      ChatMessageChatType.PeerChat
    );
    let callback = new (class s implements ChatMessageStatusCallback {
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
    ChatClient.getInstance()
      .chatManager.sendMessage(msg, callback)
      .then((nmsg: ChatMessage) => {
        console.log(`${msg}, ${nmsg}`);
      })
      .catch();
  }

  render() {
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
      </ScrollView>
    );
  }
}
