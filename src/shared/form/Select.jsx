import React from 'react'
import { Select } from 'antd'

const { Option } = Select

const SelectInput = ({ placeholder, options, onChange, ...props }) => {
    
    return (
        <Select
            {...props}
            showSearch
            onChange={onChange}
            placeholder={placeholder}
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }>
            {options.map((option, index) => (
                <Option value={option.value} key={index} >{option.label}</Option>
            ))}
        </Select>
    )
}

export default SelectInput
