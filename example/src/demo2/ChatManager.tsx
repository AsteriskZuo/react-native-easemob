import React, { Component, ReactNode } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { styleValues } from './Const';
import ModalDropdown from 'react-native-modal-dropdown';
import type ImagePicker from 'react-native-image-picker';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {
  ChatClient,
  ChatError,
  ChatGroupMessageAck,
  ChatManagerListener,
  ChatMessage,
  ChatMessageBodyType,
  ChatMessageChatType,
  ChatMessageStatusCallback,
} from 'react-native-easemob';

interface State {
  messageType: ChatMessageBodyType;

  targetId: string;
  chatType: ChatMessageChatType;

  // text messge body
  content: string;

  // file message body
  filePath: string;
  displayName: string;
  width: number;
  height: number;
  fileSize: number;

  // result
  messageResult: string;
  listenerResult: string;
}

export class ChatManagerScreen extends Component<
  { navigation: any },
  State,
  any
> {
  private static TAG = 'ChatManagerScreen';
  private static messageType = [
    ChatMessageBodyType.TXT,
    ChatMessageBodyType.IMAGE,
  ];
  private static messageChatType = [
    'ChatMessageChatType.PeerChat',
    'ChatMessageChatType.GroupChat',
    'ChatMessageChatType.ChatRoom',
  ];
  public static route = 'ChatManagerScreen';
  navigation: any;

  constructor(props: { navigation: any }) {
    super(props);
    this.navigation = props.navigation;
    this.state = {
      messageType: ChatMessageBodyType.TXT,
      targetId: 'asteriskhx2',
      chatType: ChatMessageChatType.PeerChat,
      messageResult: '',
      listenerResult: '',
      content: '',
      filePath: '',
      displayName: '',
      width: 0,
      height: 0,
      fileSize: 0,
    };
  }

  componentDidMount?(): void {
    console.log(`${ChatManagerScreen.TAG}: componentDidMount: `);
    let msgListener = new (class implements ChatManagerListener {
      that: ChatManagerScreen;
      constructor(parent: any) {
        this.that = parent as ChatManagerScreen;
      }
      onMessagesReceived(messages: ChatMessage[]): void {
        console.log(`${ChatManagerScreen.TAG}: onMessagesReceived: `, messages);
        this.that.setState({
          listenerResult: `onMessagesReceived: ${messages.length}`,
        });
      }
      onCmdMessagesReceived(messages: ChatMessage[]): void {
        console.log(
          `${ChatManagerScreen.TAG}: onCmdMessagesReceived: `,
          messages
        );
        this.that.setState({
          listenerResult: `onCmdMessagesReceived: ${messages.length}`,
        });
      }
      onMessagesRead(messages: ChatMessage[]): void {
        console.log(`${ChatManagerScreen.TAG}: onMessagesRead: `, messages);
        this.that.setState({
          listenerResult: `onMessagesRead: ${messages.length}`,
        });
      }
      onGroupMessageRead(groupMessageAcks: ChatGroupMessageAck[]): void {
        console.log(
          `${ChatManagerScreen.TAG}: onGroupMessageRead: `,
          groupMessageAcks
        );
        this.that.setState({
          listenerResult: `onGroupMessageRead: ${groupMessageAcks.length}`,
        });
      }
      onMessagesDelivered(messages: ChatMessage[]): void {
        console.log(
          `${ChatManagerScreen.TAG}: onMessagesDelivered: `,
          messages
        );
        this.that.setState({
          listenerResult: `onMessagesDelivered: ${messages.length}`,
        });
      }
      onMessagesRecalled(messages: ChatMessage[]): void {
        console.log(`${ChatManagerScreen.TAG}: onMessagesRecalled: `, messages);
        this.that.setState({
          listenerResult: `onMessagesRecalled: ${messages.length}`,
        });
      }
      onConversationsUpdate(): void {
        console.log(`${ChatManagerScreen.TAG}: onConversationsUpdate: `);
        this.that.setState({ listenerResult: 'onConversationsUpdate' });
      }
      onConversationRead(from: string, to?: string): void {
        console.log(`${ChatManagerScreen.TAG}: onConversationRead: `, from, to);
        this.that.setState({
          listenerResult: `onConversationRead: ${from}, ${to}`,
        });
      }
    })(this);

    ChatClient.getInstance().chatManager.removeAllListener();
    ChatClient.getInstance().chatManager.addListener(msgListener);
  }

  componentWillUnmount?(): void {
    console.log(`${ChatManagerScreen.TAG}: componentWillUnmount: `);
  }

  private sendMessage(): void {
    console.log(`${ChatManagerScreen.TAG}: sendMessage: `);
    const { messageType, targetId, chatType } = this.state;
    let msg: ChatMessage;
    if (messageType === ChatMessageBodyType.TXT) {
      const { content } = this.state;
      msg = ChatMessage.createTextMessage(targetId, content, chatType);
    } else if (messageType === ChatMessageBodyType.IMAGE) {
      const { filePath, width, height, displayName } = this.state;
      msg = ChatMessage.createImageMessage(targetId, filePath, chatType, {
        displayName,
        width,
        height,
      });
    } else {
      throw new Error('Not implemented.');
    }
    const s = new (class implements ChatMessageStatusCallback {
      that: ChatManagerScreen;
      constructor(t: ChatManagerScreen) {
        this.that = t;
      }
      onProgress(localMsgId: string, progress: number): void {
        console.log(
          `${ChatManagerScreen.TAG}: sendMessage: onProgress: `,
          localMsgId,
          progress
        );
        this.that.setState({
          messageResult: `onProgress: ${localMsgId}, ${progress}`,
        });
      }
      onError(localMsgId: string, error: ChatError): void {
        console.log(
          `${ChatManagerScreen.TAG}: sendMessage: onError: `,
          localMsgId,
          error
        );
        this.that.setState({
          messageResult: `onError: ${localMsgId}, ${error.code} ${error.description}`,
        });
      }
      onSuccess(message: ChatMessage): void {
        console.log(
          `${ChatManagerScreen.TAG}: sendMessage: onSuccess: `,
          message
        );
        this.that.setState({
          messageResult: `onSuccess: ${message.localMsgId}`,
        });
      }
    })(this);
    ChatClient.getInstance()
      .chatManager.sendMessage(msg!, s)
      .then(() => {
        console.log(`${ChatManagerScreen.TAG}: sendMessage: success`);
      })
      .catch((reason: any) => {
        console.log(`${ChatManagerScreen.TAG}: sendMessage: `, reason);
      });
  }

  private renderMessage(messageType: ChatMessageBodyType): ReactNode {
    let ret: ReactNode;
    switch (messageType) {
      case ChatMessageBodyType.TXT:
        ret = this.renderTextMessage();
        break;
      case ChatMessageBodyType.IMAGE:
        ret = this.renderImageMessage();
        break;
      default:
        ret = <View />;
        break;
    }
    return ret;
  }

  private renderTextMessage(): ReactNode {
    const { targetId, content } = this.state;
    return [
      <View style={styleValues.containerRow} key="targetId">
        <Text style={styleValues.textStyle}>TargetId: </Text>
        <TextInput
          style={styleValues.textInputStyle}
          onChangeText={(text: string) => {
            // console.log(`${ChatManagerScreen.TAG}: `, text);
            this.setState({ targetId: text });
          }}
        >
          {targetId}
        </TextInput>
      </View>,
      <View style={styleValues.containerRow} key="content">
        <Text style={styleValues.textStyle}>Content: </Text>
        <TextInput
          style={styleValues.textInputStyle}
          onChangeText={(text: string) => {
            // console.log(`${ChatManagerScreen.TAG}: `, text);
            this.setState({ content: text });
          }}
        >
          {content}
        </TextInput>
      </View>,
      <View style={styleValues.containerRow} key="sendMessage">
        <Button
          title="sendMessage"
          onPress={() => {
            // console.log(`${ChatManagerScreen.TAG}`);
            this.sendMessage();
          }}
        >
          sendMessage
        </Button>
      </View>,
    ];
  }

  private renderImageMessage(): ReactNode {
    const { targetId, filePath, displayName } = this.state;
    return [
      <View style={styleValues.containerRow} key="targetId">
        <Text style={styleValues.textStyle}>TargetId: </Text>
        <TextInput
          style={styleValues.textInputStyle}
          onChangeText={(text: string) => {
            // console.log(`${ChatManagerScreen.TAG}: `, text);
            this.setState({ targetId: text });
          }}
        >
          {targetId}
        </TextInput>
      </View>,
      <View style={styleValues.containerRow} key="filePath">
        <Text style={styleValues.textStyle}>FilePath: </Text>
        <TextInput
          style={styleValues.textInputStyle}
          onChangeText={(text: string) => {
            // console.log(`${ChatManagerScreen.TAG}: `, text);
            this.setState({ filePath: text });
          }}
        >
          {filePath}
        </TextInput>
        <Button
          title="selctImage"
          onPress={() => {
            // console.log(`${ChatManagerScreen.TAG}`);
            const f = (
              type: string,
              options:
                | ImagePicker.CameraOptions
                | ImagePicker.ImageLibraryOptions
            ) => {
              if (type === 'capture') {
                launchCamera(options, (response: ImagePickerResponse) => {
                  console.log(`${ChatManagerScreen.TAG}: `, response);
                  if (
                    response.didCancel ||
                    response.errorCode ||
                    response.errorMessage
                  ) {
                    console.log('cancel');
                  } else {
                    if (response.assets && response.assets?.length > 0) {
                      this.setState({
                        filePath: response.assets[0].uri!,
                        width: response.assets[0].width!,
                        height: response.assets[0].height!,
                        displayName: response.assets[0].fileName!,
                        fileSize: response.assets[0].fileSize!,
                      });
                    }
                  }
                });
              } else {
                launchImageLibrary(options, (response: ImagePickerResponse) => {
                  console.log(`${ChatManagerScreen.TAG}: `, response);
                  if (
                    response.didCancel ||
                    response.errorCode ||
                    response.errorMessage
                  ) {
                    console.log('cancel');
                  } else {
                    if (response.assets && response.assets?.length > 0) {
                      let s = response.assets[0].uri!;
                      if (s.startsWith('file://')) {
                        s = s.substring('file://'.length);
                      }
                      this.setState({
                        // filePath: response.assets[0].uri!,
                        filePath: s,
                        width: response.assets[0].width!,
                        height: response.assets[0].height!,
                        displayName: response.assets[0].fileName!,
                        fileSize: response.assets[0].fileSize!,
                      });
                    }
                  }
                });
              }
            };
            let title = actions[1].title;
            let type = actions[1].type;
            let options = actions[1].options;
            console.log(`${ChatManagerScreen.TAG}: `, title, type, options);
            f(type, options);
          }}
        >
          select
        </Button>
      </View>,
      <View style={styleValues.containerRow} key="displayName">
        <Text style={styleValues.textStyle}>DisplayName: </Text>
        <TextInput
          style={styleValues.textInputStyle}
          onChangeText={(text: string) => {
            // console.log(`${ChatManagerScreen.TAG}: `, text);
            this.setState({ displayName: text });
          }}
        >
          {displayName}
        </TextInput>
      </View>,
      <View style={styleValues.containerRow} key="sendMessage">
        <Button
          title="sendMessage"
          onPress={() => {
            // console.log(`${ChatManagerScreen.TAG}`);
            this.sendMessage();
          }}
        >
          sendMessage
        </Button>
      </View>,
    ];
  }

  render(): ReactNode {
    const { messageType, messageResult, listenerResult } = this.state;
    return (
      <View style={styleValues.containerColumn}>
        <View style={styleValues.containerRow}>
          <Text style={styleValues.textStyle}>Message type: </Text>
          <ModalDropdown
            style={styleValues.dropDownStyle}
            defaultValue={ChatMessageBodyType.TXT}
            options={ChatManagerScreen.messageType}
            onSelect={(index: string, option: any) => {
              console.log(`${ChatManagerScreen.TAG}: `, index, option);
              this.setState({ messageType: option });
            }}
          />
        </View>
        <View style={styleValues.containerRow} key="targetType">
          <Text style={styleValues.textStyle}>Target type: </Text>
          <ModalDropdown
            style={styleValues.dropDownStyle}
            defaultValue={'ChatMessageChatType.PeerChat'}
            options={ChatManagerScreen.messageChatType}
            onSelect={(index: string, option: any) => {
              console.log(`${ChatManagerScreen.TAG}: `, index, option);
              let r = ChatMessageChatType.PeerChat;
              if (option === 'ChatMessageChatType.PeerChat') {
                r = ChatMessageChatType.PeerChat;
              } else if (option === 'ChatMessageChatType.GroupChat') {
                r = ChatMessageChatType.GroupChat;
              } else {
                r = ChatMessageChatType.ChatRoom;
              }
              this.setState({ chatType: r });
            }}
          />
        </View>

        {this.renderMessage(messageType)}

        <View style={styleValues.containerRow}>
          <Text style={styleValues.textTipStyle}>
            Send result: {messageResult}
          </Text>
        </View>
        <View style={styleValues.containerRow}>
          <Text style={styleValues.textTipStyle}>
            Listener result: {listenerResult}
          </Text>
        </View>
      </View>
    );
  }
}

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const includeExtra = true;

const actions: Action[] = [
  {
    title: 'Take Image',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Select Image',
    type: 'library',
    options: {
      maxHeight: 200,
      maxWidth: 200,
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Take Video',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'video',
      includeExtra,
    },
  },
  {
    title: 'Select Video',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'video',
      includeExtra,
    },
  },
  {
    title: `Select Image or Video\n(mixed)`,
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'mixed',
      includeExtra,
    },
  },
];
