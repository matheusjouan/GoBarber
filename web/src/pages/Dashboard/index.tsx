import React, { useState, useCallback, useEffect, useMemo } from 'react';

import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

// DayModifiers => modificadores setados no <DayPicker />
import DayPicker, { DayModifiers } from 'react-day-picker';
// Importação dos estilos padrões da lib
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import logoImg from '../../assets/logo.svg';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFomatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  // Data selecionada
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Mês selecionado (parte superior)
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Dados retornado da API: dia e se está available
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const [appoitnments, setAppointments] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    /**
     * usado o modifiers => garente que o usuário não possa clicar se NÃO for
     * um dia "available"
     * No modifiers."passando a propriedade passada no <DayPicker />"
     */

    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  // Sempre que o mês for alterado, irá na API mostrando os dias disponíveis
  useEffect(() => {
    async function loadData() {
      const response = await api.get(
        `/providers/${user.id}/month-availability`,
        {
          // Passando dados no Query Params
          params: {
            year: currentMonth.getFullYear(),
            month: currentMonth.getMonth() + 1,
          },
        },
      );
      setMonthAvailability(response.data);
    }
    loadData();
  }, [currentMonth, user.id]);

  useEffect(() => {
    async function loadAppointmentToday() {
      const response = await api.get<Appointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      });

      const appointmentsFormatted = response.data.map(app => {
        return {
          ...app,
          hourFomatted: format(parseISO(app.date), 'HH:mm'),
        };
      });

      setAppointments(appointmentsFormatted);
    }

    loadAppointmentToday();
  }, [selectedDate]);

  // useMemo => Memorizar um valor específico, formatação, etc.
  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // É o formato que o DayPicker trabalha p/ propriedade "disabledDays"
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  // Formatação de Data - Boa Prática não utilizar dentro do return
  // Para não ficar formatando/calculando sempre que o componente atualiza
  // Fica salvo na memória
  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    const day = format(selectedDate, 'cccc', {
      locale: ptBR,
    });

    return (day.charAt(0).toUpperCase() + day.slice(1)).concat('-feira');
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appoitnments.filter(app => {
      return parseISO(app.date).getHours() < 12;
    });
  }, [appoitnments]);

  const afternoonAppointments = useMemo(() => {
    return appoitnments.filter(app => {
      return parseISO(app.date).getHours() >= 12;
    });
  }, [appoitnments]);

  const nextAppointment = useMemo(() => {
    return appoitnments.find(app => isAfter(parseISO(app.date), new Date()));
  }, [appoitnments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir:</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFomatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento nesse período</p>
            )}

            {morningAppointments.map(app => (
              <Appointment key={app.id}>
                <span>
                  <FiClock />
                  {app.hourFomatted}
                </span>

                <div>
                  <img src={app.user.avatar_url} alt={app.user.name} />
                  <strong>{app.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento nesse período</p>
            )}

            {afternoonAppointments.map(app => (
              <Appointment key={app.id}>
                <span>
                  <FiClock />
                  {app.hourFomatted}
                </span>

                <div>
                  <img src={app.user.avatar_url} alt={app.user.name} />
                  <strong>{app.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>

        <Calendar>
          <DayPicker
            // Formatação do dia da semana
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            // Não permite selecionar meses anteriores do mes atual
            fromMonth={new Date()}
            // Desabilitar algum dias da semana / "0" => dom / "6" => sab
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            // Server p/ adicionar classe "css" em um dia específico
            modifiers={{
              // classe "available" nos dias da semana (Seg a Sexta)
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            // O dia selecionado, passamos o nosso estado
            selectedDays={selectedDate}
            // O que vai acontecer quando o dia for clicado
            onDayClick={handleDateChange}
            // O que vai acontecer quando o mês for alterado
            onMonthChange={handleMonthChange}
            // Formatação dos meses
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outrubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
