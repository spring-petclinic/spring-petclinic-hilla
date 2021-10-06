import type { DatePickerDate, DatePickerElement } from '@vaadin/vaadin-date-picker/vaadin-date-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

const formatDateIso8601 = (dateParts: DatePickerDate): string => {
  const { year, month, day } = dateParts;
  const date = new Date(year, month, day);

  return dateFnsFormat(date, 'yyyy-MM-dd');
};

const parseDateIso8601 = (inputValue: string): DatePickerDate => {
  const date = dateFnsParse(inputValue, 'yyyy-MM-dd', new Date());

  return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
};

export function configureDatePicker(datePicker: DatePickerElement) {
  if (datePicker) {
    datePicker.i18n = {
      ...datePicker.i18n,
      formatDate: formatDateIso8601,
      parseDate: parseDateIso8601,
    };
  }
}
