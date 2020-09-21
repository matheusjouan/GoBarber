import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { StatusBar, Platform, Alert } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { format } from 'date-fns';

import { useAuth } from '../../context/AuthContext';

import api from '../../services/api';

import {
  Container,
  Header,
  Content,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersList,
  ProvidersListContainer,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  TitleSchedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

interface IRouteParams {
  providerId: string;
}

export interface IProvider {
  id: string;
  name: string;
  avatar_url: string;
}

interface IAvailabilityDay {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  // Recebendo os parâmetro da rota e tipando
  const { providerId } = route.params as IRouteParams;

  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();

  const [providers, setProviders] = useState<IProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);

  const [availabilityDay, setAvailabilityDay] = useState<IAvailabilityDay[]>(
    [],
  );

  const morningAvailability = useMemo(() => {
    return availabilityDay
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availabilityDay]);

  const afternoonAvailability = useMemo(() => {
    return availabilityDay
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availabilityDay]);

  const navigateToBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((id: string) => {
    setSelectedProvider(id);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(!showDatePicker);
  }, [showDatePicker]);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      // Somente no android, para ocorrer a troca de estado de forma correta
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }

      if (date) {
        setSelectedDate(date);
      }
    },
    [],
  );

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      // Coloca a hora no formato de Data, passando horário
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (err) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente',
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  useEffect(() => {
    async function loadProvider() {
      const response = await api.get('/providers');

      setProviders(response.data);
    }
    loadProvider();
  }, []);

  useEffect(() => {
    async function loadDisponibilityDate() {
      const response = await api.get(
        `/providers/${selectedProvider}/day-availability`,
        {
          params: {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
            day: selectedDate.getDate(),
          },
        },
      );

      setAvailabilityDay(response.data);
    }
    loadDisponibilityDate();
  }, [selectedDate, selectedProvider]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#28262e" />
      <Container>
        <Header>
          <BackButton onPress={navigateToBack}>
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>

          <HeaderTitle>Cabeleireiros</HeaderTitle>

          <UserAvatar source={{ uri: user.avatar_url }} />
        </Header>

        <Content>
          <ProvidersListContainer>
            <ProvidersList
              data={providers}
              // Scroll horizonal
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({ item: provider }) => (
                <ProviderContainer
                  selected={provider.id === selectedProvider}
                  onPress={() => handleSelectProvider(provider.id)}
                >
                  <ProviderAvatar source={{ uri: provider.avatar_url }} />
                  <ProviderName selected={provider.id === selectedProvider}>
                    {provider.name}
                  </ProviderName>
                </ProviderContainer>
              )}
            />
          </ProvidersListContainer>

          <Calendar>
            <Title>Escolha a Data</Title>

            <OpenDatePickerButton onPress={handleToggleDatePicker}>
              <OpenDatePickerButtonText>
                Selecionar outra data
              </OpenDatePickerButtonText>
            </OpenDatePickerButton>

            {showDatePicker && (
              <DateTimePicker
                // Somente p/ selecionar a data
                mode="date"
                // Utilizar modal p/ calendário (Android)
                display="calendar"
                // Função a ser executada qnd seleciona uma nova data
                onChange={handleDateChanged}
                value={selectedDate}
              />
            )}
          </Calendar>

          <Schedule>
            <TitleSchedule>Escolha o horário</TitleSchedule>

            <Section>
              <SectionTitle>Manhã</SectionTitle>
              <SectionContent>
                {morningAvailability.map(
                  ({ formattedHour, hour, available }) => (
                    <Hour
                      enabled={available}
                      selected={selectedHour === hour}
                      available={available}
                      key={formattedHour}
                      onPress={() => handleSelectHour(hour)}
                    >
                      <HourText selected={selectedHour === hour}>
                        {formattedHour}
                      </HourText>
                    </Hour>
                  ),
                )}
              </SectionContent>

              <SectionTitle>Tarde</SectionTitle>
              <SectionContent>
                {afternoonAvailability.map(
                  ({ formattedHour, hour, available }) => (
                    <Hour
                      enabled={available}
                      selected={selectedHour === hour}
                      available={available}
                      key={formattedHour}
                      onPress={() => handleSelectHour(hour)}
                    >
                      <HourText selected={selectedHour === hour}>
                        {formattedHour}
                      </HourText>
                    </Hour>
                  ),
                )}
              </SectionContent>
            </Section>
          </Schedule>

          <CreateAppointmentButton onPress={handleCreateAppointment}>
            <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
          </CreateAppointmentButton>
        </Content>
      </Container>
    </>
  );
};

export default CreateAppointment;
