import styled from 'styled-components'
import { Layout, Badge, Icon, Input } from 'antd'

const { Search } = Input
const { Header } = Layout

export const Image = styled('img')`
    width: 50px
`

export const TopbarLight = styled(Header)`
    background-color: #ffffff;
    -webkit-box-shadow: 0px 0px 20px 0px rgba(82,82,82,0.15);
    -moz-box-shadow: 0px 0px 20px 0px rgba(82,82,82,0.15);
    box-shadow: 0px 0px 20px 0px rgba(82,82,82,0.15);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    z-index: 1;
    width: 100%;
`

export const BadgeNotify = styled(Badge)`
    margin-right: 1.5em;
`

export const AvatarName = styled(Badge)`
    margin: 0 1em;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
`

export const IconDown = styled(Icon)`
    font-size: 12px;
`
export const IconMenuFold = styled(Icon)`
    font-size: 18px;
    margin-right: 2em
`

export const AvatarWrapper = styled('span')`
    height: 60px;
    margin-left: 1em;
    display: inline-flex;
    align-items: center;
`

export const SectionFlex = styled('section')`
    display: flex;
    align-items: center
`

export const SearchBox = styled(Search)`
    width: 500px;

    input{
        &:hover {
            border-color: rgba(252, 117, 12, 0.5) !important;
        }

        &:focus {
            border-color: rgba(252, 117, 12, 0.5) !important;
            box-shadow: 0 0 0 2px rgba(252, 117, 12, 0.1);
        }
    }
`