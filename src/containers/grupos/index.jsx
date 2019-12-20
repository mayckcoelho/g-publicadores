import React, { useState } from 'react'

import { Button, Icon, PageHeader, Modal, message } from 'antd'
import { Header } from '../../shared/styles'
import FormGrupos from './form'
import { ContentLight, ContentTransparent } from '../../shared/components/Content'
import DataTable from '../../shared/components/dataTable'
import { TableIcon } from '../../shared/styles/index'
import api from '../../services'

const { confirm } = Modal

const Grupos = ({ history }) => {
    const [reload, setReload] = useState(false);
    const [cadastroVisible, setCadastroVisible] = useState(false);
    const [idGrupo, setIdGrupo] = useState(null);

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'nome',
            filterSearch: true
        },
        {
            title: 'Responsável',
            dataIndex: 'responsavel',
            filterSearch: true
        },
        {
            title: '',
            dataIndex: '',
            render: value => <TableIcon type={'edit'} onClick={() => setIdGrupo(value._id)} />,
            fixed: 'right',
            width: '1%'
        },
        {
            title: '',
            dataIndex: '',
            render: value => <TableIcon theme="twoTone" twoToneColor="#ff0000" type={'delete'} onClick={() => excluirGrupo(value._id) } />,
            fixed: 'right',
            width: 1
        },
    ]

    function excluirGrupo(id) {
        confirm({
            title: 'Confirmar',
            content: `Deseja realmente excluir este Grupo de Campo?`,
            okText: "Sim",
            cancelText: "Não",
            onOk() {
                async function deletar() {
                    const response = await api.delete(`grupos/${id}`)

                    if (response) {
                        message.success('Grupo de Campo excluído!')
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
                <PageHeader style={{ padding: 0 }} title="Grupos" />
                <Button type="primary" onClick={() => setCadastroVisible(true)}>Novo grupo<Icon type="arrow-right" /></Button>
            </Header>
            <ContentLight>
                <DataTable 
                    reload={reload}
                    handleReload={(r) => setReload(r)}
                    columns={columns}
                    recurso="grupos"/>
            </ContentLight>
            <FormGrupos
                grupo={idGrupo}
                handleVisible={(status, reload, recurso) => {
                    setCadastroVisible(status)
                    setReload(reload)
                    setIdGrupo(recurso)
                }}
                visible={cadastroVisible}/>
        </ContentTransparent>
    )
}

export default Grupos
