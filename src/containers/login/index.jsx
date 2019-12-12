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
                <ColImage span={16}></ColImage>
                <ColLight span={8}>
                    <Image src={Logo} alt="Azymus" />
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
