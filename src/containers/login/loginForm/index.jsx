import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import SchemaValidate from "./validate";
import consts from "../../../consts";

import { Form, Icon, notification } from "antd";
import { withFormik, Field, Form as FormFormik } from "formik";
import { InputText, InputPassword } from "../../../shared/form/DefaultInput";
import { ButtonOrange, TextHoverOrange, FormItemFlex } from "../styles";
import { parseJwt } from "../../../shared/utils";

const LoginForm = ({ handleSubmit, errors, touched }) => {
  return (
    <FormFormik
      className="login-form"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSubmit();
        }
      }}
    >
      <Form.Item
        label="Email"
        validateStatus={errors.email && touched.email ? "error" : ""}
      >
        <Field
          component={InputText}
          icon="user"
          name="email"
          placeholder="Ex: seuemail@provedor.com"
          size="large"
        />
        {errors.email && touched.email && (
          <span style={{ color: "red" }}>{errors.email}</span>
        )}
      </Form.Item>
      <Form.Item
        label="Senha"
        validateStatus={errors.password && touched.password ? "error" : ""}
      >
        <Field
          component={InputPassword}
          icon="lock"
          name="password"
          placeholder="Sua senha mais segura"
          type="password"
          size="large"
        />
        {errors.password && touched.password && (
          <span style={{ color: "red" }}>{errors.password}</span>
        )}
      </Form.Item>
      <FormItemFlex>
        <TextHoverOrange underline>Esqueci minha senha</TextHoverOrange>
      </FormItemFlex>
      <ButtonOrange
        type="primary"
        htmlType="submit"
        size="large"
        className="login-form-button"
        block
      >
        Entrar na plataforma <Icon type="arrow-right" />
      </ButtonOrange>
    </FormFormik>
  );
};

const HandleLoginForm = withFormik({
  mapPropsToValues: () => ({ email: "", password: "" }),

  validationSchema: SchemaValidate,

  handleSubmit: async (values, { props }) => {
    const { history } = props;

    const response = await axios
      .post(`${process.env.REACT_APP_BASE_URL}/login`, values)
      .catch((e) => {
        notification.warning({
          placeholder: "topRight",
          top: 50,
          duration: 3,
          message: "Erro",
          description: e.response.data.message,
        });
      });

    if (response) {
      const token = response.data.token;
      const user = parseJwt(token);

      localStorage.setItem(consts.USER_TOKEN, token);
      localStorage.setItem(consts.USER_DATA, JSON.stringify(user));

      history.push("/publicadores");
    }
  },

  displayName: "LoginForm",
})(LoginForm);

export default withRouter(HandleLoginForm);
