import React, { useState } from 'react'

import { Button, Icon, PageHeader, Modal, message, Tag } from 'antd'
import { Header } from '../../shared/styles'
import FormRegistros from './form'
import { ContentLight, ContentTransparent } from '../../shared/components/Content'
import DataTable from '../../shared/components/dataTable'
import { TableIcon } from '../../shared/styles/index'
import { TipoMascara } from '../../enums'
import api from '../../services'

const { confirm } = Modal

const Registros = ({ history }) => {
    const [reload, setReload] = useState(false);
    const [cadastroVisible, setCadastroVisible] = useState(false);
    const [idRegistro, setIdRegistro] = useState(null);

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
            title: 'Horas',
            dataIndex: 'horas',
            width: '20%',
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
            <ContentLight>
                <DataTable 
                    reload={reload}
                    handleReload={(r) => setReload(r)}
                    columns={columns}
                    recurso="registros"/>
            </ContentLight>
            <FormRegistros
                registro={idRegistro}
                handleVisible={(status, reload, recurso) => {
                    setCadastroVisible(status)
                    setReload(reload)
                    setIdRegistro(recurso)
                }}
                visible={cadastroVisible}/>
        </ContentTransparent>
    )
}

export default Registros
