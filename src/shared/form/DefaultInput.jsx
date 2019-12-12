import React from 'react'
import { Icon, Input, InputNumber as NumberInput } from 'antd'

const { TextArea } = Input;

export const InputText = ({ colorIcon, field, icon, placeholder, size, type, ...props }) => (
    <Input
        {...field}
        {...props}
        prefix={icon &&<Icon type={icon} style={{ color: colorIcon ? colorIcon : 'rgba(0,0,0,.25)' }} />}
        placeholder={placeholder}
        type={type ? type : 'text'}
        size={size ? size : 'default'}
    />
)

export const InputPassword = ({ colorIcon, field, icon, placeholder, size, type, ...props }) => (
    <Input.Password
        {...field}
        {...props}
        prefix={icon &&<Icon type={icon} style={{ color: colorIcon ? colorIcon : 'rgba(0,0,0,.25)' }} />}
        placeholder={placeholder}
        type={type ? type : 'text'}
        size={size ? size : ''}
    />
)

export const InputTextArea = ({ field, placeholder, rows = 2, ...props }) => (
    <TextArea
        {...field}
        {...props}
        rows={rows}
        placeholder={placeholder}
    />
)

export const InputNumber = ({ field, handleChange, ...props }) => (
    <NumberInput
        {...field}
        {...props}
        min={0}
        onChange={value => handleChange(value)}
        style={{ width: '100%' }}
    />
)