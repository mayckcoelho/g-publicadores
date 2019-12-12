import { Modal } from 'antd'

const { confirm } = Modal

function showConfirm(params) {
    confirm({
        title: params.title,
        content: params.content,
        okText: 'Confirmar',
        cancelText: 'Cancelar',

        onOk: params.onOk,
        onCancel: params.onCancel
    })
}

export default showConfirm
