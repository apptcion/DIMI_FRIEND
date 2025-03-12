import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

Text.defaultProps = {
  ...(Text.defaultProps || {}),
  allowFontScaling: false,
};



const Filter = ({ department, setActionFunc, wholeList, setActionFunc2 }) => {
    return (
        <TouchableOpacity
            style={[
                styles.filter,
                { backgroundColor: wholeList[department] ? '#E78DAC' : 'white' }
            ]}
            onPress={() => {
              setActionFunc2(true)
                setActionFunc(prevState => ({
                    ...prevState,
                    [department]: !prevState[department]  // 값 토글
                }));
            }}>
            <Text style={{color:'black'}}>{department}</Text>
        </TouchableOpacity>
    );
};

const FilterView = ({navigation}) => {

    const [filterList, setFilterList] = useState({
        'E-Bussiness' : false,
        'Digital Contents' : false,
        'Web Programming' : false,
        'Hacking Defense' : false
    })
    const [changed, setChanged] = useState(false)

    const getFilterList = async () => {
        const legacy = await AsyncStorage.getItem('filter')
        if(legacy != null){
            setFilterList(JSON.parse(legacy))
        }
    }

    useEffect(() => {
       getFilterList() 
    },[])

    return (
        <SafeAreaView>            
            <View style={[ styles.BG]}>
                <Image style={[styles.BG_pattern]} source={require('../assets/img/BG_pattern.png')}></Image>
                <View style={[styles.TitleWrap]}>
                  <View style={[styles.Title]}><Text style={[styles.TitleMsg]}>DIMI</Text></View>
                  <View style={[styles.Title]}><Text style={[styles.TitleMsg]}>FRIEND</Text></View>
                  <View style={[styles.Underbar]}></View>
                </View>
                <View style={[styles.filterWrap]}>
                    <Text style={styles.h3}>채팅하고 싶은 학과를 고르세요! (복수 선택 가능)</Text>
                    <Filter department={'E-Bussiness'} setActionFunc={setFilterList} wholeList={filterList} setActionFunc2={setChanged}/>
                    <Filter department={'Digital Contents'} setActionFunc={setFilterList} wholeList={filterList} setActionFunc2={setChanged} />
                    <Filter department={'Web Programming'} setActionFunc={setFilterList} wholeList={filterList} setActionFunc2={setChanged} />
                    <Filter department={'Hacking Defense'} setActionFunc={setFilterList} wholeList={filterList} setActionFunc2={setChanged} />
                </View>
                <TouchableOpacity
                  style={[styles.goHome]}
                  onPress={async () => {
                        if(changed){
                          AsyncStorage.setItem('filter', JSON.stringify(filterList))
                        }
                        navigation.navigate('Home')
                  }}
                >
                  <Text style={styles.goHomeTxt}>홈화면으로 가기</Text>
                </TouchableOpacity>
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
      padding : '7%',
      width : '100%',
      height : '100%',
      backgroundColor : '#EFF0F6'
  },
  BG_pattern : {
    position : 'absolute',
    top : 0,
    right : 0
  },
  TitleWrap : {
    width : '100%',
    height : '12%',
    minHeight : 90,
    marginTop : '21%',
  },
  Title : {
    display : 'flex',
    justifyContent : 'center',
    flexDirection : 'row',
    height : '38%'
  },
  TitleMsg : {
    color : '#E83C77',
    fontSize : 30,
    fontWeight : 'bold',
    textShadowColor : 'rgba(0,0,0,0.1)',
    textShadowOffset : {height : 4, width : 0},
    textShadowRadius : 7
  },
  Underbar : {
    width : '40%',
    height : '7%',
    backgroundColor : '#E83C77',
    shadowColor : 'rgba(0,0,0,0.1)',
    shadowOffset : {height : 5, width : 0},
    shadowRadius : 1,
    ...Platform.select({
      android : {
        elevation : 10,
      }
    }),
    marginTop : '2%',
    marginLeft : '30%'
  },
  filterWrap : {
    display : 'flex',
    height : '40%',
    justifyContent : 'space-evenly',
    alignItems : 'center'
  },
  h3 : {
    fontSize : 12,
    color : '#BABABA',
    width : '75%'
  },
  filter : {
    backgroundColor : 'white',
    width : '80%',
    height : '17%',
    paddingLeft : 30,
    borderRadius : 16,
    justifyContent : 'center'
  },
  goHome : {
    marginTop : '1%',
    alignSelf : 'center'
  },
  goHomeTxt : {
    fontSize : 18,
    color : '#787779',
    fontWeight : 'bold'
  },
  bottomPattern : {
    position : 'absolute',
    top : '73%',
    width : '100%',
    height : '30%'
  }
})

export default FilterView