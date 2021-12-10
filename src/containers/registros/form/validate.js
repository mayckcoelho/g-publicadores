import * as Yup from "yup";

const Schema = Yup.object().shape({
  minister: Yup.string().required("Informe o publicador!"),
  date: Yup.mixed().required("Informe a Mês/Ano!"),
  hours: Yup.string().nullable().required("Informe o número de horas/minutos!"),
  publishers: Yup.string()
    .nullable()
    .required("Informe o número de publicações!"),
  videos: Yup.string().nullable().required("Informe o número de vídeos!"),
  revisits: Yup.string().nullable().required("Informe o número de revisitas!"),
  studies: Yup.string().nullable().required("Informe o número de estudos!"),
});

export default Schema;
