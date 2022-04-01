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
  NativeSyntheticEvent,
  NativeTouchEvent,
} from 'react-native';
// import DocumentPicker from 'react-native-document-picker';
// import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  ChatClient,
  ChatManager,
  ChatMessage,
  ChatMessageStatusCallback,
  ChatMessageBodyType,
  ChatConversationType,
  ChatMessageChatType,
  ChatError,
  ChatMessageStatus,
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
    conversationType: ChatMessageChatType.PeerChat,
    messageType: ChatMessageBodyType.TXT,
    targetId: receiver.id,
    content: {
      content: '',
      local: '',
    },
    result: '',
  };

  sendMessage = async () => {
    let chatManager = ChatClient.getInstance().chatManager;
    let msg = ChatMessage.createTextMessage(
      this.state.targetId,
      Date.now().toString(),
      this.state.conversationType
    );
    let callback = new (class implements ChatMessageStatusCallback {
      onProgress(progress: number): void {
        console.log('onProgress');
      }
      onError(error: ChatError): void {
        console.log('onError');
      }
      onSuccess(): void {
        console.log('onSuccess');
      }
      onReadAck(): void {
        console.log('onReadAck');
      }
      onDeliveryAck(): void {
        console.log('onDeliveryAck');
      }
      onStatusChanged(status: ChatMessageStatus): void {
        console.log('onStatusChanged');
      }
    })();
    await chatManager.sendMessage(msg, callback);
  };

  send = () => {
    this.sendMessage();
  };
  pickImage(ev: NativeSyntheticEvent<NativeTouchEvent>): void {}
  pickFile(ev: NativeSyntheticEvent<NativeTouchEvent>): void {}
  pickVoiceFile(ev: NativeSyntheticEvent<NativeTouchEvent>): void {}
  setConversationType(type: any): void {}
  setMessageType(type: any): void {}
  setTargetId(text: string): void {}

  renderContent() {
    const { messageType, content } = this.state;
    if (messageType === ChatMessageBodyType.TXT) {
      return (
        <FormItem label="文本内容">
          <TextInput
            onChangeText={(text) => {
              this.state.content.content = text;
            }}
            placeholder="请输入文本内容"
          />
        </FormItem>
      );
    } else if (messageType === ChatMessageBodyType.IMAGE) {
      return (
        <FormItem label={''}>
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
          <FormItem label={''}>
            <Button title="选择文件" onPress={this.pickFile} />
          </FormItem>
          {content.local && (
            <FormItem label={''}>
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
          <FormItem label={''}>
            <Button title="选择音频数据" onPress={this.pickVoiceFile} />
          </FormItem>
          {content.local && (
            <FormItem label={''}>
              <Text>{content.local}</Text>
            </FormItem>
          )}
        </View>
      );
    } else {
      throw new Error('no implement');
    }
  }

  render() {
    const { targetId, conversationType, messageType, result } = this.state;
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
          <FormItem label={''}>
            <Button title="发送" onPress={this.send} />
          </FormItem>

          <Result>{result}</Result>
        </Body>
      </KeyboardAwareScrollView>
    );
  }
}
