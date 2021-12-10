import * as Yup from "yup";

const Schema = Yup.object().shape({
  name: Yup.string().required("Informe o nome do grupo!"),
});

export default Schema;
