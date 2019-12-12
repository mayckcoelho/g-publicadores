import * as Yup from 'yup'

const Schema = Yup.object().shape({
    nome: Yup.string().required('Informe seu nome!'),
    data_nascimentoM: Yup.date().required('Informe a Data de Nascimento!'),
    id_grupo: Yup.string().required('Informe um Grupo de Campo')
})

export default Schema