import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore'
import firebase from '@react-native-firebase/app';

Text.defaultProps = {
  ...(Text.defaultProps || {}),
  allowFontScaling: false,
};

const firebaseConfig = {
  apiKey: "AIzaSyAt9EvxRcONrGjxlv_hxpwvdhWMM_yLcjk",
  projectId: "dimifirend",
  appId: "1:372326566736:android:279ea50cea78d294df3a55"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const user = firestore().collection('User')

const Profile = ({ navigation}) => {

  const [profileImg, setProfileImg] = useState(null)

  const selectImage = () => {
    launchImageLibrary({
      mediaType : 'photo',
      maxWidth : 512,
      maxHeight : 512,
      includeBase64 : true
    },
    (response) => {
      if(response.didCancel){
        return;
      }else if(response.errorCode){
        console.error("Error : ", response.errorCode)
      } else if (response.assets && response.assets[0].uri) {
        setProfileImg(response.assets[0]);
      }
    })
  }

  useEffect(() => {
    const loadProfile = async () => {
      if(await AsyncStorage.getItem('profile')){
        setProfileImg(JSON.parse(await AsyncStorage.getItem('profile')));
      }
    }
    loadProfile();
  },[])

  return (
      <SafeAreaView>            
        <View style={[ styles.BG]}>
          <Image style={[styles.BG_pattern]} source={require('../assets/img/BG_pattern.png')}></Image>
          <View style={[styles.TitleWrap]}>
            <View style={[styles.Title]}><Text style={[styles.TitleMsg]}>DIMI</Text></View>
            <View style={[styles.Title]}><Text style={[styles.TitleMsg]}>FRIEND</Text></View>
            <View style={[styles.Underbar]}></View>
          </View>
          <TouchableOpacity
            style={[ styles.selectProfile]}
            onPress={selectImage} >
              <Image style={[styles.profileImg]} 
                source={
                profileImg ? {uri : profileImg.uri} : require('../assets/img/Camera.png')}></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.goHome]}
            onPress={async () => {
                try {
                 AsyncStorage.setItem('profile', JSON.stringify(profileImg))
                 let email = await AsyncStorage.getItem('email')
                  user.doc(email).update({
                    profile : JSON.stringify(profileImg)
                  })
                } catch (error) {
                  AsyncStorage.setItem('profile','')
                }
                navigation.navigate('Home')
            }}
          >
            <Text style={styles.goHomeTxt}>홈화면으로 가기</Text>
          </TouchableOpacity>
        </View>
        <Image source={require('../assets/img/BG_pattern2.png')} style={styles.bottomPattern}/>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  ShowBorder : {
      borderStyle : 'solid',
      borderColor : 'black',
      borderWidth : 1
  },
  BG : {
      padding : '7%',
      width : '100%',
      height : '100%',
      backgroundColor : '#EFF0F6'
  },
  BG_pattern : {
    position : 'absolute',
    top : 0,
    right : 0
  },
  TitleWrap : {
    width : '100%',
    height : '12%',
    marginTop : '21%',
    minHeight : 90
  },
  Title : {
    display : 'flex',
    justifyContent : 'center',
    flexDirection : 'row',
    height : '38%',
  },
  TitleMsg : {
    color : '#E83C77',
    fontSize : 30,
    fontWeight : 'bold',
    textShadowColor : 'rgba(0,0,0,0.1)',
    textShadowOffset : {height : 4, width : 0},
    textShadowRadius : 7,
  },
  Underbar : {
    width : '40%',
    height : '7%',
    backgroundColor : '#E83C77',
    shadowColor : 'rgba(0,0,0,0.1)',
    shadowOffset : {height : 5, width : 0},
    shadowRadius : 1,
    ...Platform.select({
      android : {
        elevation : 10,
      }
    }),
    marginTop : '2%',
    marginLeft : '30%'
  },
  selectProfile : {
    marginTop : '10%',
    width : '50%',
    height : '22%',
    position : 'relative',
    left : '25%'
  },
  profileImg: {
    width: '100%',
    height : '100%',
    borderRadius: 100
  },
  goHome : {
    marginTop : '10%',
    alignSelf : 'center'
  },
  goHomeTxt : {
    fontSize : 18,
    color : '#787779',
    fontWeight : 'bold'
  },
  bottomPattern : {
    position : 'absolute',
    top : '73%',
    width : '100%',
    height : '30%'
  }
})

export default Profile;