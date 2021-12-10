import * as Yup from "yup";

const Schema = Yup.object().shape({
  name: Yup.string().required("Informe o nome do publicador!"),
  birthdate: Yup.mixed().required(
    "Informe a data de nascimento do publicador!"
  ),
  group: Yup.string().required("Informe um grupo de campo do publicador!"),
});

export default Schema;
