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
  Radio,
} from "antd";
import { withFormik, Field, Form as FormFormik } from "formik";
import { Header } from "../../../shared/styles";
import SchemaValidate from "./validate";
import { ContentLight } from "../../../shared/components/Content";
import { InputTextArea, InputNumber } from "../../../shared/form/DefaultInput";
import { DatePickerMonth } from "../../../shared/form/DatePickerSimple";
import Select from "../../../shared/form/Select";
import moment from "moment";

const { confirm } = Modal;

const FormRegistros = ({
  resetForm,
  values,
  setFieldValue,
  setValues,
  errors,
  touched,
  handleVisible,
  visible,
  registro,
}) => {
  const [loading, setLoading] = useState(false);
  const [publicadores, setPublicadores] = useState([]);

  useEffect(() => {
    async function buscarRegistro() {
      if (registro) {
        setLoading(true);
        handleVisible(true, false, registro);

        const response = await api.get(`registers/${registro}`);

        if (response) {
          const newValues = {
            ...response.data,
            dateM: moment(response.data.date),
          };
          setValues(newValues);
        }
        setLoading(false);
      }
    }

    buscarRegistro();
  }, [registro, handleVisible, setValues]);

  async function getPublicadores() {
    const publicadores = [];
    const resPublicadores = await api.get(`ministers`);

    if (resPublicadores) {
      resPublicadores.data.data.forEach((pub) => {
        publicadores.push({ value: pub.id, label: pub.nome });
      });
      setPublicadores(publicadores);
    }
  }

  useEffect(() => {
    getPublicadores();
  }, []);

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
          title="Cadastro de Registro"
        />
      </Header>
      <ContentLight>
        <Spin spinning={loading}>
          <FormFormik layout="vertical">
            <Row gutter={30}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Publicador"
                  validateStatus={
                    errors.minister && touched.minister ? "error" : ""
                  }
                >
                  <Select
                    name="minister"
                    placeholder="Selecione um publicador"
                    value={values.minister ? values.minister : undefined}
                    options={publicadores}
                    onChange={(value) => setFieldValue("minister", value)}
                  />
                  {errors.minister && touched.minister && (
                    <span style={{ color: "red" }}>{errors.minister}</span>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Mês/Ano"
                  validateStatus={errors.dateM && touched.dateM ? "error" : ""}
                >
                  <Field
                    component={DatePickerMonth}
                    name="dateM"
                    placeholder="Mês/Ano"
                    handleChange={(date, dateM) => {
                      setFieldValue("dateM", dateM);
                      setFieldValue("date", date);
                    }}
                  />
                  {errors.dateM && touched.dateM && (
                    <span style={{ color: "red" }}>{errors.dateM}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Publicações"
                  validateStatus={
                    errors.publishers && touched.publishers ? "error" : ""
                  }
                >
                  <Field
                    component={InputNumber}
                    name="publishers"
                    placeholder="Publicações"
                    handleChange={(value) => setFieldValue("publishers", value)}
                  />
                  {errors.publishers && touched.publishers && (
                    <span style={{ color: "red" }}>{errors.publishers}</span>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Vídeos"
                  validateStatus={
                    errors.videos && touched.videos ? "error" : ""
                  }
                >
                  <Field
                    component={InputNumber}
                    name="videos"
                    placeholder="Vídeos"
                    handleChange={(value) => setFieldValue("videos", value)}
                  />
                  {errors.videos && touched.videos && (
                    <span style={{ color: "red" }}>{errors.videos}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col xs={24} sm={12}>
                <Form.Item label="Registro em">
                  <Radio.Group
                    name="timeValue"
                    value={values.timeValue}
                    onChange={(e) => {
                      setFieldValue("timeValue", e.target.value);
                    }}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="H">Horas</Radio.Button>
                    <Radio.Button value="M">Minutos</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Tempo"
                  validateStatus={errors.hours && touched.hours ? "error" : ""}
                >
                  <Field
                    component={InputNumber}
                    name="hours"
                    placeholder="Tempo"
                    handleChange={(value) => setFieldValue("hours", value)}
                  />
                  {errors.hours && touched.hours && (
                    <span style={{ color: "red" }}>{errors.hours}</span>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Revisitas"
                  validateStatus={
                    errors.revisits && touched.revisits ? "error" : ""
                  }
                >
                  <Field
                    component={InputNumber}
                    name="revisits"
                    placeholder="Revisitas"
                    handleChange={(value) => setFieldValue("revisits", value)}
                  />
                  {errors.revisits && touched.revisits && (
                    <span style={{ color: "red" }}>{errors.revisits}</span>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Estudos"
                  validateStatus={
                    errors.studies && touched.studies ? "error" : ""
                  }
                >
                  <Field
                    component={InputNumber}
                    name="studies"
                    placeholder="Estudos"
                    handleChange={(value) => setFieldValue("studies", value)}
                  />
                  {errors.studies && touched.studies && (
                    <span style={{ color: "red" }}>{errors.studies}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={30}>
              <Col xs={24} sm={24}>
                <Form.Item label="Observação">
                  <Field
                    component={InputTextArea}
                    name="obs"
                    rows={3}
                    maxLength={200}
                    placeholder="Observação"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={24} sm={12}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit">
                    Salvar Registro <Icon type="arrow-right" />
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

const HandleFormRegistros = withFormik({
  mapPropsToValues: () => ({
    dateM: moment(),
    date: moment().format(),
    publishers: "0",
    videos: "0",
    timeValue: "H",
    hours: "0",
    revisits: "0",
    studies: "0",
    obs: "",
    minister: "",
  }),
  validationSchema: SchemaValidate,

  handleSubmit: async (
    values,
    { props: { registro, handleVisible }, resetForm }
  ) => {
    confirm({
      title: "Confirmar",
      content: `Deseja realmente salvar ${
        !registro ? "este" : "a edição deste"
      } Registro?`,
      okText: "Sim",
      cancelText: "Não",
      onOk() {
        async function salvarRegistro() {
          const idRegistro = registro ? registro : "";
          const method = idRegistro ? "put" : "post";

          const response = await api[method](`registers/${idRegistro}`, values);

          if (response) {
            message.success(
              `Registro ${
                method === "post" ? "criado" : "alterado"
              } com sucesso!`
            );

            resetForm();
            handleVisible(false, true);
          }
        }

        salvarRegistro();
      },
      onCancel() {},
    });
  },
  displayName: "RegistrosForm",
})(FormRegistros);

export default withRouter(HandleFormRegistros);
