import React from 'react'
import { DatePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/pt_BR'
import 'moment/locale/pt-br'

const { MonthPicker } = DatePicker;

export const DatePickerSimple = ({ handleChange, handleBlur, field, ...props }) => {

    function onChange(date, dateString) {
        const dt = date ? date.format() : ''

        handleChange(dt, date)
    }

    return (
        <DatePicker
            {...field}
            {...props}
            locale={locale}
            onChange={onChange}
            format="DD/MM/YYYY"
            onBlur={(e) => {
                props.form.setFieldTouched(field.name, true);
                if (handleBlur)
                    handleBlur(e.target.value)
            }}
            style={{ width: '100%' }}
        />
    )
}

export const DatePickerMonth = ({ handleChange, handleBlur, field, ...props }) => {
    function onChange(date, dateString) {
        const dt = date ? date.format() : ''

        handleChange(dt, date)
    }

    return (
        <MonthPicker
            {...field}
            {...props}
            locale={locale}
            onChange={onChange}
            format="MM/YYYY"
            onBlur={e => {
                props.form.setFieldTouched(field.name, true);
                if (handleBlur)
                    handleBlur(e.target.value)
            }}
            style={{ width: '100%' }}
        />
    )
}
