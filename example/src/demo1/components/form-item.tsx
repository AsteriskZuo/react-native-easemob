import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const style = StyleSheet.create({
  item: { marginBottom: 16 },
  label: { marginBottom: 8 },
});

export default (params: { label: any; children: any }) => (
  <View style={style.item}>
    {params.label && <Text style={style.label}>{params.label}</Text>}
    {params.children}
  </View>
);
