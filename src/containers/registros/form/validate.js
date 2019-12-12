import * as Yup from 'yup'

const Schema = Yup.object().shape({
    publicador: Yup.string().required('Informe seu nome!'),
    mesAnoM: Yup.date().required('Informe a Mês/Ano!'),
    horas: Yup.string().required('Informe o número de Horas!'),
    publicacoes: Yup.string().required('Informe o número de Publicações!'),
    videos: Yup.string().required('Informe o número de Vídeos!'),
    revisitas: Yup.string().required('Informe o número de Revisitas!'),
    estudos: Yup.string().required('Informe o número de Estudos!'),
})

export default Schema