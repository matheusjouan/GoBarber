import styled from 'styled-components/native';
// import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { RectButton } from 'react-native-gesture-handler';

import { FlatList } from 'react-native';
import { IProvider } from './index';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  background: #282c2e;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 24px;
  font-family: 'RobotoSlab-Regular';
  line-height: 28px;
`;

export const UserName = styled.Text`
  color: #ff9000;
  font-family: 'RobotoSlab-Medium';
`;

export const ProfileButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;

/**
 * O FlatList por padrão não existe no styled-components quando está utilizando
 * TypeScript.
 * Isso se dá, porque em uma lista na propriedade renderItem passamos cada item do array
 * no qual será renderizado cada item, porém é necessário tipar.
 *
 * Isto é feito dentro do styled components, onde criamos a interface desde dado
 * ou se ja tivermos, importamos para este arquivo e utilizamos o seguindo código
 *
 * Assim o item da lista esta tipada, e o TSX irá entender que é uma FlatList.
 */

export const ProvidersList = styled(FlatList as new () => FlatList<IProvider>)`
  padding: 32px 24px 16px;
`;

export const ProviderContainer = styled(RectButton)`
  padding: 20px;
  margin-bottom: 16px;
  background: #3e3b47;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
`;

export const ProviderAvatar = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 36px;
`;

export const ProviderInfo = styled.View`
  flex: 1;
  margin-left: 20px;
`;

export const ProviderName = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #f4ede8;
`;

export const ProviderMeta = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const ProviderMetaText = styled.Text`
  margin-left: 8px;
  color: #999591;
  font-family: 'RobotoSlab-Regular';
`;

export const ProvidersListTitle = styled.Text`
  font-size: 24px;
  margin-bottom: 24px;
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
`;

export const SignOutButton = styled.TouchableOpacity``;
