import React, { useEffect, useState, useRef, useCallback } from 'react';
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

const Show = ({ navigation }) => {

    useBlockBackButton();

    const socket = useSocket();
    const [leftTime, setLeftTime] = useState(10);
    const [select, setSelect] = useState('');
    const alreadySelect = useRef(false);
    const opponentChoose = useRef(false);

    const setMyAnwser = useCallback(async (answer) => {
        try {
            if (!socket.connected) {
                socket.connect();
            }
            alreadySelect.current = true;
            const ansBool = answer === 'yes';
            await AsyncStorage.setItem('answer', `${ansBool}`);
            const opponentId = await AsyncStorage.getItem('opponentId')
            socket.emit('send-choose', { choose: ansBool, id: opponentId });
        } catch (error) {
            console.error('Error in setMyAnswer:', error);
        }
    }, [socket]);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }
        socket.on('receive-choose', (data) => {
            opponentChoose.current = data;
        });

        const intervalId = setInterval(() => {
            if (leftTime === 0) {
                if (!alreadySelect.current) {
                    setMyAnwser('No');
                }
                clearInterval(intervalId);
                navigation.reset({
                    index: 0,
                    routes: [{ 
                      name: 'Result', 
                      params: 
                        { result : 
                          opponentChoose.current && select === 'yes' ? true : false
                        } 
                    }],
                });
            } else {
                setLeftTime(prev => prev - 1);
            }
        }, 1000);

        return () => {
            clearInterval(intervalId);
            socket.off('connect');
            socket.off('receive-choose');
        };
    }, [leftTime, socket, setMyAnwser]);

    return (
        <SafeAreaView>
            <View style={[styles.BG]}>
                <View style={[styles.center]}>
                    <Text style={styles.notice}>이제 헤어져야 할 시간이에요</Text>
                    <Text style={styles.question}>
                        자신의 <Text style={{ color: '#E83C77' }}>정체</Text>를 공개할까요?
                    </Text>
                    <View style={[styles.BtnWrap]}>
                        <TouchableOpacity
                            style={[styles.Yes, select === 'yes' ? styles.select : {}]}
                            onPress={() => {
                                setSelect('yes');
                                setMyAnwser('yes');
                            }}
                        >
                            <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white' }}>
                                Yes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.No, select === 'no' ? styles.select : {}]}
                            onPress={() => {
                                setSelect('no');
                                setMyAnwser('no');
                            }}
                        >
                            <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>
                                No
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.count}>{leftTime}</Text>
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
    top: '27.5%',
    width: '100%',
    height: '22%',
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
  BtnWrap: {
    position: 'relative',
    width: '90%',
    height: '35%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
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
  count: {
    alignSelf: 'center',
    marginTop: '10%',
    fontSize: 20,
  },
  select: {
    borderColor: 'rgba(0,0,0,0.8)',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  bottomPattern: {
    position: 'absolute',
    top: '80%',
    width: '100%',
  },
});

export default Show;
