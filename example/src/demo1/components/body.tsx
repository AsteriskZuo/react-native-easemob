import * as React from 'react';
import { ScrollView } from 'react-native';

const style = { padding: 16 };

export default (params: { children: any }) => (
  <ScrollView contentContainerStyle={style}>{params.children}</ScrollView>
);
