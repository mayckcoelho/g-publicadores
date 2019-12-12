import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../../services'

import { Row, Col, Button, Icon, Form, PageHeader, Spin, Modal, Drawer, message, Radio } from 'antd'
import { withFormik, Field, Form as FormFormik } from 'formik'
import { Header } from '../../../shared/styles'
import SchemaValidate from './validate'
import { ContentLight } from '../../../shared/components/Content'
import { InputTextArea, InputNumber } from '../../../shared/form/DefaultInput'
import { DatePickerMonth } from '../../../shared/form/DatePickerSimple'
import Select from '../../../shared/form/Select'
import moment from 'moment'

const { confirm } = Modal

const FormRegistros = ({ resetForm, values, setFieldValue, setValues, errors, touched, handleVisible, visible, registro }) => {

    const [loading, setLoading] = useState(false);
    const [publicadores, setPublicadores] = useState([])

    useEffect(() => {
        async function buscarRegistro() {
            if (registro) {
                setLoading(true)
                handleVisible(true, false, registro)

                const response = await api.get(`registros/${registro}`);

                if (response) {
                    const newValues = {
                        ...response.data,
                        mesAnoM: moment(response.data.mesAno.split('T')[0]),
                    }
                    setValues(newValues)
                }
                setLoading(false)
            }
        }

        buscarRegistro();
    }, [registro])

    async function getPublicadores() {
        const publicadores = []
        const resPublicadores = await api.get(`publicadores`)

        if (resPublicadores) {
            resPublicadores.data.map(pub => { publicadores.push({ value: pub._id, label: pub.nome }) })
            setPublicadores(publicadores)
        }
    }

    useEffect(() => {
        getPublicadores()
    }, [])

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
                <PageHeader style={{ padding: 0 }} onBack={() => closeDrawer(false)} title="Cadastro de Registro" />
            </Header>
            <ContentLight>
                <Spin spinning={loading}>
                    <FormFormik layout="vertical">

                        <Row gutter={30}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Publicador"
                                    validateStatus={(errors.publicador && touched.publicador) ? 'error' : ''}>
                                    <Select
                                        name='publicador'
                                        placeholder='Selecione um publicador'
                                        value={values.publicador ? values.publicador : undefined}
                                        options={publicadores}
                                        onChange={value => setFieldValue('publicador', value)}
                                    />
                                    {(errors.publicador && touched.publicador) && <span style={{ color: "red" }}>{errors.publicador}</span>}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Mês/Ano"
                                    validateStatus={(errors.mesAnoM && touched.mesAnoM) ? 'error' : ''}>
                                    <Field
                                        component={DatePickerMonth}
                                        name='mesAnoM'
                                        placeholder='Mês/Ano'
                                        handleChange={(date, dateM) => {
                                            setFieldValue('mesAnoM', dateM)
                                            setFieldValue('mesAno', date)
                                        }}
                                    />
                                    {(errors.mesAnoM && touched.mesAnoM) && <span style={{ color: "red" }}>{errors.mesAnoM}</span>}
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Horas"
                                    validateStatus={(errors.horas && touched.horas) ? 'error' : ''}>
                                    <Field
                                        component={InputNumber}
                                        name='horas'
                                        placeholder='Horas'
                                        handleChange={value => setFieldValue('horas', value)}
                                    />
                                    {(errors.horas && touched.horas) && <span style={{ color: "red" }}>{errors.horas}</span>}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Publicações"
                                    validateStatus={(errors.publicacoes && touched.publicacoes) ? 'error' : ''}>
                                    <Field
                                        component={InputNumber}
                                        name='publicacoes'
                                        placeholder='Publicações'
                                        handleChange={value => setFieldValue('publicacoes', value)}
                                    />
                                    {(errors.publicacoes && touched.publicacoes) && <span style={{ color: "red" }}>{errors.publicacoes}</span>}
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Vídeos"
                                    validateStatus={(errors.videos && touched.videos) ? 'error' : ''}>
                                    <Field
                                        component={InputNumber}
                                        name='videos'
                                        placeholder='Vídeos'
                                        handleChange={value => setFieldValue('videos', value)}
                                    />
                                    {(errors.videos && touched.videos) && <span style={{ color: "red" }}>{errors.videos}</span>}
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Revisitas"
                                    validateStatus={(errors.revisitas && touched.revisitas) ? 'error' : ''}>
                                    <Field
                                        component={InputNumber}
                                        name='revisitas'
                                        placeholder='Revisitas'
                                        handleChange={value => setFieldValue('revisitas', value)}
                                    />
                                    {(errors.revisitas && touched.revisitas) && <span style={{ color: "red" }}>{errors.revisitas}</span>}
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Estudos"
                                    validateStatus={(errors.estudos && touched.estudos) ? 'error' : ''}>
                                    <Field
                                        component={InputNumber}
                                        name='estudos'
                                        placeholder='Estudos'
                                        handleChange={value => setFieldValue('estudos', value)}
                                    />
                                    {(errors.estudos && touched.estudos) && <span style={{ color: "red" }}>{errors.estudos}</span>}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={30}>
                            <Col xs={24} sm={24}>
                                <Form.Item label="Observação">
                                    <Field
                                        component={InputTextArea}
                                        name='obj'
                                        rows={3}
                                        maxLength={200}
                                        placeholder='Observação'
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={24} sm={12}>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Button type="primary" htmlType="submit">Salvar Publicador <Icon type="arrow-right" /></Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </FormFormik>
                </Spin>
            </ContentLight>
        </Drawer>
    )
}

const HandleFormRegistros = withFormik({
    mapPropsToValues: () => ({
        mesAnoM: moment(),
        mesAno: '',
        publicacoes: '0',
        videos: '0',
        horas: '0',
        revisitas: '0',
        estudos: '0',
        obs: '',
        publicador: '',
    }),
    validationSchema: SchemaValidate,

    handleSubmit: async (values, { props: { registro, handleVisible }, resetForm }) => {
        confirm({
            title: 'Confirmar',
            content: `Deseja realmente salvar ${!registro ? "este" : "a edição deste"} Registro?`,
            okText: "Sim",
            cancelText: "Não",
            onOk() {
                async function salvarRegistro() {
                    const idRegistro = registro ? registro : '';
                    const method = idRegistro ? "put" : "post"

                    const response = await api[method](`registros/${idRegistro}`, values)

                    if (response) {
                        message.success(`Registro ${method === 'post' ? 'criado' : 'alterado'} com sucesso!`);

                        resetForm()
                        handleVisible(false, true)
                    }
                }

                salvarRegistro()
            }, onCancel() { }
        });
    },
    displayName: 'RegistrosForm'
})(FormRegistros)

export default withRouter(HandleFormRegistros)
