import React from 'react'
import LoginForm from './loginForm'
import { Redirect } from 'react-router-dom'
import consts from '../../consts'

import { StyleRow, ColImage, ColLight, Image, HeaderForm } from './styles'

import Logo from '../../assets/images/logo.png'

const Login = ({location}) => {
    const { from } = location.state || { from: { pathname: "/" } }

    if (localStorage.getItem(consts.USER_TOKEN)) {
        return <Redirect to={from} />
    } else {
        return (
            <StyleRow type="flex">
            <ColImage md={16} lg={16}></ColImage>
            <ColLight xs={24} md={8} lg={8}>
                <Image src={Logo} alt="G-Publicadores" />
                <HeaderForm>
                    <h1>G-Publicadores</h1>
                    <p>Acesse sua conta.</p>
                </HeaderForm>
                <LoginForm />
            </ColLight>
        </StyleRow>
        )
    }
}

export default Login
