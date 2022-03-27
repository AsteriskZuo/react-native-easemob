import * as React from 'react';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  ChatClient,
  ChatManager,
  ChatMessage,
  ChatMessageStatusCallback,
  ChatMessageBodyType
} from '../../../../src/index';
import { currentUser } from '../configs/connect';
import { receiver } from '../configs/send-message';
import { Body, FormItem, Result, Select } from '../components';
import { conversations, messageTypes } from './constants';

const style = StyleSheet.create({
  image: { height: 100, marginTop: 16, marginBottom: 16 },
});

export default class extends React.PureComponent {
  static route = 'SendMessage';
  static navigationOptions = { title: '发送消息' };
  messageId = 0;

  state = {
    conversationType: 1,
    messageType: ChatMessageBodyType.TXT,
    targetId: receiver.id,
    content: {},
    result: '',
  };

  sendMessage = async () => {
    let chatManager = ChatClient.getInstance().chatManager();
    let msg = ChatMessage.createTextMessage(
      this.state.targetId,
      Date.now().toString(),
      this.state.conversationType
    );
    let callback = {
      /// 消息进度
      onProgress(progress) {},

      /// 消息发送失败
      onError(error) {},

      /// 消息发送成功
      onSuccess() {},

      /// 消息已读
      onReadAck() {},

      /// 消息已送达
      onDeliveryAck() {},

      /// 消息状态发生改变
      onStatusChanged(status) {},
    };
    await chatManager.sendMessage(msg, callback);
  };


  send = () => {
    this.sendMessage();
  };

  renderContent() {
    const { messageType, content } = this.state;
    if (messageType === ChatMessageBodyType.TXT) {
      return (
        <FormItem label="文本内容">
          <TextInput
            onChangeText={this.setTextContent}
            placeholder="请输入文本内容"
          />
        </FormItem>
      );
    } else if (messageType === ChatMessageBodyType.IMAGE) {
      return (
        <FormItem>
          <Button title="选择图片" onPress={this.pickImage} />
          {content.local && (
            <Image
              style={style.image}
              resizeMode="contain"
              source={{ uri: content.local }}
            />
          )}
        </FormItem>
      );
    } else if (messageType === ChatMessageBodyType.FILE) {
      return (
        <View>
          <FormItem>
            <Button title="选择文件" onPress={this.pickFile} />
          </FormItem>
          {content.local && (
            <FormItem>
              <Text>{content.local}</Text>
            </FormItem>
          )}
        </View>
      );
    } else if (messageType === ChatMessageBodyType.VOICE) {
      return (
        <View>
          {/* <FormItem label="音频">
            <TextInput onChangeText={this.setVoice} placeholder="请输音频地址/数据" />
          </FormItem> */}
          <FormItem>
            <Button title="选择音频数据" onPress={this.pickVoiceFile} />
          </FormItem>
          {content.local && (
            <FormItem>
              <Text>{content.local}</Text>
            </FormItem>
          )}
        </View>
      );
    }
  }

  render() {
    const {
      targetId,
      conversationType,
      messageType,
      result,
    } = this.state;
    let behavior = Platform.OS == 'ios' ? 'padding' : null;
    return (
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <Body>
          <Select
            label="会话类型"
            options={conversations}
            value={conversationType}
            onChange={this.setConversationType}
          />
          <Select
            label="消息类型"
            options={messageTypes}
            value={messageType}
            onChange={this.setMessageType}
          />
          <FormItem label="目标 ID">
            <TextInput
              value={targetId}
              onChangeText={this.setTargetId}
              placeholder="请输入目标 ID"
            />
          </FormItem>
          {this.renderContent()}
          <FormItem>
            <Button title="发送" onPress={this.send} />
          </FormItem>

          <Result>{result}</Result>
        </Body>
      </KeyboardAwareScrollView>
    );
  }
}
