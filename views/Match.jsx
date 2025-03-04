import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-get-random-values';
import { useSocket } from '../SocketContext';

Text.defaultProps = {
    ...(Text.defaultProps || {}),
    allowFontScaling: false,
  };

const Match = ({navigation}) => {
    const socket = useSocket()
    const [dot1Act, setDot1Act] = useState(true)
    const [dot2Act, setDot2Act] = useState(false)
    const [dot3Act, setDot3Act] = useState(false)

    const cancelMatch = () => {
        
        clearInterval(interValID)
        clearTimeout(animateID)
        socket.off('connect')
        socket.off('matchFound')
        navigation.navigate('Home')
    }

    const joinQuque = async () => {
        let myDepartment = await AsyncStorage.getItem('department')
        const nickname = await AsyncStorage.getItem('Nickname');
        const displayName = await AsyncStorage.getItem('displayName')
        const filter = await AsyncStorage.getItem('filter')
        console.log(`${filter}, ${typeof filter}`)
        if(filter != null){
            socket.emit('join-queue', {nickname, displayName, filter : JSON.parse(filter), myDepartment });
        }else{
            socket.emit('join-queue', {nickname, displayName, filter : {
                'E-Bussiness' : true,
                'Digital Contents' : true,
                'Web Programming' : true,
                'Hacking Defense' : true,
            }, myDepartment });
        }
    }
    let animateID = 0;
    let interValID
    useEffect(() => {
        let now = new Date()
        interValID = setInterval(() => {
            if(now.getHours() >= 12){
                navigation.navigate('Match')
            }else{
                now.setSeconds(now.getSeconds() + 1)
            }
        },1000);

        if(socket){
            // 기존 리스너들 제거
            socket.removeAllListeners();
    
            if(socket.connected){
                console.log('already connected');
                
                joinQuque()
            }else{
                console.log('not connected')
                socket.connect()
                socket.on('connect', () => { 
                    console.log('connected');
                    joinQuque()
                })
            }
            
            socket.on('matchFound', async (data) => {
                
                clearInterval(interValID)
                clearTimeout(animateID)
                socket.off('matchFound')
                await AsyncStorage.setItem('opponentId', data.id)
                navigation.navigate('Chat', {data});
            });
        }


        const setterArray = [setDot1Act, setDot2Act, setDot3Act]
        
        const animate = (index) => {
            index %= 3;
        
            let before = index - 1;
            let after = index + 1;
            if (before < 0) before = 2;
            if (after > 2) after = 0;
        
            setterArray[before](false);
            setterArray[after](false);
            setterArray[index](true);
            animateID = setTimeout(() => animate(index + 1), 800);
          };
          animate(0)

        return () => {
            clearInterval(interValID)
            clearTimeout(animateID)
            socket.off('connect')
            socket.off('matchFound')
        }
    }, []);

    return (
        <SafeAreaView>
             <View style={[ styles.BG]}>
                <TouchableOpacity style={styles.back}
                    onPress={cancelMatch} 
                >
                    <Text style={styles.cancel}>취소</Text>
                </TouchableOpacity>
               <View style={[styles.center]}>
                    <View style={[styles.flexCenter, styles.imgWrap]}><Image style={styles.UserImg}source={require('../assets/img/user.png')}/></View>
                    <View style={[styles.flexCenter, styles.dots]}>
                        <View style={[styles.dot, dot1Act ? styles.actDot : styles.notAct]}></View>
                        <View style={[styles.dot, dot2Act ? styles.actDot : styles.notAct]}></View>
                        <View style={[styles.dot, dot3Act ? styles.actDot : styles.notAct]}></View>
                    </View>
                    <View style={[styles.flexCenter, styles.msgWrap]}><Text style={styles.msg}>매칭을 기다리고 있어요</Text></View>
                </View>
            </View>
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
        padding : '12%',
        width : '100%',
        height : '100%',
        backgroundColor : '#EFF0F6'
    },
    center : {
        width : '100%',
        height : '20%',
        marginTop : '80%'
    },
    flexCenter : {
        display : 'flex',
        flexDirection : 'row',
        width : '100%',
        justifyContent : 'center',
        alignItems : 'center'
    },
    imgWrap : {
        position : 'relative',
        top : '5%',
        height : '52%',
        marginBottom : '4%'
    },
    UserImg : {
        height : '100%',
        width : '20%'
    },
    dots : {
        position : 'relative',
        top : '5%',
        height : '24%',
        justifyContent : 'space-around',
        width : '30%',
        left : '35%',
        marginBottom : '5%'
    },
    dot : {
        height : '40%',
        width : '13.5%',
        borderRadius : 100
    },
    notAct : {
        backgroundColor : '#D9D9D9',
    },
    actDot : {
        backgroundColor : '#E83C77'
    },
    msgWrap : {
        height : '24%',

    },
    msg : {
        position : 'relative',
        top : '-5%',
        color : '#E83C77',
        fontSize :25
    },
    back: {
        position: 'absolute',
        top: '3%',
        left: '7%',
    },
    cancel : {
        color : 'black',
        fontSize : 20
    }
})

export default Match;