import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import AllDetails from './app/components/TableComponent';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Detailform from './app/components/DetailForm';
import {Provider} from 'react-redux';
import {Store} from './app/redux/store';

function App(): JSX.Element {
  const RootStack = createStackNavigator();
  return (
    <Provider store={Store}>
         <NavigationContainer>
         <RootStack.Navigator
         initialRouteName="All Details"
         screenOptions={{
           headerTitleAlign: 'center',
           headerStyle: {
             backgroundColor: '#99BE9E'
           },
           headerTintColor: '#ffffff',
           headerTitleStyle: {
             fontSize: 25,
             fontWeight: 'bold'
           }
         }}
       >
          <RootStack.Screen
                name="All Details"
                component={AllDetails}
              />
            <RootStack.Screen
              name="DetailForm"
              component={Detailform}
              options={{
                headerShown:false,
              }}
            />
          </RootStack.Navigator>
          
        </NavigationContainer>
        </Provider>
      )};


const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    paddingLeft: 5, 
    paddingRight: 5,
    alignItems: 'center',
  },
  
});

export default App;
