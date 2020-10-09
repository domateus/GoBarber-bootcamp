import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter, isEqual } from 'date-fns';

// import User from '@modules/users/infra/typeorm/entities/User';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      return {
        day,
        available:
          appointmentsInDay.length < 10 && isAfter(compareDate, new Date()),
      };
    });

    return availability;
  }
}

export default ListMonthAvailabilityService;
