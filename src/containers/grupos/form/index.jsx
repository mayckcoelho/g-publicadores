import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import api from "../../../services";

import {
  Row,
  Col,
  Button,
  Icon,
  Form,
  PageHeader,
  Spin,
  Modal,
  Drawer,
  message,
} from "antd";
import { withFormik, Field, Form as FormFormik } from "formik";
import { Header } from "../../../shared/styles";
import SchemaValidate from "./validate";
import { ContentLight } from "../../../shared/components/Content";
import { InputText } from "../../../shared/form/DefaultInput";

const { confirm } = Modal;

const FormGrupos = ({
  resetForm,
  setValues,
  errors,
  touched,
  handleVisible,
  visible,
  grupo,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function buscarGrupo() {
      if (grupo) {
        setLoading(true);
        handleVisible(true, false, grupo);

        const response = await api.get(`groups/${grupo}`);

        if (response) {
          setValues({
            name: response.data.name,
            elder: response.data.elder,
          });
        }
        setLoading(false);
      }
    }

    buscarGrupo();
  }, [grupo, handleVisible, setValues]);

  function closeDrawer(checkClose = true) {
    if (checkClose) {
      confirm({
        title: "Confirmar",
        content: `Você perderá as alterações. Deseja realmente fechar?`,
        okText: "Sim",
        cancelText: "Não",
        onOk() {
          resetForm();
          handleVisible(false, false);
        },
        onCancel() {},
      });
    } else {
      resetForm();
      handleVisible(false, false);
    }
  }

  return (
    <Drawer
      destroyOnClose={true}
      width="45%"
      placement="right"
      closable={false}
      onClose={() => closeDrawer()}
      visible={visible}
    >
      <Header>
        <PageHeader
          style={{ padding: 0 }}
          onBack={() => closeDrawer(false)}
          title="Cadastro de Grupos"
        />
      </Header>
      <ContentLight>
        <Spin spinning={loading}>
          <FormFormik layout="vertical">
            <Row gutter={30}>
              <Col xs={24} sm={24}>
                <Form.Item
                  label="Nome"
                  validateStatus={errors.name && touched.name ? "error" : ""}
                >
                  <Field component={InputText} name="name" placeholder="Nome" />
                  {errors.name && touched.name && (
                    <span style={{ color: "red" }}>{errors.name}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col xs={24} sm={24}>
                <Form.Item
                  label="Responsável"
                  validateStatus={errors.elder && touched.elder ? "error" : ""}
                >
                  <Field
                    component={InputText}
                    name="elder"
                    placeholder="Responsável"
                  />
                  {errors.elder && touched.elder && (
                    <span style={{ color: "red" }}>{errors.elder}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={24} sm={12}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit">
                    Salvar Grupo <Icon type="arrow-right" />
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </FormFormik>
        </Spin>
      </ContentLight>
    </Drawer>
  );
};

const HandleFormGrupos = withFormik({
  mapPropsToValues: () => ({ name: "", elder: "" }),
  validationSchema: SchemaValidate,

  handleSubmit: async (
    values,
    { props: { grupo, handleVisible }, resetForm }
  ) => {
    confirm({
      title: "Confirmar",
      content: `Deseja realmente salvar ${
        !grupo ? "este" : "a edição deste"
      } Grupo?`,
      okText: "Sim",
      cancelText: "Não",
      onOk() {
        async function salvarGrupo() {
          const idGrupo = grupo ? grupo : "";
          const method = idGrupo ? "put" : "post";

          const response = await api[method](`grupos/${idGrupo}`, values);

          if (response) {
            message.success(
              `Grupo ${method === "post" ? "criado" : "alterado"} com sucesso!`
            );

            resetForm();
            handleVisible(false, true);
          }
        }
        salvarGrupo();
      },
      onCancel() {},
    });
  },
  displayName: "GruposForm",
})(FormGrupos);

export default withRouter(HandleFormGrupos);
