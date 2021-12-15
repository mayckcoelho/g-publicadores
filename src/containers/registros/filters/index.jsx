import React, { useState, useCallback, useEffect } from "react";
import api from "../../../services";
import reportsApi from "../../../services/reports";

import { Row, Col, Button, Icon, Checkbox, message } from "antd";
import { useFormik } from "formik";
import { ContentLight } from "../../../shared/components/Content";
import { DatePickerMonth } from "../../../shared/form/DatePickerSimple";
import Select from "../../../shared/form/Select";
import { TipoPrivilegio } from "../../../enums";
import FileDownload from "js-file-download";
import moment from "moment";
const date = moment().subtract(1, "month");

const initialValues = {
  minister: null,
  privilege: null,
  move: false,
  group: null,
  begin: date,
  end: date,
};

const FormFilters = ({ reload, publicadores }) => {
  const [grupos, setGrupos] = useState([]);

  const pesquisar = useCallback(
    (values) => {
      const filters = {};

      if (values.minister) filters.minister = values.minister;
      if (values.privilege) filters.privilege = values.privilege;
      if (values.move) filters.move = values.move;
      if (values.group) filters.group = values.group;
      if (values.begin) filters.begin = values.begin.format("YYYY/MM");
      if (values.end) filters.end = values.end.format("YYYY/MM");

      reload({ filters });
    },
    [reload]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: pesquisar,
  });

  const download = useCallback(async () => {
    const { values } = formik;
    const filters = {};

    if (values.minister) filters.minister = values.minister;
    if (values.privilege) filters.privilege = values.privilege;
    if (values.move) filters.move = values.move;
    if (values.group) filters.group = values.group;
    if (values.begin) filters.begin = values.begin.format("YYYY/MM");
    if (values.end) filters.end = values.end.format("YYYY/MM");

    const hide = message.loading("Processando relatório de atividades...");
    const resPublicadores = await reportsApi.post("registers", filters, {
      responseType: "arraybuffer",
    });
    if (resPublicadores) {
      hide();
      message.success("Download realizado!");
      FileDownload(resPublicadores.data, "RelatorioRegistros.xlsx");
    }
  }, [formik]);

  const limparFiltros = useCallback(() => {
    formik.resetForm();

    reload();
  }, [reload, formik]);

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

  useEffect(() => {
    pesquisar(initialValues);
  }, [pesquisar]);

  return (
    <ContentLight style={{ marginBottom: 15 }}>
      <h1 style={{ fontSize: 18 }}>Filtros</h1>
      <form onSubmit={formik.handleSubmit}>
        <Row gutter={30} style={{ marginBottom: 15 }}>
          <Col xs={24} sm={12}>
            Publicadores
            <Select
              name="minister"
              mode="multiple"
              placeholder="Selecione um ou mais publicadores"
              value={
                formik.values.minister
                  ? formik.values.minister.split(",")
                  : undefined
              }
              options={publicadores}
              onChange={(value) =>
                formik.setFieldValue("minister", value.join(","))
              }
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={6}>
            Privilégios
            <Select
              name="privilege"
              placeholder="Selecione um privilégio"
              value={
                formik.values.privilege ? formik.values.privilege : undefined
              }
              options={TipoPrivilegio}
              onChange={(value) => formik.setFieldValue("privilege", value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={6}>
            Incluir publicadores que mudaram?
            <Checkbox
              name="move"
              onChange={(e) => formik.setFieldValue("move", e.target.checked)}
              style={{ width: "100%", marginTop: 5 }}
            >
              {formik.values.move ? "Sim" : "Não"}
            </Checkbox>
          </Col>
        </Row>
        <Row gutter={30} style={{ marginBottom: 15 }}>
          <Col xs={24} sm={12}>
            Grupos
            <Select
              name="group"
              mode="multiple"
              placeholder="Selecione um ou mais grupo"
              value={
                formik.values.group ? formik.values.group.split(",") : undefined
              }
              options={grupos}
              onChange={(value) =>
                formik.setFieldValue("group", value.join(","))
              }
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={6}>
            Início
            <DatePickerMonth
              name="begin"
              placeholder="Mês/Ano Início"
              value={formik.values.begin}
              handleChange={(date) => {
                formik.setFieldValue("begin", date);
              }}
            />
          </Col>
          <Col xs={24} sm={6}>
            Fim
            <DatePickerMonth
              name="end"
              placeholder="Mês/Ano Fim"
              value={formik.values.end}
              handleChange={(date) => {
                formik.setFieldValue("end", date);
              }}
            />
          </Col>
        </Row>
        <Row gutter={30}>
          <Col
            xs={24}
            sm={24}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              type="primary"
              style={{
                marginRight: 15,
                border: "none",
                backgroundColor: "#82e3ba",
              }}
              onClick={download}
            >
              Download XLSX
              <Icon type="download" />
            </Button>
            <Button
              style={{ marginRight: 15 }}
              type="danger"
              onClick={limparFiltros}
            >
              Limpar
              <Icon type="delete" />
            </Button>
            <Button type="primary" htmlType="submit">
              Pesquisar
              <Icon type="search" />
            </Button>
          </Col>
        </Row>
      </form>
    </ContentLight>
  );
};

export default FormFilters;
