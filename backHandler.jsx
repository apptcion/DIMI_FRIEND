import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const useBlockBackButton = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      return true; // 뒤로 가기 차단
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // 컴포넌트 언마운트 시 해제
  }, [navigation]);
};

export default useBlockBackButton;