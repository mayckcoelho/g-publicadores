import React, { useState, useEffect } from 'react'

import { Button, Icon, PageHeader, Modal, message, Row, Col } from 'antd'
import { Header } from '../../shared/styles'
import FormRegistros from './form'
import { ContentLight, ContentTransparent } from '../../shared/components/Content'
import DataTable from '../../shared/components/dataTable'
import { DatePickerMonth } from '../../shared/form/DatePickerSimple'
import { TableIcon } from '../../shared/styles/index'
import { TipoMascara } from '../../enums'
import { TipoPrivilegio } from '../../enums'
import api from '../../services'
import Select from '../../shared/form/Select'
import moment from 'moment'

const { confirm } = Modal

const Registros = ({ history }) => {
    const [reload, setReload] = useState(false);
    const [cadastroVisible, setCadastroVisible] = useState(false);
    const [idRegistro, setIdRegistro] = useState(null);

    const [publicadores, setPublicadores] = useState([])
    const [grupos, setGrupos] = useState([])

    const [filtros, setFiltros] = useState({})
    const [filtroPublicador, setFiltroPublicador] = useState(null)
    const [filtroPrivilegio, setFiltroPrivilegio] = useState(null)
    const [filtroGrupo, setFiltroGrupo] = useState(null)
    const [filtroDateInicio, setFiltroDateInicio] = useState(null)
    const [filtroDateFim, setFiltroDateFim] = useState(null)


    const columns = [
        {
            title: 'Publicador',
            dataIndex: 'publicador.nome',
            width: '20%',
        },
        {
            title: 'Mês/Ano',
            dataIndex: 'mesAno',
            width: '20%',
            render: v => `${v.split('T')[0].replace(TipoMascara.mesAno.regex, TipoMascara.mesAno.replace)}`
        },
        {
            title: 'Publicações',
            dataIndex: 'publicacoes',
            width: '20%',
        },
        {
            title: 'Vídeos',
            dataIndex: 'videos',
            width: '20%',
        },
        {
            title: 'Horas',
            dataIndex: 'horas',
            width: '20%',
        },
        {
            title: 'Revisitas',
            dataIndex: 'revisitas',
            width: '20%',
        },
        {
            title: 'Estudos',
            dataIndex: 'estudos',
            width: '20%',
        },
        {
            title: '',
            dataIndex: '',
            render: value => <TableIcon type={'edit'} onClick={() => setIdRegistro(value._id)} />,
            fixed: 'right',
            width: '1%'
        },
        {
            title: '',
            dataIndex: '',
            render: value => <TableIcon theme="twoTone" twoToneColor="#ff0000" type={'delete'} onClick={() => excluirRegistro(value._id)} />,
            fixed: 'right',
            width: 1
        },
    ]

    function limparFiltros() {
        setFiltroPublicador(null)
        setFiltroPrivilegio(null)
        setFiltroGrupo(null)
        setFiltroDateInicio(null)
        setFiltroDateFim(null)

        setFiltros({ })

        setReload(true)
    }

    function pesquisar() {
        const filtros = {}

        if (filtroPublicador)
            filtros['publicador'] = filtroPublicador

        if (filtroPrivilegio)
            filtros['privilegio'] = filtroPrivilegio

        if (filtroGrupo)
            filtros['grupo'] = filtroGrupo

        if (filtroDateInicio)
            filtros['inicio'] = filtroDateInicio.format('MM/YYYY')

        if (filtroDateFim)
            filtros['fim'] = filtroDateFim.format('MM/YYYY')

        setFiltros(filtros)

        setReload(true)
    }

    async function getPublicadores() {
        const publicadores = []
        const resPublicadores = await api.get(`publicadores`)

        if (resPublicadores) {
            resPublicadores.data.data.map(pub => { publicadores.push({ value: pub._id, label: pub.nome }) })

            setPublicadores(publicadores)
        }
    }

    async function getGrupos() {
        const grupos = []
        const resGrupos = await api.get(`grupos`)

        if (resGrupos) {
            resGrupos.data.data.map(grp => { grupos.push({ value: grp._id, label: grp.nome }) })
            setGrupos(grupos)
        }
    }

    useEffect(() => {
        getPublicadores()
        getGrupos()
    }, [])

    function excluirRegistro(id) {
        confirm({
            title: 'Confirmar',
            content: `Deseja realmente excluir este Registro?`,
            okText: "Sim",
            cancelText: "Não",
            onOk() {
                async function deletar() {
                    const response = await api.delete(`registros/${id}`)

                    if (response) {
                        message.success('Registro excluído!')
                        setReload(true)
                    }
                }
                deletar()
            }, onCancel() { }
        })
    }

    return (
        <ContentTransparent>
            <Header>
                <PageHeader style={{ padding: 0 }} title="Registros" />
                <Button type="primary" onClick={() => setCadastroVisible(true)}>Novo registro<Icon type="arrow-right" /></Button>
            </Header>
            <ContentLight style={{ marginBottom: 15 }}>
                <h1 style={{ fontSize: 18 }}>Filtros</h1>
                <Row gutter={30} style={{ marginBottom: 15 }}>
                    <Col xs={24} sm={12}>
                        Publicadores
                        <Select
                            mode="multiple"
                            placeholder='Selecione um ou mais publicadores'
                            value={filtroPublicador ? filtroPublicador.split(',') : undefined}
                            options={publicadores}
                            onChange={value => setFiltroPublicador(value.join(','))}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} sm={12}>
                        Privilégios
                        <Select
                            placeholder='Selecione um privilégio'
                            value={filtroPrivilegio ? filtroPrivilegio : undefined}
                            options={TipoPrivilegio}
                            onChange={value => setFiltroPrivilegio(value)}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <Row gutter={30} style={{ marginBottom: 15 }}>
                    <Col xs={24} sm={12}>
                        Grupos
                        <Select
                            mode="multiple"
                            placeholder='Selecione um ou mais grupo'
                            value={filtroGrupo ? filtroGrupo.split(',') : undefined}
                            options={grupos}
                            onChange={value => setFiltroGrupo(value.join(','))}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        Início
                        <DatePickerMonth
                            placeholder='Mês/Ano Início'
                            handleChange={(date, dateM) => {
                                setFiltroDateInicio(dateM)
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        Fim
                        <DatePickerMonth
                            placeholder='Mês/Ano Fim'
                            handleChange={(date, dateM) => {
                                setFiltroDateFim(dateM)
                            }}
                        />
                    </Col>
                </Row>
                <Row gutter={30}>
                    <Col xs={24} sm={24} style={{ display: 'flex', justifyContent: "flex-end" }}>
                        <Button style={{ marginRight: 15 }} type="danger" onClick={() => limparFiltros()}>Limpar<Icon type="delete" /></Button>
                        <Button type="primary" onClick={() => pesquisar()}>Pesquisar<Icon type="search" /></Button>
                    </Col>
                </Row>
            </ContentLight>
            <ContentLight>
                <DataTable
                    reload={reload}
                    handleReload={(r) => setReload(r)}
                    columns={columns}
                    filtros={filtros}
                    recurso="registros" />
            </ContentLight>
            <FormRegistros
                registro={idRegistro}
                handleVisible={(status, reload, recurso) => {
                    setCadastroVisible(status)
                    setReload(reload)
                    setIdRegistro(recurso)
                }}
                visible={cadastroVisible} />
        </ContentTransparent>
    )
}

export default Registros
