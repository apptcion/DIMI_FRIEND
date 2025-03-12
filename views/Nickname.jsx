import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Dimensions
  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore'
import firebase from '@react-native-firebase/app';

Text.defaultProps = {
    ...(Text.defaultProps || {}),
    allowFontScaling: false,
};

TextInput.defaultProps = {
    ...(TextInput.defaultProps || {}),
    allowFontScaling: false
}


const firebaseConfig = {
  apiKey: "AIzaSyAt9EvxRcONrGjxlv_hxpwvdhWMM_yLcjk",
  projectId: "dimifirend",
  appId: "1:372326566736:android:279ea50cea78d294df3a55"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
  
const User = firestore().collection('User')

const {width, height} = Dimensions.get('window')


const Nickname = ({navigation}) => {

    const [showWarning, setShowWarning] = useState(false)
    let Nickname = '';

    useEffect(()=>{
    },[])

    return (
        <SafeAreaView>
            <View style={[ styles.BG]}>
                <View style={[styles.top]}>
                    <View style={styles.mainMessageWrap}>
                        <Text style={[styles.mainMessage]}>반가워요!</Text>
                        <Text style={[styles.mainMessage]}>닉네임을 정해주세요</Text>
                    </View>
                    <Text style={styles.h2}>디미프렌즈에서 사용할 닉네임이에요</Text>
                    <Text style={styles.h3}>언제든지 변경할 수 있어요</Text>
                </View>

                <View style={[styles.inputBox]}>
                    <View style={[styles.inputWrap]}>
                        <TextInput placeholder='닉네임을 입력해주세요'
                            style={[{color: 'black', width : '100%'}]}
                            returnKeyType="done"
                            onChangeText={(inputText) => {
                                Nickname = inputText;
                            }}
                        />
                    </View>
                    <Text style={styles.explane}>최대 10자까지 가능합니다.</Text>
                    {showWarning && <Text style={styles.warning}>!! 닉네임이 너무 짧거나 길어요</Text>}
                </View>
            </View>
            <View style={[styles.bottom]}>
                    <TouchableOpacity
                        style={[styles.prior, styles.button]} 
                        onPress={() => {
                            navigation.navigate('Guide')
                        }} >
                        <Text style={styles.priorMsg}>이전으로</Text>   
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.next, styles.button]}
                        onPress={() => {
                            if(0 < Nickname.length && Nickname.length <= 10){
                                const addUser = async () => {
                                    await AsyncStorage.setItem('Nickname', Nickname)
                                    let email = await AsyncStorage.getItem('email')
                                    let displayName = await AsyncStorage.getItem('displayName')
                                    await User.doc(email).set({
                                        email,
                                        displayName,
                                        profile : ''
                                    })
                                }
                                addUser();
                                navigation.reset({
                                    index : 0,
                                    routes : [{
                                        name : 'Concern',
                                        params : { fromNickname : true }
                                    }]
                                })
                            }else{
                                setShowWarning(true)
                            }
                        }} >
                        <Text style={styles.nextMsg}>다음으로</Text>
                    </TouchableOpacity>
                </View>
        </SafeAreaView>
    )
};


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
    top : {
        marginTop : `${height * 0.03}%`,
        width : '80%',
        marginBottom : '10%'
    },
    mainMessageWrap : {
        marginBottom : '3%'
    },
    mainMessage : {
        color : '#E83C77',
        fontSize : 30,
        fontWeight : 'bold'
    },
    h2 : {
        fontSize : 15,
        color : '#555969',
        fontWeight : 'bold'
    },
    h3 : {
        fontSize : 12,
        color : '#BABABA'
    },
    inputBox : {
        
        height : `8`,
        marginBottom : '97.5%'
    },
    inputWrap : {
        minWidth : '80%',
        backgroundColor : 'white',
        borderRadius : 13,
        width : '100%',
        flexDirection : 'row',
        paddingLeft : '7%',
        alignItems : 'center',
        marginBottom : '2%'
    },
    warning : {
        position : 'absolute',
        left : '5%',
        top : '100%',
        color : 'red',
        fontSize : 10
    },
    explane : {
        position : 'relative',
        left : '5%',
        color : '#555969',
        fontSize : 10,
        fontWeight : 'bold'
    },
    bottom : {
        position : 'absolute',
        top : '83%',
        width : '90%',
          height : '15%',
          justifyContent : 'space-between',
          alignSelf : 'center'
      },
    button : {
        width : '100%',
        height : '45%',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 12
    },
    prior : {
        backgroundColor : 'white'
    },
    priorMsg : {
        color : '#555969'
    },
    next : {
        position : 'relative',
        backgroundColor : '#E83C77',
        color : 'white'
    },
    nextMsg : {
        color : 'white'
    }
})

export default Nickname;