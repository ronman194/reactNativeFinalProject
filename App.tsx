import { FC } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Provider } from 'react-redux';
import store from './redux/store';
import {toastConfig} from './tools/ToastMessage'
import Auth from './navigation/Auth';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();
const stack = createNativeStackNavigator();

const App: FC = ({ }) => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Auth />
        <Toast config={toastConfig} />
      </NavigationContainer>

    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: 'grey',
  },

});

export default App
