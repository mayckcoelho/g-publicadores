import React from "react";
import { DatePicker } from "antd";
import locale from "antd/es/date-picker/locale/pt_BR";
import "moment/locale/pt-br";

const { MonthPicker } = DatePicker;

export const DatePickerSimple = ({
  handleChange,
  handleBlur,
  field,
  ...props
}) => {
  function onChange(date) {
    handleChange(date);
  }

  return (
    <DatePicker
      {...field}
      {...props}
      locale={locale}
      onChange={onChange}
      format="DD/MM/YYYY"
      onBlur={handleBlur}
      style={{ width: "100%" }}
    />
  );
};

export const DatePickerMonth = ({
  handleChange,
  handleBlur,
  field,
  ...props
}) => {
  function onChange(date) {
    handleChange(date);
  }

  return (
    <MonthPicker
      {...field}
      {...props}
      locale={locale}
      onChange={onChange}
      format="MM/YYYY"
      onBlur={handleBlur}
      style={{ width: "100%" }}
    />
  );
};
