import * as React from 'react';
import { Platform, ScrollView, StyleSheet, Text } from 'react-native';
import {
  ChatClient,
  ChatManager,
  ChatMessage,
  ChatMessageStatusCallback,
  ChatMessageBodyType,
  ChatManagerListener,
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

  componentDidMount() {
    this.listener = {
      /// 收到消息[messages]
      onMessagesReceived(messages) {},

      /// 收到cmd消息[messages]
      onCmdMessagesReceived(messages) {},

      /// 收到[messages]消息已读
      onMessagesRead(messages) {},

      /// 收到[groupMessageAcks]群消息已读回调
      onGroupMessageRead(groupMessageAcks) {},

      /// 收到[messages]消息已送达
      onMessagesDelivered(messages) {},

      /// 收到[messages]消息被撤回
      onMessagesRecalled(messages) {},

      /// 会话列表变化
      onConversationsUpdate() {},

      /// 会话已读`from`是已读的发送方, `to`是已读的接收方
      onConversationRead(from, to) {},
    };
    ChatClient.getInstance().chatManager.addListener(this.listener);
  }

  componentWillUnmount() {
    ChatClient.getInstance().chatManager.delListener(this.listener);
  }

  render() {
    const { messages } = this.state;
    return (
      <ScrollView contentContainerStyle={style.body}>
        {messages.length === 0 && <Text style={style.item}>No messages.</Text>}
        {messages.map((message) => (
          <Text style={style.item} key={message.message.messageId}>
            {JSON.stringify(message, null, 2)}
          </Text>
        ))}
      </ScrollView>
    );
  }
}
