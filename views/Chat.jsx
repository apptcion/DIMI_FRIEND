import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    TextInput,
    Keyboard
  } from 'react-native';
import {useState, useEffect, useRef, useCallback} from 'react';
import { useSocket } from '../SocketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EarlyStop from './EarlyStop';
import useBlockBackButton from '../backHandler';

Text.defaultProps = {
    ...(Text.defaultProps || {}),
    allowFontScaling: false,
};

TextInput.defaultProps = {
    ...(TextInput.defaultProps || {}),
    allowFontScaling: false
}

const Chat = ({ msgData, setActionFunc }) => {

    const msg = msgData.message;
    const side = msgData.myMessage
    return (
        <View
            style={[styles.chat]}>
            <View style={[styles.msgWrap, side ? styles.me : styles.other]}>
                <TouchableHighlight style={[styles.msg, side ? styles.meMsg : styles.otherMsg]}
                underlayColor={side ? '#C7C9d6' : '#B47A90'}
                onLongPress={() => {
                    setActionFunc(true);
                }}>
                    <Text style={{color: 'black'}}>{msg}</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}

const Concern = ({data}) => {
    return (
        <View style={[styles.active]}>
            <Text style={styles.activeText}>{data}</Text>
        </View>
    )
}

const ChatView = ({route, navigation}) => {

    useBlockBackButton();
    
    const socket = useSocket();
    const scrollViewRef = useRef(null)
    const {data : {nickname, id}} = route.params;
    const [message, setMessage] = useState('');
    const [msgList, setMsgList] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [showExit, setShowExit] = useState(false);
    const [showReportSuc, setShowReportSuc] = useState(false);
    const [opponentConcern, setOpponentConcern] = useState([]);
    const [isKeyBoardVisible, setIsKeyboardVisible] = useState(false)

    const emitConcern = async () => {
        const myConcern = await AsyncStorage.getItem('concern')
        socket.emit('send-concern', {myConcern, id})
    }
    
    const Send = useCallback(async () => {

        if(message.trim().length != 0){
            setMsgList(prev => [...prev, {message, myMessage: true}]);
            socket.emit('send-message', {message, id});
            setMessage('');
            setTimeout(() => 
                scrollViewRef.current?.scrollToEnd({ animated: false }), 
            10)
        }
    }, [socket, message, id]);

    let intervalID = 0;
    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }
        socket.on('receive-concern', (data) => {
            if(data){
                setOpponentConcern(data.split(','))
            }
        })

        socket.on('receive-message', (data) => {
            setMsgList(prev => [...prev, {message: data, myMessage: false}]);
            setTimeout(() => 
                scrollViewRef.current?.scrollToEnd({ animated: false }), 
            10)
        });

        socket.on('receive-profile', (data) => {
            socket.emit('finish')
            navigation.reset({
                index : 0,
                routes: [{
                    name: 'EarlyStopProfile',
                    params: {
                        opponentProfile : data.profile, 
                        opponentDisplayName : data.displayName, 
                        opponentDepartment : data.department
                    } 
                }],

            })
        })

        let now = new Date();
        now.setHours(now.getUTCHours() + 9);
        let temp = 0;
        intervalID = setInterval(() => {
            if(  now.getHours() == 1 /*temp >= 1*/ ){
                clearInterval(intervalID)
                socket.off('receive-message');
                socket.off('receive-concern');
                socket.off('receive-profile');
                keyboardDidShowListener.remove();
                keyboardDidHideListener.remove();
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Show'}]
                });
            } else {
                temp += 1;
                now.setSeconds(now.getSeconds() + 1);
            }
        }, 1000);

        emitConcern()

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
          setIsKeyboardVisible(true);
          scrollViewRef.current?.scrollToEnd({ animated: false })
        });
    
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
          setIsKeyboardVisible(false);
          scrollViewRef.current?.scrollToEnd({ animated: false })
        });

        return () => {
            clearInterval(intervalID);
            socket.off('receive-message');
            socket.off('receive-concern');
            socket.off('receive-profile');
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [socket, navigation, showMenu, showExit]);

    return (
        <SafeAreaView style={{flex : 1}}>
            { showMenu && 
                <View style={styles.menu}>
                    <View style={{position : 'absolute', bottom : 0, width : '100%', height : '35%', display : 'flex'}}>
                        <View style={{ backgroundColor : '#EFF0F6', width : '100%', height : '15%', borderTopLeftRadius : 20, borderTopRightRadius : 20 }}/>
                        <View style={styles.menuContentWrap}>
                            <TouchableOpacity style={styles.menuBtn}
                                onPress={() => {
                                    socket.emit('report')
                                    setShowMenu(false)
                                    setShowReportSuc(true)
                                }}
                                >
                                <Text style={[styles.menuBtnText, {color : '#E83C77'}]}>신고하기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuBtn, {marginBottom : 30}]}
                                onPress={() => {setShowMenu(false)}}>
                                <Text style={styles.menuBtnText}>취소</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> }
            { showReportSuc && 
                <View style={styles.ReportWrap}>
                    <View style={styles.Report}>
                        <Text style={styles.ReportText}>신고가 접수되었습니다.</Text>
                        <TouchableOpacity
                            style={styles.ReportBtn}
                            onPress={() => {
                                setShowReportSuc(false)
                            }}>
                            <Text style={styles.ReportBtnText}>확인</Text>
                        </TouchableOpacity>
                    </View> 
                </View> }
            { showExit && <EarlyStop navigation={navigation} intervalID={intervalID} setActionFunc={setShowExit}/>}
            <View style={[{ flex : 1, display : 'flex'}]}>
                <View style={[styles.header]}>
                    <TouchableOpacity style={styles.exit}
                        onPress={() => {
                            setShowExit(true)
                        }}
                        >
                        <Text style={styles.exitTxt}>채팅 나가기</Text>
                    </TouchableOpacity>
                    <View style={styles.caution}>
                        <Text style={{color : '#D50000', fontSize : 12.5, paddingRight: 10}}>*부적절한 대화는 생교위를 부릅니다.</Text>
                    </View>
                </View>
                <View style={[styles.chatting_wrap]}>
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={{ flexGrow: 1 }} >
                        <View style={styles.matchedWith}>
                            <View><Text style={[ styles.notice]}><Text style={[styles.bold, styles.notice]}>{nickname}</Text>님과 연결되었습니다.</Text></View>
                            <View><Text style={[ styles.notice]}>규칙을 준수하며 소통해주세요</Text></View>
                        </View>
                            {msgList.map((msgData, index) => (
                                <Chat key={index} msgData={msgData} setActionFunc={setShowMenu}/>
                            ))}
                    </ScrollView>
                </View>
                <View style={[styles.chatInput, isKeyBoardVisible ? {height : '13%'} : {}]}>
                    <View style={[styles.top, isKeyBoardVisible ? {height : '0%', display : 'none'} : {}]}>
                        <Text style={[styles.recommend]}>상대방의 관심사</Text>
                        <View style={[styles.List]}>
                            <ScrollView horizontal={true}>
                                {opponentConcern.map((concern, index) => {
                                    return <Concern key={index} data={concern}/>
                                })}    
                            </ScrollView>
                        </View>
                    </View>
                    <View style={[styles.Bottom, isKeyBoardVisible ? {height : '100%'} : {}]}>
                        <View style={styles.inputBG}>
                            <TextInput style={styles.input}
                                returnKeyType="send"
                                value={message}
                                onChangeText={(text) => {
                                    setMessage(text)
                                }}
                                onSubmitEditing={Send}
                            ></TextInput>
                        </View>
                        <TouchableOpacity
                            style={styles.sendBtn}
                            onPress={Send}
                        >
                        <Image style={styles.send} source={require('../assets/img/Send.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
};


const styles = StyleSheet.create({
    ShowBorder : {
        borderStyle : 'solid',
        borderColor : 'red',
        borderWidth : 1
    },
    BG : {
        paddingTop : '15%',
        width : '100%',
        height : '100%',
        backgroundColor : '#EFF0F6'
    },
    menu : {
        position : 'absolute',
        top : 0,
        left : 0,
        width : '100%',
        height : '100%',
        backgroundColor : 'rgba(0, 0, 0, 0.42)',
        zIndex : 999999
    },
    menuContentWrap : { 
        backgroundColor : '#EFF0F6',
        width : '100%',
        height : '85%',
        display : 'flex',
        flexWrap : 'wrap',
        justifyContent : 'space-between',
        alignContent : 'center'
    },
    menuBtn : {
        backgroundColor : 'white',
        width : '90%',
        height : '25%',
        display : 'flex',
        position : 'relative',
        bottom : '5%',
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 15
    },
    menuBtnText : {
        fontWeight : 'bold',
        fontSize : 17
    },
    header : {
        position : 'relative',
        width : '100%',
        minHeight : 20,
        flex : 0.25,
        backgroundColor : '#EFF0F6',
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center'
    },
    exit : {
        backgroundColor : 'white',
        padding : '3%',
        borderRadius : 7,
        marginLeft : '5%'
    },
    exitTxt : {
        color : 'black',
        fontSize : 13,
        fontWeight : '400'
    },
    ReportWrap : {
        position : 'absolute',
        width : '100%',
        height : '100%',
        top : 0,
        left : 0,
        zIndex : 10,
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : 'rgba(0, 0, 0, 0.42)',
    },
    Report : {
        position : 'relative',
        width : '70%',
        height : '20%',
        marginBottom : '40%',
        backgroundColor : 'white',
        display : 'flex',
        borderRadius : 20,
        alignItems : 'center',
        justifyContent : 'space-evenly'
    },
    ReportText : {
        fontSize : 18,
        fontWeight : 'bold',
        color : '#e61c59'
    },
    ReportBtn : {
        borderRadius : 10,
        backgroundColor : 'rgb(239, 239, 239)',
        width : '50%',
        height : '20%',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center'
    },
    ReportBtnText : {
        fontSize : 15,
        color : 'black'
    },
    caution : {
        height : '80%',
        display : 'flex',
        justifyContent : 'flex-end'
    },
    chatting_wrap : {
        backgroundColor : 'white',
        width : '100%',
        position : 'relative',
        height : '75%',
        paddingBottom : '3%'
    },
    chat : {
        position : 'relative',
        display : 'flex',
        flexDirection : 'row',
        marginBottom : 10
    },
    msgWrap : {
        width : '100%',
    },
    me : {
        paddingRight : '6%',
        display : 'flex',
        alignItems : 'flex-end'
    },
    meMsg : {
        backgroundColor : '#D4D7EA',
    },
    other : {
        display : 'flex',
        paddingLeft : '6%',
        alignItems : 'flex-start'
    },
    otherMsg : {
        
        backgroundColor : '#EC9CBB',
    },
    msg : {
        maxWidth : '90%',   
        paddingLeft : '5%',
        paddingRight : '5%',
        paddingTop : '3%',
        paddingBottom : '3%',
        borderRadius : 10

    },
    notice : {
        textAlign : 'center',
        color : 'rgba(0,0,0,0.5)',
        width : '100%'
    },
    bold : {
        fontWeight : 'bold'
    },
    matchedWith : {
        height : '80',
        backgroundColor : '#EFF0F6',
        marginTop : '5%',
        paddingLeft : '5%',
        paddingRight : '5%',
        paddingTop : '3%',
        paddingBottom : '3%',
        alignSelf: 'center',
        borderRadius : 10,
        marginBottom : '5%'
    },
    chatInput : {
        position : 'absolute',
        bottom : 0,
        height : '20%',
        width : '100%',
        backgroundColor : '#EFF0F6',
        borderTopLeftRadius : 15,
        borderTopRightRadius : 15,
        overflow : 'hidden'
    },
    top : {
        width : '100%',
        height : '50%',
        minHeight : 80,
        flexDirection : 'row',
        alignItems : 'center',
        flexWrap : 'wrap',
        borderRadius : 100
    },
    recommend : {
        color : '#000000',
        width : '100%',
        height : '50%',
        minHeight : '50%',
        paddingLeft : '7%',
        paddingTop : '4%',
        fontWeight : 'bold',
        fontSize : 12,
    },
    List : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        width : '100%',
        height : '39%',
        marginLeft :'5.6%'
    },
    active : {
        backgroundColor : 'white',

        fontSize : 13,
        fontWeight : 'bold',
        color : 'black',
        borderRadius : 15,
        marginLeft : 5,
        marginRight : 5,
    },
    activeText : {
        fontSize : 13,
        fontWeight : 'bold',
        color : 'black',
        marginTop : 12,
        marginLeft : 12,
        marginRight : 12,
        position : 'relative',
        top : -3
    },
    Bottom : {
        width : '100%',
        height : '50%',
        flexDirection : 'row',
        justifyContent : 'center',
        backgroundColor : '#EFF0F6'
    },
    inputBG : {
        backgroundColor : 'white',
        width : '80%',
        height : '60%',
        marginTop : '3%',
        borderRadius : 23,
        paddingLeft : '5%',
        paddingRight : '5%',
    },
    input : {
        fontSize : 17,
        color : 'black'
    },
    sendBtn : {
        marginTop : '3%',
        marginLeft : '3%',
        backgroundColor : '#E83C77',
        width : '12.2%',
        height : '59%',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 100
    }
})

export default ChatView