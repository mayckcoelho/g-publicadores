import styled from 'styled-components'
import { Icon } from 'antd'

export const Header =  styled('header')`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 3em;

    p {
        margin-bottom: 0
    }
`

export const Title =  styled('h1')`
    font-size: 25px;
    margin-bottom: 0;
    color: #42464c;
`

export const TitleForm = styled('h1')`
    font-size: 18px;
    font-weight: 600;
    margin: 1.5em 0 1em;
`

export const TitleChildArray = styled('h2')`
    font-size: 16px;
    margin-bottom: 0;
`

export const TableIcon = styled(Icon)`
    font-size: 16px;
    color: #2a2a2a;
`

export const StepsContent = styled('div')`
    margin-top: 30px;
    border-radius: 6px;
    min-height: 200px;
    padding: 2em 2em 0 2em;
`

export const StepsAction = styled('div')`
    margin-top: 24px;
`