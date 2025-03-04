import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    PixelRatio,
    Dimensions
  } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ScaledSheet } from 'react-native-size-matters';

Text.defaultProps = {
    ...(Text.defaultProps || {}),
    allowFontScaling: false,
  };
  
  const {width, height} = Dimensions.get('window')
  
  const PersonalInfo = ({navigation}) => {

      return (
          <SafeAreaView>
              <ScrollView style={[ styles.BG]}>
                  <View style={[styles.top]}>
                      <View style={styles.mainMessageWrap}>
                          <Text style={[styles.mainMessage, {fontFamily : 'GmarketSansTTFBold'}]}>📢개인정보 이용 동의</Text>
                      </View>
                      <Text style={[{marginLeft : 10, width : '130%', fontSize : 14  / PixelRatio.getFontScale(), color : '#505050', fontFamily : 'GmarketSansTTFMedium'}]}>
                        서비스 이용을 위해 최소한의 개인정보를 수집합니다.{'\n'}
                        내용을 확인한 후 동의해주세요
                      </Text>
                  </View>
                  <View style={[styles.document]}>
                    <View>
                        <Text style={styles.Header}>1. 수집·이용 항목 및 목적</Text>
                        <View style={styles.content}>
                            <Text style={{color : '#505050'}}>수집하는 개인 정보의 항목: 이메일의 이름</Text>
                            <Text style={{color : '#505050'}}>목적: 회원가입 등 서비스 제공 및 분쟁 해결</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.Header}>2. 개인정보를 제공받는 자</Text>
                        <View style={styles.content}>
                            <Text style={{color : '#505050'}}>디미프렌즈 개발 및 기획팀</Text>
                            <Text style={{fontSize : 11, color : '#505050'}}>※ 심각한 분쟁 발생 시, 학교 또는 분쟁 해결을 요청한 자에게{'\n'} 정보가 제공될 수 있음</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.Header}>3. 보유 및 이용기간</Text>
                        <View style={styles.content}>
                            <Text style={{color : '#505050'}}>서비스 첫 로그인부터 사용자 졸업 시까지</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.Header}>4. 동의 거부권 및 불이익</Text>
                        <View>
                            <Text style={{color : '#505050'}}>정보주체는 개인정보 수집·이용에 동의하지 않을 권리가 있으며, 동의를 거부할 경우 서비스를 이용할 수 없습니다.</Text>
                        </View>
                    </View>
                  </View>
              </ScrollView>
              
              <View style={[styles.bottom]}>
                      <TouchableOpacity
                          style={[styles.prior, styles.button]} 
                          onPress={() => {
                              navigation.navigate('Login')
                          }} >
                          <Text style={styles.priorMsg}>이전으로</Text>   
                      </TouchableOpacity>
                      <TouchableOpacity
                          style={[styles.next, styles.button]}
                          onPress={() => {                           
                                  navigation.navigate('Guide')
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
          fontSize : 30  / PixelRatio.getFontScale(),
      },
      document : {
          display : 'flex',
          justifyContent : 'space-between',
          backgroundColor : 'white',
          width : '100%',
          height : '40%',
          borderRadius : 10,
          marginTop : '14%',
          paddingTop : '5%',
          paddingLeft : '8%',
          paddingRight : '8%',
          paddingBottom : '15%',
          marginBottom : '44%'
      },
      Header : {
        fontSize: 15 / PixelRatio.getFontScale(),
        color : '#E83C77',
        fontFamily : 'GmarketSansTTFBold'
      },
      content : {
        fontSize : 12  / PixelRatio.getFontScale(), 
        color : '#505050',
        fontFamily : 'Goldman-Regular',
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
  
  export default PersonalInfo