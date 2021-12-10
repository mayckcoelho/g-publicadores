import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import api from "../../../services";
import SchemaValidate from "./validate";

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
import { useFormik } from "formik";
import { Header } from "../../../shared/styles";
import { ContentLight } from "../../../shared/components/Content";
import { InputText } from "../../../shared/form/DefaultInput";

const { confirm } = Modal;

const FormUsuarios = ({ reload }, ref) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: usuario || {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema: SchemaValidate,
    onSubmit: async (values, { resetForm }) => {
      confirm({
        title: "Confirmar",
        content: `Deseja realmente salvar ${
          !usuario ? "este" : "a edição deste"
        } Usuário?`,
        okText: "Sim",
        cancelText: "Não",
        onOk() {
          async function salvarUsuario() {
            setLoading(() => true);
            const idUsuario = usuario ? usuario.id : "";
            const method = idUsuario ? "put" : "post";

            const data = {
              name: values.name,
              email: values.email,
            };

            if (method === "post") {
              data.password = values.password;
            }

            const response = await api[method](`users/${idUsuario}`, data);

            if (response) {
              message.success(
                `Usuário ${
                  method === "post" ? "criado" : "alterado"
                } com sucesso!`
              );

              resetForm();
              setVisible(false);
              setUsuario(null);
              reload();
            }
            setLoading(() => false);
          }
          salvarUsuario();
        },
        onCancel() {},
      });
    },
  });

  const openDrawer = useCallback((usuario) => {
    setVisible(true);
    setUsuario(usuario);
  }, []);

  const closeDrawer = useCallback(
    (checkClose = true) => {
      if (checkClose) {
        confirm({
          title: "Confirmar",
          content: `Você perderá as alterações. Deseja realmente fechar?`,
          okText: "Sim",
          cancelText: "Não",
          onOk() {
            formik.resetForm();
            setVisible(false);
            setUsuario(null);
          },
          onCancel() {},
        });
      } else {
        formik.resetForm();
        setVisible(false);
        setUsuario(null);
      }
    },
    [formik]
  );

  useImperativeHandle(ref, () => {
    return {
      openDrawer,
      closeDrawer,
    };
  });

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
          title="Cadastro de Usuários"
        />
      </Header>
      <ContentLight>
        <Spin spinning={loading}>
          <form onSubmit={formik.handleSubmit}>
            <Row gutter={30}>
              <Col xs={24} sm={24}>
                <Form.Item
                  label="Nome"
                  validateStatus={
                    formik.errors.name && formik.touched.name ? "error" : ""
                  }
                >
                  <InputText
                    name="name"
                    placeholder="Nome"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.name && formik.touched.name && (
                    <span style={{ color: "red" }}>{formik.errors.name}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col xs={24} sm={24}>
                <Form.Item
                  label="Email"
                  validateStatus={
                    formik.errors.email && formik.touched.email ? "error" : ""
                  }
                >
                  <InputText
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <span style={{ color: "red" }}>{formik.errors.email}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {!usuario && (
              <>
                <Row gutter={30}>
                  <Col xs={24} sm={24}>
                    <Form.Item
                      label="Senha"
                      validateStatus={
                        formik.errors.password && formik.touched.password
                          ? "error"
                          : ""
                      }
                    >
                      <InputText
                        name="password"
                        placeholder="Senha"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.password && formik.touched.password && (
                        <span style={{ color: "red" }}>
                          {formik.errors.password}
                        </span>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={30}>
                  <Col xs={24} sm={24}>
                    <Form.Item
                      label="Confirmar Senha"
                      validateStatus={
                        formik.errors.passwordConfirm &&
                        formik.touched.passwordConfirm
                          ? "error"
                          : ""
                      }
                    >
                      <InputText
                        name="passwordConfirm"
                        placeholder="Senha"
                        value={formik.values.passwordConfirm}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.passwordConfirm &&
                        formik.touched.passwordConfirm && (
                          <span style={{ color: "red" }}>
                            {formik.errors.passwordConfirm}
                          </span>
                        )}
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            <Row>
              <Col xs={24} sm={12}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit">
                    Salvar Usuário <Icon type="arrow-right" />
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </form>
        </Spin>
      </ContentLight>
    </Drawer>
  );
};

export default forwardRef(FormUsuarios);
