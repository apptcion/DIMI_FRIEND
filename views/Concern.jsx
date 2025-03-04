import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Image,
    Dimensions,
    Keyboard,
  } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { v4 as uuidv4} from 'uuid'

Text.defaultProps = {
    ...(Text.defaultProps || {}),
    allowFontScaling: false,
};

TextInput.defaultProps = {
    ...(TextInput.defaultProps || {}),
    allowFontScaling: false
}


const {width, height} = Dimensions.get('window')

const Concern = ({data, wholeList, setConcern, setWarning}) => {

    return (
        <View style={styles.concern}>
            <Text style={styles.concernText}>{data.content}</Text>
            <TouchableOpacity
                onPress={() => {
                    setWarning(false)
                    setConcern(wholeList.filter((conc) => {
                        return conc.id != data.id
                    }))
                }}
                >
                <Image style={styles.concernImg }source={require('../assets/img/close.png')}/>
            </TouchableOpacity>
        </View>
    )
}


const ConcernView = ({navigation, route}) => {

    const {fromNickname} = route.params

    const [concernList, setConcernList] = useState([])
    const [newConcern, setNewConcern] = useState('')
    const [showWarning, setShowWarning] = useState(false)
    const [isKeyBoardVisible, setIsKeyboardVisible] = useState(false)
    
    const scrollViewRef = useRef(null)

    const getConcern = async () => {
        const legacy = await AsyncStorage.getItem('concern')
        if(legacy != null){
            setConcernList(legacy.split(',').map((content) => {
                return {content, id : uuidv4()}
            }))
        }
    }

    useEffect(() => {
        getConcern()
        
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
    }, [])

    return(
        <SafeAreaView>
        <View style={[styles.BG]}>
            <View style={[styles.top]}>
                <View style={styles.mainMessageWrap}>
                    <Text style={[styles.mainMessage]}>나의 관심사는?</Text>
                </View>
                <Text style={styles.h2}>채팅시 상대에게 보여요</Text>
                <Text style={styles.h3}>최대 5개까지 가능해요</Text>
            </View>

            <View style={[styles.inputBox]}>
                <View style={styles.inputWrap}>
                    <ScrollView horizontal={true}
                        ref={scrollViewRef}
                        >
                        <View style={[ styles.concernListWrap]}>
                            {concernList.map((concern, index) => {
                                return <Concern key={index} data={concern} wholeList={concernList} setConcern={setConcernList} setWarning={setShowWarning}/>
                            })}
                        </View>
                        
                        <TextInput
                            style={[ styles.input]}
                            value={newConcern} 
                            returnKeyType="done"
                            onChangeText={(inputText) => {
                                setNewConcern(inputText)
                                if (inputText.endsWith(' ') && inputText.trim().length > 0) {
                                    if(concernList.length < 5){
                                        setConcernList(prev => [...prev, {content : inputText.trim(), id: uuidv4() }]);
                                        setNewConcern("");  
                                        setTimeout(() => 
                                            scrollViewRef.current?.scrollToEnd({ animated: false })
                                        ,10)
                                    }else{
                                        setShowWarning(true)
                                    }
                                }
                            }}
                            onSubmitEditing={(event) => {
                                let inputText = event.nativeEvent.text
                                if (inputText.trim().length > 0) {
                                    if(concernList.length < 5){
                                        setConcernList(prev => [...prev, {content : inputText.trim(), id: uuidv4() }]);
                                        setNewConcern("");  
                                        setTimeout(() => 
                                            scrollViewRef.current?.scrollToEnd({ animated: false })
                                        ,10)
                                    }else{
                                        setShowWarning(true)
                                    }
                                }
                            }}
                        />
                    </ScrollView>
                </View>
                <Text style={styles.explane}>{'ex) 축구, 베이킹, 랩, 코딩...'}</Text>
                {showWarning && <Text style={styles.warning}>최대 5개까지 추가할 수 있습니다.</Text>}
            </View>
            {!fromNickname &&
                <TouchableOpacity style={[styles.selectProfile]}
                  onPress={() => {navigation.navigate('Home')}}>
                  <Text style={styles.selectText}>홈화면으로 가기</Text>
                </TouchableOpacity>
            }
        </View>
            {!fromNickname && 
                <Image source={require('../assets/img/BG_pattern2.png')} style={[styles.bottomPattern,
                    isKeyBoardVisible ? { top : '0%'} : {top : '-40%'}]}/>
            }
            <View style={[styles.bottom]}>
                {fromNickname && 
                    <TouchableOpacity
                    style={[styles.prior, styles.button]} 
                    onPress={() => {
                        navigation.navigate('Nickname')
                    }} >
                    <Text style={styles.priorMsg}>이전으로</Text>   
                </TouchableOpacity>
                }
                {fromNickname && 
                <TouchableOpacity
                    style={[styles.next, styles.button]}
                    onPress={() => {
                        console.log(newConcern.length)
                        if(newConcern.length){
                            newConcernList = newConcern.split(',')
                            newConcernList.forEach((data) => {
                                console.log(data)
                                console.log(concernList.length)
                                if(concernList.length < 5){
                                    setConcernList(prev => [...prev, {content : data.trim(), id: uuidv4() }]);
                                }    
                            })
                        }
                        console.log(concernList)
                        AsyncStorage.setItem('concern', concernList.map(concern => concern.content).toString())
                        navigation.reset({
                            index: 0,
                            routes: [{name: 'Home'}]
                        });
                    }} >
                    <Text style={styles.nextMsg}>다음으로</Text>
                </TouchableOpacity>
                }
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
        marginTop : '10%',
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
        marginBottom : '100%'
    },
    inputWrap : {
        backgroundColor : 'white',
        borderRadius : 13,
        width : '100%',
        flexDirection : 'row',
        alignItems : 'center',
        marginBottom : '2%'
    },
    concernListWrap : {
        marginLeft : 10,
        display : 'flex',
        flexDirection : 'row',
        alignItems : 'center',
    },
    input : {
        minWidth : '80%',
        color : 'black'
    },
    concern : {
        marginLeft : 5,
        marginRight : 5,
        borderRadius : 20,
        backgroundColor : '#F1B8CC',
        height : '70%',
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center'
    },
    concernText : {
        fontWeight : 'bold',
        marginLeft : 15,
        marginRight : 3,
        color : 'black'
    },
    concernImg : {
        marginLeft : 10,
        marginRight : 10,
        width : 10,
        height : 10
    },
    explane : {
        position : 'relative',
        left : '5%',
        color : '#555969',
        fontSize : 10,
        fontWeight : 'bold'
    },
    warning : {
        position : 'relative',
        left : '5%',
        color : 'red',
        fontSize : 10
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
        backgroundColor : '#E83C77',
        color : 'white'
    },
    nextMsg : {
        color : 'white'
    },
    bottomPattern : {
        position : 'relative', 
        width : '100%',
        height : '30%'
    },
    selectProfile : {
        position : 'relative',
        top : '-25%',
        alignSelf : 'center'
      },
      selectText : {
        fontSize : 16,
        color : 'rgba(64,63,63,0.68)',
        fontWeight : 'bold'
      }, 
})

export default ConcernView