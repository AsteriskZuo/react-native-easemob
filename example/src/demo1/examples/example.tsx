import * as React from 'react';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import {
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
  Text,
  View,
  StyleSheet,
} from 'react-native';

let Touchable: any = TouchableHighlight;
if (Platform.OS === 'android') {
  Touchable = TouchableNativeFeedback;
}

const style = StyleSheet.create({ text: { padding: 16, fontSize: 18 } });

let s = class extends React.PureComponent<NavigationInjectedProps> {
  onPress = () => {
    let s: any = this.props;
    s.navigation.navigate(s.route);
  };
  render() {
    return (
      <Touchable onPress={this.onPress}>
        <View>
          <Text style={style.text}>{(this.props as any).title}</Text>
        </View>
      </Touchable>
    );
  }
};

export default withNavigation(s);

// (Component: ComponentClass<NavigationInjectedProps<NavigationParams>, any>)
// (Component: ComponentType<NavigationInjectedProps<NavigationParams>>)
// (Component: ComponentType<NavigationInjectedProps<NavigationParams>>)
