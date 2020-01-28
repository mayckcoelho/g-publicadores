import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import sitemap from './sitemap';
import consts from '../../../consts'

import { Layout, Menu } from 'antd'
import { MenuItem, IconSidebar } from './styles'

const { Sider } = Layout

const Sidebar = function ({ collapse, location }) {
    const resource = location.pathname.split('/')[1];
    const user_email = JSON.parse(localStorage.getItem(consts.USER_DATA)).email

    return (
        <Sider width={250} theme="light" trigger={null} collapsible collapsed={collapse}>
            <Menu
                defaultSelectedKeys={[resource.length === 0 ? 'dash' : resource]}
                mode="inline"
                theme="light"
                style={{ marginTop: '80px', borderRight: 0 }} >

                {sitemap.map((item) => {
                    return (
                        <>
                            <MenuItem key={item.resource}>
                                <Link to={item.route}>
                                    <IconSidebar type={item.icon} />
                                    <span>{item.title}</span>
                                </Link>
                            </MenuItem>
                        </>
                    )
                }
                )}
            </Menu>
        </Sider>
    )
}

const mapStateToProps = state => ({ collapse: state.topbar.collapse })

export default connect(mapStateToProps)(withRouter(Sidebar))
