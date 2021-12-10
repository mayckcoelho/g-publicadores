import * as Yup from "yup";

const Schema = Yup.object().shape({
  name: Yup.string().required("Informe seu nome!"),
  birthdateM: Yup.date().required("Informe a Data de Nascimento!"),
  group: Yup.string().required("Informe um Grupo de Campo"),
});

export default Schema;
