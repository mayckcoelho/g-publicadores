import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
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
import { useFormik } from "formik";
import { Header } from "../../../shared/styles";
import SchemaValidate from "./validate";
import { ContentLight } from "../../../shared/components/Content";
import { InputTextArea, InputNumber } from "../../../shared/form/DefaultInput";
import { DatePickerMonth } from "../../../shared/form/DatePickerSimple";
import Select from "../../../shared/form/Select";
import moment from "moment";
const date = moment().subtract(1, "month");

const { confirm } = Modal;

const FormRegistros = ({ reload, publicadores }, ref) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registro, setRegistro] = useState(null);

  const getInitialValue = useCallback(() => {
    if (registro) {
      return {
        ...registro,
        date: moment(registro.date.split("T")[0]),
        minister: registro.minister.id,
      };
    } else {
      return {
        date: date,
        publishers: "0",
        videos: "0",
        timeValue: "H",
        hours: "0",
        revisits: "0",
        studies: "0",
        obs: "",
        minister: "",
      };
    }
  }, [registro]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValue(),
    validationSchema: SchemaValidate,
    onSubmit: async (values, { resetForm }) => {
      confirm({
        title: "Confirmar",
        content: `Deseja realmente salvar ${
          !registro ? "este" : "a edição deste"
        } Registro?`,
        okText: "Sim",
        cancelText: "Não",
        onOk() {
          async function salvarRegistro() {
            setLoading(() => true);
            const idRegistro = registro ? registro.id : "";
            const method = idRegistro ? "put" : "post";

            const publicador = publicadores.find(
              (pub) => pub.value === values.minister
            );
            const data = {
              date: values.date.format(),
              publishers: values.publishers,
              videos: values.videos,
              timeValue: values.timeValue,
              hours: values.hours,
              revisits: values.revisits,
              studies: values.studies,
              obs: values.obs,
              minister: {
                id: publicador.value,
                name: publicador.label,
              },
            };

            const response = await api[method](`registers/${idRegistro}`, data);

            if (response) {
              message.success(
                `Registro ${
                  method === "post" ? "criado" : "alterado"
                } com sucesso!`
              );

              resetForm();
              setVisible(false);
              setRegistro(null);
              reload();
            }
            setLoading(() => false);
          }
          salvarRegistro();
        },
        onCancel() {},
      });
    },
  });

  const openDrawer = useCallback((registro) => {
    setVisible(true);
    setRegistro(registro);
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
            setRegistro(null);
          },
          onCancel() {},
        });
      } else {
        formik.resetForm();
        setVisible(false);
        setRegistro(null);
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
      onClose={closeDrawer}
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
          <form onSubmit={formik.handleSubmit}>
            <Row gutter={30}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Publicador"
                  validateStatus={
                    formik.errors.minister && formik.touched.minister
                      ? "error"
                      : ""
                  }
                >
                  <Select
                    name="minister"
                    placeholder="Selecione um publicador"
                    value={
                      formik.values.minister
                        ? formik.values.minister
                        : undefined
                    }
                    options={publicadores}
                    onChange={(value) =>
                      formik.setFieldValue("minister", value)
                    }
                  />
                  {formik.errors.minister && formik.touched.minister && (
                    <span style={{ color: "red" }}>
                      {formik.errors.minister}
                    </span>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Mês/Ano"
                  validateStatus={
                    formik.errors.date && formik.touched.date ? "error" : ""
                  }
                >
                  <DatePickerMonth
                    name="date"
                    placeholder="Mês/Ano"
                    value={formik.values.date}
                    handleChange={(date) => {
                      formik.setFieldValue("date", date);
                    }}
                  />
                  {formik.errors.date && formik.touched.date && (
                    <span style={{ color: "red" }}>{formik.errors.date}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Publicações"
                  validateStatus={
                    formik.errors.publishers && formik.touched.publishers
                      ? "error"
                      : ""
                  }
                >
                  <InputNumber
                    name="publishers"
                    placeholder="Publicações"
                    value={formik.values.publishers}
                    handleChange={(value) =>
                      formik.setFieldValue("publishers", value)
                    }
                  />
                  {formik.errors.publishers && formik.touched.publishers && (
                    <span style={{ color: "red" }}>
                      {formik.errors.publishers}
                    </span>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Vídeos"
                  validateStatus={
                    formik.errors.videos && formik.touched.videos ? "error" : ""
                  }
                >
                  <InputNumber
                    name="videos"
                    value={formik.values.videos}
                    placeholder="Vídeos"
                    handleChange={(value) =>
                      formik.setFieldValue("videos", value)
                    }
                  />
                  {formik.errors.videos && formik.touched.videos && (
                    <span style={{ color: "red" }}>{formik.errors.videos}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col xs={24} sm={12}>
                <Form.Item label="Registro em">
                  <Radio.Group
                    name="timeValue"
                    value={formik.values.timeValue}
                    onChange={formik.handleChange}
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
                  validateStatus={
                    formik.errors.hours && formik.touched.hours ? "error" : ""
                  }
                >
                  <InputNumber
                    name="hours"
                    placeholder="Tempo"
                    value={formik.values.hours}
                    handleChange={(value) =>
                      formik.setFieldValue("hours", value)
                    }
                  />
                  {formik.errors.hours && formik.touched.hours && (
                    <span style={{ color: "red" }}>{formik.errors.hours}</span>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Revisitas"
                  validateStatus={
                    formik.errors.revisits && formik.touched.revisits
                      ? "error"
                      : ""
                  }
                >
                  <InputNumber
                    name="revisits"
                    placeholder="Revisitas"
                    value={formik.values.revisits}
                    handleChange={(value) =>
                      formik.setFieldValue("revisits", value)
                    }
                  />
                  {formik.errors.revisits && formik.touched.revisits && (
                    <span style={{ color: "red" }}>
                      {formik.errors.revisits}
                    </span>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Estudos"
                  validateStatus={
                    formik.errors.studies && formik.touched.studies
                      ? "error"
                      : ""
                  }
                >
                  <InputNumber
                    name="studies"
                    placeholder="Estudos"
                    value={formik.values.studies}
                    handleChange={(value) =>
                      formik.setFieldValue("studies", value)
                    }
                  />
                  {formik.errors.studies && formik.touched.studies && (
                    <span style={{ color: "red" }}>
                      {formik.errors.studies}
                    </span>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={30}>
              <Col xs={24} sm={24}>
                <Form.Item label="Observação">
                  <InputTextArea
                    name="obs"
                    rows={3}
                    value={formik.values.obs}
                    onChange={formik.handleChange}
                    maxLength={200}
                    placeholder="Observação"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={24} sm={12}>
                <Button type="primary" htmlType="submit">
                  Salvar Registro <Icon type="arrow-right" />
                </Button>
              </Col>
            </Row>
          </form>
        </Spin>
      </ContentLight>
    </Drawer>
  );
};

export default forwardRef(FormRegistros);
