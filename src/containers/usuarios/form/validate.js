import * as Yup from "yup";

const Schema = Yup.object().shape({
  id: Yup.string(),
  name: Yup.string().required("Informe o nome do usuário!"),
  email: Yup.string().required("Informe o email do usuário!"),
  password: Yup.string().when("id", {
    is: (id) => !id,
    then: Yup.string()
      .required("Informe senha do usuário!")
      .min(8, "Informe uma senha com pelo menos 8 caracteres!"),
  }),
  passwordConfirm: Yup.string().when("id", {
    is: (id) => !id,
    then: Yup.string()
      .required("Confirme a senha do usuário!")
      .oneOf([Yup.ref("password"), null], "As senhas devem ser iguais!"),
  }),
});

export default Schema;
