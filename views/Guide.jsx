import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  PixelRatio
} from 'react-native';
import {useEffect, useState} from 'react'
import { ScaledSheet } from 'react-native-size-matters';
Text.defaultProps = {
    ...(Text.defaultProps || {}),
    allowFontScaling: false,
  };

const {width, height} = Dimensions.get('window')
const Guide = ({navigation}) => {

    return (
        <SafeAreaView>
            <View style={[ styles.BG]}>
                <View style={[styles.top]}>
                    <View style={styles.mainMessageWrap}>
                        <Text style={[styles.mainMessage]}>사용을 위해</Text>
                        <Text style={[styles.mainMessage]}>규칙을 읽어주세요</Text>
                    </View>
                    <Text style={[{marginLeft : 10, width : '130%', fontSize : 14  / PixelRatio.getFontScale(), color : '#505050', fontFamily : 'GmarketSansTTFMedium'}]}>위반시 이용이 제한됩니다.</Text>
                </View>
                <View style={[styles.guideLine]}>
                    <Text style={[styles.guide]}>1. 디미프렌즈 채팅은 <Text style={styles.highlight}>밤 11시부터 12시</Text>에만 열립니다.</Text>
                    <Text style={[styles.guide]}>2. 대화중 신상정보를 언급하면 안됩니다.</Text>
                    <Text style={[styles.guide]}>3. 심한 비속어를 사용하지 말아주세요.</Text>
                    <Text style={[styles.guide]}>4. 12시 이후 서로가 원한다면 신상 공개할 수 있습니다.</Text>
                    <View style={[styles.noticeWrap]}>
                        <View style={[styles.firstLine]}>
                            <View style={[styles.dot]}></View>
                            <Text style={styles.notice}>채팅 내용에 관해 신고가 들어올 경우</Text>
                        </View>
                        <Text style={[styles.secondList, styles.notice]}>대화내용이 공개될 수 있습니다.</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.bottom]}>
                    <TouchableOpacity
                        style={[styles.prior, styles.button]} 
                        onPress={() => {
                            navigation.navigate('PersonalInfo')
                        }}
                    >
                        <Text style={styles.priorMsg}>이전으로</Text>   
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.next, styles.button]}
                        onPress={() => {                     
                            navigation.navigate('Nickname')
                        }} >
                        <Text style={styles.nextMsg}>동의하기</Text>
                    </TouchableOpacity>
                </View>
        </SafeAreaView>
    )
}

const styles = ScaledSheet.create({
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
        width : '80%'
    },
    mainMessageWrap : {
        marginBottom : '3%'
    },
    mainMessage : {
        color : '#E83C77',
        fontSize : 30 / PixelRatio.getFontScale(),
        fontFamily : 'GmarketSansTTFBold'
    },
    guideLine : {
        display : 'flex',
        justifyContent : 'space-between',
        backgroundColor : 'white',
        width : '100%',
        height : '35%',
        borderRadius : 10,
        marginTop : '14%',
        paddingTop : '5%',
        paddingLeft : '8%',
        paddingRight : '8%',
        paddingBottom : '5%',
        marginBottom : '38%'
    },
    guide : {
        fontSize : 16,
        color : '#555969',
        fontWeight : 'bold'
    },
    highlight : {
        color : '#E83C77'
    },
    noticeWrap : {
        width : '80%',
        height : '18%',
        marginBottom : '5%'

    },
    firstLine : {
        height : '50%',
        width : '93%',
        justifyContent : 'space-evenly',
        alignItems :'center',
        flexDirection : 'row'
    },
    dot : {
        width : 5,
        height : 5,
        backgroundColor : '#E83C77',
        borderRadius : 10,
        position : 'relative',
        top : '3%'
    },
    notice : {
        color : '#E83C77',
        fontWeight : 'bold',
        fontSize : 14
    },
    agreeBox : {
        flexDirection : 'row',
        width : '91%',
        height : '16%',
        backgroundColor : '#F2F2F2',
        borderRadius : 6,
        paddingLeft : '3.1%',
    },
    agree : {
        position : 'relative',
        left : '1%'
    },
    agreeMsg : {
        position : 'relative',
        left : '-1%',
        color : '#555969',
        alignSelf : 'center'
    },
    warning : {
        color : 'red',
        fontSize : 11
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
    }
})

export default Guide;