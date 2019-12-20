import React, { useState } from 'react'

import { Button, Icon, PageHeader, Modal, message } from 'antd'
import { Header, Title } from '../../shared/styles'
import FormUsuarios from './form'
import { ContentLight, ContentTransparent } from '../../shared/components/Content'
import DataTable from '../../shared/components/dataTable'
import { TableIcon } from '../../shared/styles/index'
import api from '../../services'

const { confirm } = Modal

const Usuarios = () => {
    const [reload, setReload] = useState(false);
    const [cadastroVisible, setCadastroVisible] = useState(false);
    const [idUser, setIdUser] = useState(null);

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            width: '20%',
            filterSearch: true
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            filterSearch: true
        },
        {
            title: '',
            dataIndex: '',
            render: value => <TableIcon type={'edit'} onClick={() => setIdUser(value._id)} />,
            fixed: 'right',
            width: '1%'
        }
    ]

    return (
        <ContentTransparent>    
            <Header>
                <PageHeader style={{ padding: 0 }} title="Usuários" />
                <Button type="primary" onClick={() => setCadastroVisible(true)}>Novo usuário<Icon type="arrow-right" /></Button>
            </Header>
            <ContentLight>
                <DataTable 
                    reload={reload}
                    handleReload={(r) => setReload(r)}
                    columns={columns}
                    recurso="users"/>
            </ContentLight>
            <FormUsuarios
                usuario={idUser}
                handleVisible={(status, reload, recurso) => {
                    setCadastroVisible(status)
                    setReload(reload)
                    setIdUser(recurso)
                }}
                visible={cadastroVisible}/>
        </ContentTransparent>
    )
}

export default Usuarios
