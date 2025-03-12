import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSocket } from '../SocketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useBlockBackButton from '../backHandler';

Text.defaultProps = {
    ...(Text.defaultProps || {}),
    allowFontScaling: false,
  };

const Result = ({navigation, route}) => {
    const socket = useSocket()
    useBlockBackButton();

    const result = route.params.result
    const [opponentProfile, setOpponentProfile] = useState('')
    const [opponentDisplayName, setOpponentDisplayName] = useState('')
    const [opponentDepartment, setOpponentDepartment] = useState('')
    const exchangeProfile = async () => {
        if(result){
            socket.on('receive-profile', (data) => {
                setOpponentDepartment(data.department)
                setOpponentDisplayName(data.displayName)
                if(data.profile != 'default'){
                    setOpponentProfile(JSON.parse(data.profile).base64)
                }else{
                    setOpponentProfile('default')
                }
            })
            const myDisplayName = await AsyncStorage.getItem('displayName')
            const opponentId = await AsyncStorage.getItem('opponentId')
            const myProfile = await AsyncStorage.getItem('profile')
            const myDepartment = await AsyncStorage.getItem('department')
            if(myProfile == 'null') {
                socket.emit('send-profile', {id : opponentId, profile: 'default', displayName: myDisplayName, department : myDepartment})
            }else{
                socket.emit('send-profile', {id : opponentId, profile: myProfile, displayName: myDisplayName, department : myDepartment})
            }
        }
    }

    useEffect(() => {
        exchangeProfile()
        
    }, [])

    return (
        <SafeAreaView>
             <View style={[ styles.BG]}>
                <View style={[styles.center]}>
                    <Text style={styles.notice}>이제 헤어져야 할 시간이에요</Text>
                    <Text style={styles.question}>
                        {result ? 
                            opponentProfile != '' ? <Text>상대방이 <Text style={{color : '#E83C77'}}>정체</Text> 공개에 동의했어요!</Text>
                            : <Text>친구의 프로필 가져오는 중...</Text>
                         :
                            <Text><Text style={{color : '#E83C77'}}>정체</Text> 공개에 동의하지 않았어요..</Text>}
                    </Text>
                    {result ? 
                        opponentProfile != '' ? 
                            <View style={[styles.info]}>
                             <View style={styles.ProfileBG}>
                            {
                                opponentProfile == 'default' ? <Image source={require('../assets/img/People.png')}/>
                                : <Image style={styles.profile}source={{ uri: `data:image/png;base64,${opponentProfile}` }}/>
                            }
                            </View>
                            <Text style={styles.name}>{opponentDisplayName}님</Text>     
                            <Text style={{ alignSelf : 'center', position : 'relative', top: '5%'}}>{opponentDepartment}</Text>
                           </View>
                        :  <View></View> 
                    :
                        <View style={[styles.Fail]}>
                            <Image style={{alignSelf : 'center'}}source={require('../assets/img/CryFace.png')}/>
                            <Text style={styles.seeYouLater}>언젠가 또 만날 수 있을 거에요</Text>
                        </View> 
                    }
                    <TouchableOpacity
                        style={styles.goHome}
                        onPress={() => {
                            socket.emit('finish')
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            });
                        }}
                    >
                        <Text style={{color : 'white', fontSize : 15, fontWeight : 'bold'}}>홈으로 돌아가기</Text>
                    </TouchableOpacity>
                </View>
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
        padding : '15%',
        width : '100%',
        height : '100%',
        backgroundColor : '#EFF0F6'
    },
    center: {
        position: 'relative',
        top: '10%',
        width: '100%',
        height: '30%',
    },
    notice: {
        fontSize: 17,
        color: 'black',
        alignSelf: 'center',
        marginBottom: '3%',
      },
    question: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'center',
        marginBottom: '10%',
    },
    info : {
        marginTop : '4%',
        height : '100%'
    },
    Fail : {
        marginTop : '16%',
        height : '118%'
    },
    seeYouLater : {
        position : 'absolute',
        top : '90%',
        color : '#AFAFAF',
        fontSize : 15,
        alignSelf : 'center'
    },
    ProfileBG : {
        borderRadius : '100%',
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems : 'center',
        width : '63%',
        height : '85%',
        alignSelf : 'center',
        borderRadius : 100
    },
    profile : {
        width : '100%',
        height : '100%',
        borderRadius : 100
    },
    name : {
        alignSelf : 'center',
        fontSize : 22,
        color : 'black',
        position : 'relative',
        top : '4%'
    },
    goHome : {
        backgroundColor : '#E83C77',
        position : 'absolute',
        top : '180%',
        alignSelf : 'center',
        paddingLeft : '13%',
        paddingRight : '13%',
        paddingTop : '3.5%',
        paddingBottom : '5%',
        borderRadius : 13,
    },
    bottomPattern : {
        position : 'absolute',
        top : '80%',
        width : '100%',
      }
})

export default Result;