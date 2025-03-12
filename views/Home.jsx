import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard, 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useBlockBackButton from '../backHandler';
Text.defaultProps = {
  ...(Text.defaultProps || {}),
  allowFontScaling: false,
};

TextInput.defaultProps = {
    ...(TextInput.defaultProps || {}),
    allowFontScaling: false
}


const Home = ({navigation}) => {

  useBlockBackButton();

  const [nickname, setNickname] = useState('')
  const [showWarning, setShowWarning] = useState(false)
  const [isKeyBoardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    const getNickname = async () => {
      const storedNickname = await AsyncStorage.getItem('Nickname');
      if (storedNickname) {
        setNickname(storedNickname);
      } else {
        navigation.navigate('Login');
      }
    };
    getNickname();

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };

  }, [navigation]);

  return (
      <SafeAreaView>            
        <View style={[ styles.BG]}>
          <Image style={[styles.BG_pattern]} source={require('../assets/img/BG_pattern.png')}></Image>
          <View style={[styles.TitleWrap]}>
            <View style={[styles.Title]}><Text style={[styles.TitleMsg]}>DIMI</Text></View>
            <View style={[styles.Title]}><Text style={[styles.TitleMsg]}>FRIEND</Text></View>
            <View style={[styles.Underbar, isKeyBoardVisible ? {height : '10%'} : {}]}></View>
          </View>
          <View style={[styles.inputWrap,
            isKeyBoardVisible ? {height : '7.5%', marginTop : '10%'} : {}]}>
            <TextInput style={[styles.input]}
              placeholder='채팅에 사용할 닉네임 입력'
              placeholderTextColor="rgba(0,0,0,0.3)"
              value={nickname}
              onChangeText={(text) => {
                  setNickname(text);
                  AsyncStorage.setItem('Nickname', text);
                }} />
          </View>
          {showWarning && <Text style={[styles.warning]}>닉네임이 너무 짧거나 길어요</Text>}
          <TouchableOpacity
            style={[styles.button,
              isKeyBoardVisible ? {height : '11.5%'} : {}
            ]}
            onPress={() => {
              if(0 < nickname.length && nickname.length <= 10){
                AsyncStorage.setItem('Nickname', nickname)
                let now = new Date().getUTCHours() + 9;
                if(now >= 24) now -= 24;
                //
                navigation.navigate('Match')
                
              }else{
                setShowWarning(true)
              }
            }} >
              <Text style={styles.buttonText}>시작하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.selectProfile]}
            onPress={() => {navigation.navigate('Profile')}}>
            <Text style={styles.selectText}>프로필 선택하러 가기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.selectProfile]}
            onPress={() => {navigation.navigate('Filter')}}>
            <Text style={styles.selectText}>필터 선택하러 가기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.selectProfile]}
            onPress={()=>{
              navigation.reset({
                index : 0,
                routes : [{
                    name : 'Concern',
                    params : { fromNickname : true }
                }]
              })
            }}>
            <Text style={styles.selectText}>관심사 수정하러 가기</Text>
          </TouchableOpacity>
        </View>
        <Image source={require('../assets/img/BG_pattern2.png')} style={[styles.bottomPattern,
          isKeyBoardVisible ? { top : '0%'} : {top : '-40%'}]}/>
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
    height : '10%',
    marginTop : '45%',
  },
  Title : {
    display : 'flex',
    justifyContent : 'center',
    flexDirection : 'row',
    height : '29%',
    minHeight : 35
  },
  TitleMsg : {
    color : '#E83C77',
    fontSize : 30,
    fontWeight : 'bold',
    textShadowColor : 'rgba(0,0,0,0.1)',
    textShadowOffset : {height : 4, width : 0},
    textShadowRadius : 7
  },
  Underbar : {
    width : '40%',
    height : '6.5%',
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
  inputWrap : {
    backgroundColor : 'white',
    width : '56%',
    position : 'relative',
    left : '22%',
    borderRadius : 12,
    paddingLeft : '5%',
    paddingRight : '5%',
    shadowColor : 'rgba(0,0,0,0.03)',
    shadowOffset : {
      width : 0, height : 3
    },
    marginBottom : '6%'
  },
  input : {
    width : '100%',
    color : 'black'
  },
  warning : {
      position : 'absolute',
      left : '40.8%',
      top : '50%',
      width : '35%',
      color : 'red',
      fontSize : 10
  },
  button : {
    marginLeft : '31.5%',
    backgroundColor : '#E83C77',
    borderRadius : 25,
    width : '37%',
    height : '6%',
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center',
    marginBottom : '8%'
  },
  buttonText : {
    color : 'white',
    fontWeight : 'bold',
    fontSize : 18
  },
  selectProfile : {
    marginTop : '4%',
    alignSelf : 'center'
  },
  selectText : {
    fontSize : 16,
    color : 'rgba(64,63,63,0.68)',
    fontWeight : 'bold'
  }, 
  bottomPattern : {
    position : 'relative', 
    width : '100%',
    height : '30%'
  }
})

export default Home;