import * as React from 'react';
import { Text, Platform } from 'react-native';
import FormItem from './form-item';

const style = { fontFamily: Platform.OS === 'ios' ? 'menlo' : 'monospace' };

export default (params: { children: any }) => (
  <FormItem label={''}>
    <Text style={style}>{params.children}</Text>
  </FormItem>
);
