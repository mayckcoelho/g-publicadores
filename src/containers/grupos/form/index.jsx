import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useFormik } from "formik";
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

import api from "../../../services";
import { Header } from "../../../shared/styles";
import SchemaValidate from "./validate";
import { ContentLight } from "../../../shared/components/Content";
import { InputText } from "../../../shared/form/DefaultInput";

const { confirm } = Modal;

const FormGrupos = ({ reload }, ref) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [grupo, setGrupo] = useState(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: grupo || {
      name: "",
      elder: "",
    },
    validationSchema: SchemaValidate,
    onSubmit: async (values, { resetForm }) => {
      confirm({
        title: "Confirmar",
        content: `Deseja realmente salvar ${
          !grupo ? "este" : "a edição deste"
        } Grupo?`,
        okText: "Sim",
        cancelText: "Não",
        onOk() {
          async function salvarGrupo() {
            setLoading(() => true);
            const idGrupo = grupo ? grupo.id : "";
            const method = idGrupo ? "put" : "post";

            const data = {
              name: values.name,
              elder: values.elder,
            };

            const response = await api[method](`groups/${idGrupo}`, data);

            if (response) {
              message.success(
                `Grupo ${
                  method === "post" ? "criado" : "alterado"
                } com sucesso!`
              );

              resetForm();
              setVisible(false);
              setGrupo(null);
              reload();
            }
            setLoading(() => false);
          }
          salvarGrupo();
        },
        onCancel() {},
      });
    },
  });

  const openDrawer = useCallback((grupo) => {
    setVisible(true);
    setGrupo(grupo);
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
            setGrupo(null);
          },
          onCancel() {},
        });
      } else {
        formik.resetForm();
        setVisible(false);
        setGrupo(null);
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
          title="Cadastro de Grupos"
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
                  label="Responsável"
                  validateStatus={
                    formik.errors.elder && formik.touched.elder ? "error" : ""
                  }
                >
                  <InputText
                    name="elder"
                    placeholder="Responsável"
                    value={formik.values.elder}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.elder && formik.touched.elder && (
                    <span style={{ color: "red" }}>{formik.errors.elder}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={12}>
                <Button type="primary" htmlType="submit">
                  Salvar Grupo <Icon type="arrow-right" />
                </Button>
              </Col>
            </Row>
          </form>
        </Spin>
      </ContentLight>
    </Drawer>
  );
};

export default forwardRef(FormGrupos);
