import React, { useEffect } from 'react';
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

export const EarlyStopProfileView = ({navigation, route}) => {

    useBlockBackButton();

    const { opponentDisplayName, opponentDepartment } = route.params

    let opponentProfile = ''
    if(route.params.opponentProfile != 'default'){
        opponentProfile = JSON.parse(data.profile).base64
    }else{
        opponentProfile = 'default'
    }

    return (
        <SafeAreaView>
             <View style={[ styles.BG]}>
                <View style={[ProfileStyles.center]}>
                    <View style={[ProfileStyles.questionWrap]}>
                        <Text style={[ProfileStyles.question]}>상대방이 채팅을 나갔습니다.{'\n'}</Text>                    
                        <Text style={[ProfileStyles.notice]}>상대방의 정체는?</Text>
                    </View>

                        <View style={[ProfileStyles.info]}>
                            <View style={ProfileStyles.ProfileBG}>
                            { opponentProfile == 'default' ? <Image source={require('../assets/img/People.png')}/>
                                : <Image style={ProfileStyles.profile}source={{ uri: `data:image/png;base64,${opponentProfile}` }}/> }
                            </View>
                            <Text style={ProfileStyles.name}>{opponentDisplayName}님</Text>     
                            <Text style={{ alignSelf : 'center', position : 'relative', top: '5%'}}>{opponentDepartment}</Text>
                        </View>
                    <TouchableOpacity
                        style={ProfileStyles.goHome}
                        onPress={() => {
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
            <Image source={require('../assets/img/BG_pattern2.png')} style={ProfileStyles.bottomPattern}/>
        </SafeAreaView>
    )
}

const ProfileStyles = StyleSheet.create({
    center: {
        position: 'relative',
        top: '10%',
        width: '100%',
        height: '30%',
    },
    notice: {
        fontSize: 16,
        color: 'black',
        alignSelf: 'center',
        marginBottom: '3%',
        color : '#E83C77'
      },
    questionWrap: {
        display : 'flex',
        flexWrap : 'wrap',
        flexDirection : 'row',
        alignSelf: 'center',
        justifyContent : 'center',
    },
    question : {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        height : '30%'
    },
    info : {
        marginTop : '4%',
        height : '100%'
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


const EarlyStop = ({ navigation, intervalId, setActionFunc }) => {
    const socket = useSocket();

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            clearInterval(intervalId);
            socket.off('connect');
            socket.off('receive-choose');
        };
    }, [socket]);

    return (
        <SafeAreaView>
            <View style={[styles.BG]}>
                <View style={[styles.center]}>
                    <View style={[styles.questionWrap]}>
                        <Text style={styles.question}>
                            <Text style={{ color: '#E83C77' }}>정말</Text> 채팅을 끝낼건가요?
                        </Text>
                        <Text style={styles.notice}>채팅을 나가게 되면</Text>
                        <Text style={[styles.notice]}>상대방이 당신의 정체를 알게 됩니다.</Text>
                    </View>
                    <View style={[styles.BtnWrap]}>
                        <TouchableOpacity
                            style={styles.Yes}
                            onPress={async () => {
                                clearInterval(intervalId)
                                socket.off('receive-message');
                                socket.off('receive-concern')
                                socket.off('receive-profile')

                                const myDisplayName = await AsyncStorage.getItem('displayName')
                                const opponentId = await AsyncStorage.getItem('opponentId')
                                const myProfile = await AsyncStorage.getItem('profile')
                                const myDepartment = await AsyncStorage.getItem('department')
                                if(myProfile == 'null') {
                                    socket.emit('send-profile', {id : opponentId, profile: 'default', displayName: myDisplayName, department : myDepartment})
                                }else{
                                    socket.emit('send-profile', {id : opponentId, profile: myProfile, displayName: myDisplayName, department : myDepartment})
                                }                            
                                socket.emit('finish')

                                navigation.reset({
                                    index: 0,
                                    routes: [{name: 'Home'}]
                                });
                            }} >
                            <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white' }}>
                                Yes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.No}
                            onPress={() => {
                                setActionFunc(false)
                            }} >
                            <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>
                                No
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Image source={require('../assets/img/BG_pattern2.png')} style={styles.bottomPattern} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  ShowBorder: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
  },
  BG: {
    padding: '16%',
    width: '100%',
    height: '100%',
    backgroundColor: '#EFF0F6',
  },
  center: {
    position: 'relative',
    display : 'flex',
    alignItems : 'center',
    top: '27.5%',
    width: '100%',
    height: '22%',
  },
  notice: {
    marginLeft : '10%',
    fontSize: 11,
    color: 'black',
    alignSelf: 'center',
  },
  questionWrap : {
    width : '71%',
    display : 'flex',
    flexDirection : 'row',
    justifyContent : 'flex-end',
    flexWrap : 'wrap',
    marginBottom : '15%'
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    marginBottom: '3%',
  },
  Yes: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E83C77',
    width: '46%',
    borderRadius: 6,
  },
  No: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DEDEDE',
    width: '46%',
    borderRadius: 6,
  },
  BtnWrap: {
    position: 'relative',
    width: '90%',
    height: '35%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  bottomPattern: {
    position: 'absolute',
    top: '80%',
    width: '100%',
  },
});

export default EarlyStop;