import React, {useEffect, useRef} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated
} from 'react-native';


Text.defaultProps = {
    ...(Text.defaultProps || {}),
    allowFontScaling: false,
  };

const Wait = ({navigation}) => {

    const rotateValue = useRef(new Animated.Value(0)).current;

    const startRotation = () => {
        rotateValue.setValue(0);
        Animated.timing(rotateValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            
        }).start(() => {
            setTimeout(startRotation, 1500)
        });
    };
    let interValID = 0;
    useEffect(() => {
        startRotation();
        let now = new Date()
        interValID = setInterval(() => {
            if(now.getHours() >= 12){
                navigation.navigate('Match')
            }else{
                now.setSeconds(now.getSeconds() + 1)
            }
        },1000)
    }, []);

    
    const rotateInterpolate = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <SafeAreaView>
             <View style={[ styles.BG]}>
                
            <TouchableOpacity style={styles.back}
                onPress={()=>{
                    navigation.navigate('Home')
                    clearInterval(interValID)
                }}    
            >
                <Image source={require('../assets/img/BackArrow.png')}/>
            </TouchableOpacity>
                <View style={[styles.message]}>
                    <Text style={[styles.line1]}>채팅이 열리지 않았어요.</Text>
                    <Text style={[styles.line2]}><Text style={[styles.highlight]}>11시에</Text> 채팅이 열립니다.</Text>
                </View>
                <View style={[styles.body]}>
                    <Animated.Image 
                        style={[styles.img, { transform: [{ rotate: rotateInterpolate }] }]}
                        source={require('../assets/img/Hourglass.png')}
                    />
                    <View style={[styles.center]}><Text style={[styles.please]}>조금 더 기다려 주세요...</Text></View>
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
        padding : '12%',
        width : '100%',
        height : '100%',
        backgroundColor : '#EFF0F6'
    },
    back: {
        position: 'absolute',
        top: '5%',
        left: '7%',
    },
    message : {
        marginTop : '30%'
    },
    line1 : {
        fontSize : 20,
        fontWeight : 'bold'                    
    },
    line2 : {
        fontSize : 20,
        fontWeight : 'bold'
    },
    please : {
        fontWeight : 'bold'
    },
    highlight : {
        color : '#E83C77'
    },
    body : {
        flexDirection : 'row',
        flexWrap : 'wrap',
        marginTop : '50%',
        justifyContent : 'center'
    },
    center : {
        marginTop : '7%',
        width : '100%',
        display : 'flex',
        justifyContent : 'center',
        flexDirection : 'row'
    },
    please : {
        width : '46%'
    },
    bottomPattern : {
        position : 'absolute',
        top : '80%',
        width : '100%',
      }
})

export default Wait;