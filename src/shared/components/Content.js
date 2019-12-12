import styled from 'styled-components'

import { Layout } from 'antd'

const { Content } = Layout

export const ContentLight = styled(Content)`
    background: #fff;
    padding: 18px;
    margin: 0;
    min-height: auto
`

export const ContentTransparent = styled(Content)`
    padding: 24px;
    margin: 0;
    margin-top: 90px;
    min-height: auto;
`