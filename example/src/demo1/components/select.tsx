import * as React from 'react';
import { Picker } from 'react-native';
import FormItem from './form-item';

export default (params: {
  label: any;
  options: any;
  value: any;
  onChange: any;
}) => (
  <FormItem label={params.label}>
    <Picker selectedValue={params.value} onValueChange={params.onChange}>
      {Object.keys(params.options).map((key) => (
        <Picker.Item key={key} label={params.options[key]} value={key} />
      ))}
    </Picker>
  </FormItem>
);
