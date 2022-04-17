import { StyleSheet } from 'react-native';

export const styleValues = StyleSheet.create({
  containerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdfb86',
    marginLeft: 2,
    marginRight: 2,
    marginTop: 1,
    marginBottom: 1,
  },
  containerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#96f2ca',
    margin: 1,
  },
  textStyle: {
    margin: 5,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#3a4a35',
  },
  textTipStyle: {
    margin: 5,
    textAlign: 'left',
    color: '#3a4a35',
  },
  textInputStyle: {
    flex: 1,
    margin: 5,
    // fontSize: 20,
    fontWeight: 'normal',
    textAlign: 'left',
    color: '#3a4a35',
    backgroundColor: '#86dcfc',
    borderWidth: 1,
    maxHeight: 40,
  },
  viewStyle: {
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  dropDownStyle: {
    flex: 1,
    fontSize: 20,
    backgroundColor: '#ecadff',
    height: 20,
    width: 200,
  },
});
