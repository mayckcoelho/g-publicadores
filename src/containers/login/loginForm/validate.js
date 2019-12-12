import * as Yup from 'yup'

const Schema = Yup.object().shape({
    email: Yup.string().required('Informe seu email!'),
    password: Yup.string().required('Informe sua senha!')
})

export default Schema