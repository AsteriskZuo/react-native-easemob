import * as React from 'react';
import { ScrollView, Text } from 'react-native';
import Example from './example';
import Connect from './connect';
import ReceiveMessage from './receive-message';
import SendMessage from './send-message';

// const examples = [Connect, ReceiveMessage, SendMessage];

// export default class extends React.PureComponent {
//   static route = 'default';
//   static navigationOptions = { title: 'Easemob Sdk Examples' };

//   render() {
//     return (
//       <ScrollView>
//         <Text>{"test"}</Text>

//         <Text>{"test"}</Text>
//         <Text>{"test"}</Text>
//         <Text>{"test"}</Text>
//         <Text>{"test"}</Text>
//         <Text>{"test"}</Text>
//         <Text>{"test"}</Text>

//         </ScrollView>
//     )
//   }

//   // render() {
//   //   return (
//   //     <ScrollView>
//   //       {examples.map(({ navigationOptions: { title }, route }) => (
//   //         // <Example key={title} />
//   //         <Text>{"test"}</Text>
//   //       ))}
//   //     </ScrollView>
//   //   );
//   // }
// }

export { Connect, ReceiveMessage, SendMessage };
