import * as Yup from "yup";

const Schema = Yup.object().shape({
  minister: Yup.string().required("Informe seu nome!"),
  dateM: Yup.date().required("Informe a Mês/Ano!"),
  hours: Yup.string().required("Informe o número de Horas!"),
  publishers: Yup.string().required("Informe o número de Publicações!"),
  videos: Yup.string().required("Informe o número de Vídeos!"),
  revisits: Yup.string().required("Informe o número de Revisitas!"),
  studies: Yup.string().required("Informe o número de Estudos!"),
});

export default Schema;
