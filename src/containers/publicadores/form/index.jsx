import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../../services'
import { TipoPrivilegio } from '../../../enums'

import { Row, Col, Button, Icon, Form, PageHeader, Spin, Modal, Drawer, message, Radio } from 'antd'
import { withFormik, Field, Form as FormFormik } from 'formik'
import { Header } from '../../../shared/styles'
import SchemaValidate from './validate'
import { ContentLight } from '../../../shared/components/Content'
import { InputText } from '../../../shared/form/DefaultInput'
import { DatePickerSimple } from '../../../shared/form/DatePickerSimple'
import Select from '../../../shared/form/Select'
import moment from 'moment'

const { confirm } = Modal

const FormPublicadores = ({ resetForm, values, setFieldValue, setValues, errors, touched, handleVisible, visible, publicador }) => {

    const [loading, setLoading] = useState(false);
    const [grupos, setGrupos] = useState([])

    useEffect(() => {
        async function buscarPublicador() {
            if (publicador) {
                setLoading(true)
                handleVisible(true, false, publicador)

                const response = await api.get(`publicadores/${publicador}`);

                if (response) {
                    const newValues = {
                        ...response.data,
                        data_nascimentoM: moment(response.data.data_nascimento.split('T')[0]),
                        data_batismoM: response.data.data_batismo ? moment(response.data.data_batismo.split('T')[0]) : null
                    }
                    setValues(newValues)
                }
                setLoading(false)
            }
        }

        buscarPublicador();
    }, [publicador])

    async function getGrupos() {
        const grupos = []
        const resGrupos = await api.get(`grupos`)

        if (resGrupos) {
            resGrupos.data.data.map(grp => { grupos.push({ value: grp._id, label: grp.nome }) })
            setGrupos(grupos)
        }
    }

    useEffect(() => {
        getGrupos()
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
                <PageHeader style={{ padding: 0 }} onBack={() => closeDrawer(false)} title="Cadastro de Publicador" />
            </Header>
            <ContentLight>
                <Spin spinning={loading}>
                    <FormFormik layout="vertical">
                        <Row gutter={30}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Nome"
                                    validateStatus={(errors.nome && touched.nome) ? 'error' : ''}>
                                    <Field
                                        component={InputText}
                                        name='nome'
                                        placeholder='Nome'
                                    />
                                    {(errors.nome && touched.nome) && <span style={{ color: "red" }}>{errors.nome}</span>}
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item label="Status">
                                    <Radio.Group
                                        name="status"
                                        value={values.status}
                                        onChange={e => {
                                            setFieldValue('status', e.target.value)
                                        }}
                                        buttonStyle="solid">
                                        <Radio.Button value="A" >Ativo</Radio.Button>
                                        <Radio.Button value="I">Invativo</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Data Nascimento"
                                    validateStatus={(errors.data_nascimentoM && touched.data_nascimentoM) ? 'error' : ''}>
                                    <Field
                                        component={DatePickerSimple}
                                        name='data_nascimentoM'
                                        placeholder='Nascimento'
                                        handleChange={(date, dateM) => {
                                            setFieldValue('data_nascimentoM', dateM)
                                            setFieldValue('data_nascimento', date)
                                        }}
                                    />
                                    {(errors.data_nascimentoM && touched.data_nascimentoM) && <span style={{ color: "red" }}>{errors.data_nascimentoM}</span>}
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Data Bastismo">
                                    <Field
                                        component={DatePickerSimple}
                                        name='data_batismoM'
                                        placeholder='Batismo'
                                        handleChange={(date, dateM) => {
                                            setFieldValue('data_batismoM', dateM)
                                            setFieldValue('data_batismo', date)
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={30}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Grupo de Campo"
                                    validateStatus={(errors.id_grupo && touched.id_grupo) ? 'error' : ''}>
                                    <Select
                                        name='id_grupo'
                                        placeholder='Selecione um grupo'
                                        value={values.id_grupo ? values.id_grupo : undefined}
                                        options={grupos}
                                        onChange={value => setFieldValue('id_grupo', value)}
                                    />
                                    {(errors.id_grupo && touched.id_grupo) && <span style={{ color: "red" }}>{errors.id_grupo}</span>}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={30}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Sexo">
                                    <Radio.Group
                                        name="sexo"
                                        value={values.sexo}
                                        onChange={e => {
                                            setFieldValue('sexo', e.target.value)
                                        }}
                                        buttonStyle="solid">
                                        <Radio.Button value="M" >Masculino</Radio.Button>
                                        <Radio.Button value="F">Feminino</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item label="Grupo">
                                    <Radio.Group
                                        name="grupo"
                                        value={values.grupo}
                                        onChange={e => {
                                            setFieldValue('grupo', e.target.value)
                                        }}
                                        buttonStyle="solid">
                                        <Radio.Button value="O" >Outras Ovelhas</Radio.Button>
                                        <Radio.Button value="U">Ungidos</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={30}>
                            <Col xs={24} sm={24}>
                                <Form.Item label="Privilégio">
                                    <Select
                                        name='privilegio'
                                        mode="multiple"
                                        placeholder='Selecione um ou mais privilégios'
                                        value={values.privilegio ? values.privilegio.split(',') : undefined}
                                        options={TipoPrivilegio}
                                        onChange={value => setFieldValue('privilegio', value.join(','))}
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

const HandleFormPublicadores = withFormik({
    mapPropsToValues: () => ({
        sexo: 'M',
        grupo: 'O',
        status: 'A',
        nome: '',
        data_nascimento: '',
        data_nascimentoM: moment(),
        data_batismo: '',
        data_batismoM: moment(),
        id_grupo: '',
        privilegio: 'P'
    }),
    validationSchema: SchemaValidate,

    handleSubmit: async (values, { props: { publicador, handleVisible }, resetForm }) => {
        //console.log(JSON.stringify(values));
        confirm({
            title: 'Confirmar',
            content: `Deseja realmente salvar ${!publicador ? "este" : "a edição deste"} Publicador?`,
            okText: "Sim",
            cancelText: "Não",
            onOk() {
                async function salvarPublicador() {
                    const idPublicador = publicador ? publicador : '';
                    const method = idPublicador ? "put" : "post"

                    const response = await api[method](`publicadores/${idPublicador}`, values)

                    if (response) {
                        message.success(`Publicador ${method === 'post' ? 'criado' : 'alterado'} com sucesso!`);

                        resetForm()
                        handleVisible(false, true)
                    }
                }

                salvarPublicador()
            }, onCancel() { }
        });
    },
    displayName: 'PublicadoresForm'
})(FormPublicadores)

export default withRouter(HandleFormPublicadores)
