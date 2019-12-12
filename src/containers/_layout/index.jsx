import React from 'react'

import Topbar from './Topbar'
import Sidebar from './Sidebar'
import { Layout } from 'antd'

const MainWrapper = (props) => {
    return (
        <>
            <Topbar />
            <Layout>
                <Sidebar />
                <Layout style={{ padding: '0 24px 24px' }}>
                    {props.children}
                </Layout>
            </Layout>
        </>
    )
}
export default MainWrapper
