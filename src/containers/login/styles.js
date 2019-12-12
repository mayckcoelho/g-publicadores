import styled from 'styled-components'
import { Row, Col, Button, Typography } from 'antd'
import Background from '../../assets/images/bg.jpg'

const { Text } = Typography

export const StyleRow = styled(Row)`
    height: 100%
`

export const ColImage = styled(Col)`
    background-image: url(${Background});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
`

export const ColLight = styled(Col)`
    justify-content: space-around !important;
    display: flex !important;
    flex-direction: column !important;
    padding: 3em !important;
`

export const ButtonOrange = styled(Button)`
    background-color: #2767b0;
    border-color: #2767b0;

    &:hover {
        background-color: #c1ddf4;
        border-color: #c1ddf4;
    }

    &:focus, &:active {
        background-color: #c1ddf4;
        border-color: #c1ddf4;
    }
`
export const TextHoverOrange = styled(Text)`
    &:hover {
        cursor: pointer;
        color: #2767b0
    }
`

export const FormItemFlex = styled('div')`
    display: flex;
    justify-content: space-between;
    margin-bottom: 48px;

    .ant-checkbox-wrapper:hover .ant-checkbox-inner,
    .ant-checkbox:hover .ant-checkbox-inner,
    .ant-checkbox-input:focus + .ant-checkbox-inner {
        border-color: #2767b0!important;
    }

    .ant-checkbox-checked .ant-checkbox-inner {
        background-color: #2767b0;
        border-color: #2767b0;
    }
`

export const HeaderForm = styled('div')`
    line-height: 15px;

    h1 {
        font-weight: 700
    }
`

export const Image = styled('img')`
    align-self: flex-start;
    width: 120px;
`