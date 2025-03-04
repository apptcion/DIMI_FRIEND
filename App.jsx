/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './views/Home'
import Guide from './views/Guide'
import Nickname from './views/Nickname'
import Profile from './views/Profile'
import Wait from './views/Wait'
import Match from './views/Match'
import Chat from './views/Chat'
import Show from './views/Show'
import Result from './views/Result'
import Concern from './views/Concern'
import Filter from './views/Filter'
import { EarlyStopProfileView } from './views/EarlyStop';
import { SocketProvider } from './SocketContext'
import PersonalInfo from './views/personalInfo';

Text.defaultProps = {
  ...(Text.defaultProps || {}),
  allowFontScaling: false,
};

const Stack = createStackNavigator();

const LoginView = ({ navigation }) => {

  const [isNotDimigo, setNotDimigo] = useState(false);

  useEffect(()=> {
    GoogleSignin.configure({
      webClientId : '372326566736-tri1dhp6nnarlvimg3iqbe5ct2l3vqc3.apps.googleusercontent.com'
    })
  })

  const pressGoogleButton = async () => {
    try {
      GoogleSignin.signOut()
      const {data : {idToken}} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      if(userCredential){
        console.log("인증 성공")
      }
      if(userCredential.user.email/*.endsWith('@dimigo.hs.kr')*/){
        console.log(userCredential.user)
        setNotDimigo(false);
        AsyncStorage.setItem('email', userCredential.user.email)
        AsyncStorage.setItem('displayName', userCredential.user.displayName)
        let department = parseInt(userCredential.user.displayName.charAt(1))
        let departmentStr = 'Default'
        if(department == 1){
          departmentStr = 'E-Bussiness'
        }else if(department == 2){
          departmentStr = 'Digital Contents'
        }else if(department == 3 || department == 4){
          departmentStr = 'Web Programming'
        }else if(department == 5 || department == 6){
          departmentStr = "Hacking Defense"
        }
        let url = 'https://dimifriend.apptcion.site/user/login';
        console.log(url)
        
        fetch(url, {
          method : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
          }),
        })
        AsyncStorage.setItem('department', departmentStr)

        navigation.navigate('PersonalInfo')
        
      }else{
        setNotDimigo(true);
        GoogleSignin.signOut()
      }

    } catch (error) {
      console.error(error)
    }
  }
  
  return (
    <SafeAreaView>
      <View style={styles.wrap}>
        <View style={[styles.Top]}>
          <Text style={[styles.Title]}>DIMI FRIEND</Text>
          <Text style={[styles.descript]}>하루 1시간 새로운 친구를!</Text>
        </View>
        <View style={[styles.loginBtn]}>
          <GoogleSigninButton onPress={pressGoogleButton}></GoogleSigninButton>
          {isNotDimigo && (
            <Text style={[styles.error]}>디미고 계정을 사용해주세요</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

function App(){

  return (
    <SocketProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>      
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={LoginView} />
          <Stack.Screen name="PersonalInfo" component={PersonalInfo} />
          <Stack.Screen name="Guide" component={Guide} />
          <Stack.Screen name="Nickname" component={Nickname} />
          <Stack.Screen name="Concern" component={Concern} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Filter" component={Filter}/>
          <Stack.Screen name="Wait" component={Wait}/>
          <Stack.Screen name="Match" component={Match}/>
          <Stack.Screen name="Chat" component={Chat}/>
          <Stack.Screen name="EarlyStopProfile" component={EarlyStopProfileView} />
          <Stack.Screen name="Show" component={Show} />
          <Stack.Screen name="Result" component={Result} />
        </Stack.Navigator>
      </NavigationContainer>

    </SocketProvider>
  );
}

const styles = StyleSheet.create({
  Top: {
    width : '100%',
    height : '70%',
    justifyContent : 'center',
    display : 'flex',
    alignItems : 'center'

  },
  error : {
    color : 'red'
  },
  Img : {
    width : 25,
    height : 25,
  },
  loginBtn : {
    justifyContent : 'space-evenly',
    alignItems : 'center',
    width : '60%',
    height : '5%',
    borderRadius : 15,
    flexDirection : 'row',
    position : 'relative',
    top : '-10%',
    flexWrap : 'wrap'
  },
  loginTxt:{
    width : '70%',
    position : 'relative',
    left : '8%'
  },
  Title : {
    color : '#E83C77',
    fontWeight : 'bold',
    fontSize : 40,
  },
  descript:{
    color : '#555969'
  }
  ,
  wrap : {
    height : '100%',
    width : '100%',
    alignItems : 'center',
    backgroundColor : '#EFF0F6'
  },
  ShowBorder : {
    borderStyle : 'solid',
    borderColor : 'black',
    borderWidth : 2
  }
});

export default App;
