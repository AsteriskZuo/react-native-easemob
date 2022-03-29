import * as React from 'react';
import { Platform, ScrollView, StyleSheet, Text } from 'react-native';
import {
  ChatClient,
  ChatManager,
  ChatMessage,
  ChatMessageStatusCallback,
  ChatMessageBodyType,
  ChatManagerListener,
  ChatGroupMessageAck,
} from '../../../../src/index';

const style = StyleSheet.create({
  body: { padding: 16 },
  item: {
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'menlo' : 'monospace',
  },
});

export default class extends React.PureComponent {
  static route = 'ReceiveMessage';
  static navigationOptions = { title: '接收消息' };

  state = { messages: [] };
  listener?: ChatManagerListener;

  componentDidMount() {

    this.listener = new class implements ChatManagerListener {
      onMessagesReceived(messages: ChatMessage[]): void {
        console.log('onMessagesReceived');
      }
      onCmdMessagesReceived(messages: ChatMessage[]): void {
        console.log('onCmdMessagesReceived');
      }
      onMessagesRead(messages: ChatMessage[]): void {
        console.log('onMessagesRead');
      }
      onGroupMessageRead(groupMessageAcks: ChatGroupMessageAck[]): void {
        console.log('onGroupMessageRead');
      }
      onMessagesDelivered(messages: ChatMessage[]): void {
        console.log('onMessagesDelivered');
      }
      onMessagesRecalled(messages: ChatMessage[]): void {
        console.log('onMessagesRecalled');
      }
      onConversationsUpdate(): void {
        console.log('onConversationsUpdate');
      }
      onConversationRead(from: string, to?: string): void {
        console.log('onConversationRead');
      }

    };

    ChatClient.getInstance().chatManager.addListener(this.listener);
  }

  componentWillUnmount() {
    if (this.listener) {
      ChatClient.getInstance().chatManager.delListener(this.listener);
    }
  }

  render() {
    const { messages } = this.state;
    return (
      <ScrollView contentContainerStyle={style.body}>
        {messages.length === 0 && <Text style={style.item}>No messages.</Text>}
        {messages.map((message: ChatMessage) => (
          <Text style={style.item} key={message.localTime}>
            {JSON.stringify(message, null, 2)}
          </Text>
        ))}
      </ScrollView>
    );
  }
}
