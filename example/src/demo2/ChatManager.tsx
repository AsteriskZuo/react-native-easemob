import React, { Component, ReactNode } from 'react';
import {
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from 'react-native';
import { styleValues } from './Const';

interface State {
  targetId: string;
  message: string;
}

export class ChatManagerScreen extends Component<
  { navigation: any },
  State,
  any
> {
  navigation: any;
  constructor(props: { navigation: any }) {
    super(props);
    this.navigation = props.navigation;
    this.state = {
      targetId: '',
      message: '',
    };
  }

  render(): ReactNode {
    const { targetId } = this.state;
    return (
      <View style={styleValues.containerColumn}>
        <View style={styleValues.containerRow}>
          <Text style={styleValues.textStyle}>TargetId: </Text>
          <TextInput
            style={styleValues.textInputStyle}
            onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
              // console.log(`${ClientScreen.TAG}`, e);
              this.setState({ targetId: e.nativeEvent.text });
            }}
          >
            {targetId}
          </TextInput>
        </View>
      </View>
    );
  }
}
