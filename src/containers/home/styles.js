import styled from 'styled-components'

import { Icon, Layout } from 'antd'

export const IconTrigger = styled(Icon)`
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
`

export const Image = styled('img')`
    width: 120px;
`

export const MainLayout = styled(Layout)`
    min-height: 100%;
    height: 100%;
`