import * as Yup from 'yup'

const Schema = Yup.object().shape({
    name: Yup.string().required('Informe o nome do usuário!'),
    email: Yup.string().required('Informe o email do usuário!')
})

export default Schema