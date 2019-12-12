import React, { useState } from 'react'

import { Button, Icon, PageHeader, Modal, message, Tag } from 'antd'
import { Header } from '../../shared/styles'
import FormPublicadores from './form'
import { ContentLight, ContentTransparent } from '../../shared/components/Content'
import DataTable from '../../shared/components/dataTable'
import { TableIcon } from '../../shared/styles/index'
import { TipoMascara } from '../../enums'
import api from '../../services'

const { confirm } = Modal

const Publicadores = ({ history }) => {
    const [reload, setReload] = useState(false);
    const [cadastroVisible, setCadastroVisible] = useState(false);
    const [idPublicador, setIdPublicador] = useState(null);

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'nome',
            width: '20%',
        },
        {
            title: 'Batismo',
            dataIndex: 'data_batismo',
            render: v => `${v.split('T')[0].replace(TipoMascara.data.regex, TipoMascara.data.replace)}`
        },
        {
            title: 'Privilégio',
            dataIndex: 'privilegio',
            render: status => 
                <Tag color={{
                    'P': 'magenta',
                    'R': 'volcano',
                    'M': 'green',
                    'S': 'geekblue',
                    'A': 'purple'
                 }[status]}>{{
                    'P': 'Publicador',
                    'R': 'Pioneiro',
                    'M': 'Missionário',
                    'S': 'Servo Ministerial',
                    'A': 'Ancião' 
                 }[status]}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: status => <Tag color={status === 'A' ? 'green' : 'red'}>{status === 'A' ? 'Ativo' : 'Inativo'}</Tag>,
        },
        {
            title: '',
            dataIndex: '',
            render: value => <TableIcon type={'edit'} onClick={() => setIdPublicador(value._id)} />,
            fixed: 'right',
            width: '1%'
        },
        {
            title: '',
            dataIndex: '',
            render: value => <TableIcon theme="twoTone" twoToneColor="#ff0000" type={'delete'} onClick={() => excluirPublicador(value._id)} />,
            fixed: 'right',
            width: 1
        },
    ]

    function excluirPublicador(id) {
        confirm({
            title: 'Confirmar',
            content: `Deseja realmente excluir este Publicador?`,
            okText: "Sim",
            cancelText: "Não",
            onOk() {
                async function deletar() {
                    const response = await api.delete(`publicadores/${id}`)

                    if (response) {
                        message.success('Publicador excluído!')
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
                <PageHeader style={{ padding: 0 }} title="Publicadores" />
                <Button type="primary" onClick={() => setCadastroVisible(true)}>Novo publicador<Icon type="arrow-right" /></Button>
            </Header>
            <ContentLight>
                <DataTable 
                    reload={reload}
                    handleReload={(r) => setReload(r)}
                    columns={columns}
                    recurso="publicadores"/>
            </ContentLight>
            <FormPublicadores
                publicador={idPublicador}
                handleVisible={(status, reload, recurso) => {
                    setCadastroVisible(status)
                    setReload(reload)
                    setIdPublicador(recurso)
                }}
                visible={cadastroVisible}/>
        </ContentTransparent>
    )
}

export default Publicadores
