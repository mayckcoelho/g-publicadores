import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../../services'
import SchemaValidate from './validate'

import { Row, Col, Button, Icon, Form, PageHeader, Spin, Modal, Drawer, message } from 'antd'
import { withFormik, Field, Form as FormFormik, ErrorMessage } from 'formik'
import { Header } from '../../../shared/styles'
import { ContentLight } from '../../../shared/components/Content'
import { InputText } from '../../../shared/form/DefaultInput'

const { confirm } = Modal

const FormUsuarios = ({ setFieldValue, values, resetForm, setValues, errors, touched, handleVisible, visible, usuario }) => {

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function buscarUsuario() {
            if (usuario) {
                setLoading(true)
                handleVisible(true, false, usuario)

                const response = await api.get(`users/${usuario}`);

                if (response) {
                    setValues({ name: response.data.name, email: response.data.email })
                }
                setLoading(false)
            }
        }

        buscarUsuario();
    }, [usuario])

    function closeDrawer(checkClose = true) {
        if (checkClose) {
            confirm({
                title: 'Confirmar',
                content: `Você perderá as alterações. Deseja realmente fechar?`,
                okText: "Sim",
                cancelText: "Não",
                onOk() {
                    resetForm()
                    handleVisible(false, false)
                },
                onCancel() { }
            })
        } else {
            resetForm()
            handleVisible(false, false)
        }
    }

    return (
        <Drawer
            destroyOnClose={true}
            width="45%"
            placement='right'
            closable={false}
            onClose={() => closeDrawer()}
            visible={visible}>
            <Header>
                <PageHeader style={{ padding: 0 }} onBack={() => closeDrawer(false)} title="Cadastro de Usuários" />
            </Header>
            <ContentLight>
                <Spin spinning={loading}>
                    <FormFormik layout="vertical">
                        <Row gutter={30}>
                            <Col xs={24} sm={24}>
                                <Form.Item label="Nome"
                                    validateStatus={(errors.name && touched.name) ? 'error' : ''}>
                                    <Field
                                        component={InputText}
                                        name='name'
                                        placeholder='Nome'
                                    />
                                    {(errors.name && touched.name) && <span style={{ color: "red" }}>{errors.name}</span>}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col xs={24} sm={24}>
                                <Form.Item label="Email"
                                    validateStatus={(errors.email && touched.email) ? 'error' : ''}>
                                    <Field
                                        component={InputText}
                                        name='email'
                                        placeholder='Email'
                                    />
                                    {(errors.email && touched.email) && <span style={{ color: "red" }}>{errors.email}</span>}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={24} sm={12}>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Button type="primary" htmlType="submit">Salvar Usuário <Icon type="arrow-right" /></Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </FormFormik>
                </Spin>
            </ContentLight>
        </Drawer>
    )
}

const HandleFormUsuarios = withFormik({
    mapPropsToValues: () => ({ name: '', email: '' }),
    validationSchema: SchemaValidate,

    handleSubmit: async (values, { props: { usuario, handleVisible }, resetForm }) => {
        confirm({
            title: 'Confirmar',
            content: `Deseja realmente salvar ${!usuario ? "este" : "a edição deste"} Código de Liberação?`,
            okText: "Sim",
            cancelText: "Não",
            onOk() {
                async function salvarUsuario() {
                    const idUser = usuario ? usuario : '';
                    const method = idUser ? "put" : "post"

                    const response = await api[method](`users/${idUser}`, values)

                    if (response) {
                        message.success(`Usuário ${method === 'post' ? 'criado' : 'alterado'} com sucesso!`);

                        resetForm()
                        handleVisible(false, true)
                    }
                }

                salvarUsuario()
            }, onCancel() { }
        });
    },
    displayName: 'UsuariosForm'
})(FormUsuarios)

export default withRouter(HandleFormUsuarios)
