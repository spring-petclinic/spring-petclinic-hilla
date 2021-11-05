import { noChange, nothing } from 'lit';
import {
  Directive,
  directive,
  PartInfo,
  PartType,
  ElementPart,
  DirectiveParameters,
} from 'lit/directive.js';
import type { DatePickerDate, DatePicker } from '@vaadin/date-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

const formatDateIso8601 = (dateParts: DatePickerDate): string => {
  const { year, month, day } = dateParts;
  const date = new Date(year, month, day);

  return dateFnsFormat(date, 'yyyy-MM-dd');
};

const parseDateIso8601 = (inputValue: string): DatePickerDate => {
  const date = dateFnsParse(inputValue, 'yyyy-MM-dd', new Date());

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
};

export function configureDatePicker(datePicker: DatePicker) {
  if (datePicker) {
    datePicker.i18n = {
      ...datePicker.i18n,
      formatDate: formatDateIso8601,
      parseDate: parseDateIso8601,
    };
  }
}

class ConfigureDatePickerDirective extends Directive {
  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error(
        'Use as element expression "<element {configureDatePickerDirective()}"'
      );
    }
  }

  render() {
    return nothing;
  }

  update(part: ElementPart, params: DirectiveParameters<this>) {
    const datePicker = part.element as DatePicker;
    configureDatePicker(datePicker);
    return noChange;
  }
}

export const configureDatePickerDirective = directive(
  ConfigureDatePickerDirective
);
