import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import api from "../../../services";
import { TipoPrivilegio } from "../../../enums";

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
import { InputText } from "../../../shared/form/DefaultInput";
import { DatePickerSimple } from "../../../shared/form/DatePickerSimple";
import Select from "../../../shared/form/Select";
import moment from "moment";
const date = moment();

const { confirm } = Modal;

const FormPublicadores = ({ reload }, ref) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [publicador, setPublicador] = useState(null);
  const [grupos, setGrupos] = useState([]);

  const getInitialValue = useCallback(() => {
    if (publicador) {
      return {
        ...publicador,
        birthdate: moment(publicador.birthdate.split("T")[0]),
        baptism: publicador.baptism
          ? moment(publicador.baptism.split("T")[0])
          : null,
        group: publicador.group.id,
      };
    } else {
      return {
        sex: "M",
        hopeGroup: "O",
        status: "A",
        name: "",
        birthdate: date,
        baptism: null,
        group: undefined,
        privilege: "P",
      };
    }
  }, [publicador]);

  const getGrupos = useCallback(async () => {
    const grupos = [];
    const resGrupos = await api.get(`groups`);

    if (resGrupos) {
      resGrupos.data.data.forEach((grp) => {
        grupos.push({ value: grp.id, label: grp.name });
      });
      setGrupos(grupos);
    }
  }, []);

  useEffect(() => {
    getGrupos();
  }, [getGrupos]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValue(),
    validationSchema: SchemaValidate,
    onSubmit: async (values, { resetForm }) => {
      confirm({
        title: "Confirmar",
        content: `Deseja realmente salvar ${
          !publicador ? "este" : "a edição deste"
        } Publicador?`,
        okText: "Sim",
        cancelText: "Não",
        onOk() {
          async function salvarPublicador() {
            setLoading(() => true);
            const idPublicador = publicador ? publicador.id : "";
            const method = idPublicador ? "put" : "post";

            const grupo = grupos.find((grp) => grp.value === values.group);
            const data = {
              sex: values.sex,
              hopeGroup: values.hopeGroup,
              status: values.status,
              name: values.name,
              birthdate: values.birthdate.format(),
              baptism: values.baptism ? values.baptism.format() : undefined,
              group: {
                id: grupo.value,
                name: grupo.label,
              },
              privilege: values.privilege,
            };

            const response = await api[method](
              `ministers/${idPublicador}`,
              data
            );

            if (response) {
              message.success(
                `Publicador ${
                  method === "post" ? "criado" : "alterado"
                } com sucesso!`
              );

              resetForm();
              setVisible(false);
              setPublicador(null);
              reload();
            }
            setLoading(() => false);
          }
          salvarPublicador();
        },
        onCancel() {},
      });
    },
  });

  const openDrawer = useCallback((publicador) => {
    setVisible(true);
    setPublicador(publicador);
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
            setPublicador(null);
          },
          onCancel() {},
        });
      } else {
        formik.resetForm();
        setVisible(false);
        setPublicador(null);
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
          title="Cadastro de Publicador"
        />
      </Header>
      <ContentLight>
        <Spin spinning={loading}>
          <form onSubmit={formik.handleSubmit}>
            <Row gutter={30}>
              <Col xs={24} sm={12}>
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
                <Form.Item label="Status">
                  <Radio.Group
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="A">Ativo</Radio.Button>
                    <Radio.Button value="R">Irregular</Radio.Button>
                    <Radio.Button value="I">Inativo</Radio.Button>
                    <Radio.Button value="M">Mudou</Radio.Button>
                    <Radio.Button value="D">Desassociado</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Data Nascimento"
                  validateStatus={
                    formik.errors.birthdate && formik.touched.birthdate
                      ? "error"
                      : ""
                  }
                >
                  <DatePickerSimple
                    name="birthdate"
                    placeholder="Nascimento"
                    value={formik.values.birthdate}
                    handleChange={(date) => {
                      formik.setFieldValue("birthdate", date);
                    }}
                  />
                  {formik.errors.birthdate && formik.touched.birthdate && (
                    <span style={{ color: "red" }}>
                      {formik.errors.birthdate}
                    </span>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Data Batismo">
                  <DatePickerSimple
                    name="baptism"
                    placeholder="Batismo"
                    value={formik.values.baptism}
                    handleChange={(date) => {
                      formik.setFieldValue("baptism", date);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={30}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Grupo de Campo"
                  validateStatus={
                    formik.errors.group && formik.touched.group ? "error" : ""
                  }
                >
                  <Select
                    name="group"
                    placeholder="Selecione um grupo"
                    value={
                      formik.values.group ? formik.values.group : undefined
                    }
                    options={grupos}
                    onChange={(value) => formik.setFieldValue("group", value)}
                  />
                  {formik.errors.group && formik.touched.group && (
                    <span style={{ color: "red" }}>{formik.errors.group}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={30}>
              <Col xs={24} sm={12}>
                <Form.Item label="Sexo">
                  <Radio.Group
                    name="sex"
                    value={formik.values.sex}
                    onChange={formik.handleChange}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="M">Masculino</Radio.Button>
                    <Radio.Button value="F">Feminino</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item label="Grupo">
                  <Radio.Group
                    name="hopeGroup"
                    value={formik.values.hopeGroup}
                    onChange={formik.handleChange}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="O">Outras Ovelhas</Radio.Button>
                    <Radio.Button value="U">Ungidos</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={30}>
              <Col xs={24} sm={24}>
                <Form.Item label="Privilégio">
                  <Select
                    name="privilege"
                    mode="multiple"
                    placeholder="Selecione um ou mais privilégios"
                    value={
                      formik.values.privilege
                        ? formik.values.privilege.split(",")
                        : undefined
                    }
                    options={TipoPrivilegio}
                    onChange={(value) =>
                      formik.setFieldValue("privilege", value.join(","))
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={24} sm={12}>
                <Button type="primary" htmlType="submit">
                  Salvar Publicador <Icon type="arrow-right" />
                </Button>
              </Col>
            </Row>
          </form>
        </Spin>
      </ContentLight>
    </Drawer>
  );
};

export default forwardRef(FormPublicadores);
