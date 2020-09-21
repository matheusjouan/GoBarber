import React, { useCallback, useMemo } from 'react';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Icon from 'react-native-vector-icons/Feather';

import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';

interface IRouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  // Navegar para uma tela e resetar histórico p/ ele não conseguir voltar
  const { reset } = useNavigation();

  const { params } = useRoute();

  // Tipagem do parâmetro passado na rota
  const routeParams = params as IRouteParams;

  const handleOkPressed = useCallback(() => {
    reset({
      // estado da rota que quero resetar o usuário, enviado para rota desejada
      routes: [{ name: 'Dashboard' }],
      // Inidice, caso existe mais de um routes
      index: 0,
    });
  }, [reset]);

  const formattedDate = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy 'as' HH:mm'h'",
      {
        locale: ptBR,
      },
    );
  }, [routeParams.date]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d371" />

      <Title>Agendamento Concluído</Title>
      <Description>{formattedDate}</Description>

      <OkButton onPress={handleOkPressed}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
