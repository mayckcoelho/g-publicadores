import React, { useRef, useState, useEffect, useCallback } from "react";

import {
  Button,
  Icon,
  PageHeader,
  Modal,
  message,
  Row,
  Col,
  Checkbox,
} from "antd";
import { Header } from "../../shared/styles";
import FormRegistros from "./form";
import {
  ContentLight,
  ContentTransparent,
} from "../../shared/components/Content";
import DataTable from "../../shared/components/dataTable";
import { DatePickerMonth } from "../../shared/form/DatePickerSimple";
import { TableIcon } from "../../shared/styles/index";
import { TipoMascara } from "../../enums";
import { TipoPrivilegio } from "../../enums";
import api from "../../services";
import Select from "../../shared/form/Select";
import FileDownload from "js-file-download";
import consts from "../../consts";

const { confirm } = Modal;

const Registros = () => {
  const [publicadores, setPublicadores] = useState([]);
  const [grupos, setGrupos] = useState([]);

  const [filtros, setFiltros] = useState({});
  const [filtroPublicador, setFiltroPublicador] = useState(null);
  const [filtroPrivilegio, setFiltroPrivilegio] = useState(null);
  const [filtroMudou, setFiltroMudou] = useState(false);
  const [filtroGrupo, setFiltroGrupo] = useState(null);
  const [filtroDateInicio, setFiltroDateInicio] = useState(null);
  const [filtroDateFim, setFiltroDateFim] = useState(null);

  const dataTable = useRef(null);
  const form = useRef(null);

  const user_access = JSON.parse(localStorage.getItem(consts.USER_DATA)).access;

  const columns = [
    {
      title: "Publicador",
      dataIndex: "minister.name",
      width: "20%",
    },
    {
      title: "Mês/Ano",
      dataIndex: "date",
      width: "20%",
      render: (v) =>
        `${v
          .split("T")[0]
          .replace(TipoMascara.mesAno.regex, TipoMascara.mesAno.replace)}`,
    },
    {
      title: "Revisitas",
      dataIndex: "revisits",
      width: "20%",
    },
    {
      title: "Estudos",
      dataIndex: "studies",
      width: "20%",
    },
    {
      title: "Tempo",
      dataIndex: "",
      width: "20%",
      render: (v) => `${v.hours}${v.timeValue === "H" ? "h" : "m"}`,
    },
    {
      title: "Observações",
      dataIndex: "obs",
    },
    {
      title: "",
      dataIndex: "",
      render: (value) => (
        <TableIcon
          type={"edit"}
          onClick={() => form.current.openDrawer(value)}
        />
      ),
      fixed: "right",
      width: "1%",
      hidden: user_access === "C",
    },
    {
      title: "",
      dataIndex: "",
      render: (value) => (
        <TableIcon
          theme="twoTone"
          twoToneColor="#ff0000"
          type={"delete"}
          onClick={() => excluirRegistro(value.id)}
        />
      ),
      fixed: "right",
      width: 1,
      hidden: user_access === "C",
    },
  ];

  const limparFiltros = useCallback(() => {
    setFiltroPublicador(null);
    setFiltroPrivilegio(null);
    setFiltroMudou(false);
    setFiltroGrupo(null);
    setFiltroDateInicio(null);
    setFiltroDateFim(null);

    setFiltros({});

    dataTable.current.buscarRecurso();
  }, []);

  const pesquisar = useCallback(() => {
    const filtros = {};

    if (filtroPublicador) filtros["minister"] = filtroPublicador;

    if (filtroPrivilegio) filtros["privilege"] = filtroPrivilegio;

    if (filtroMudou) filtros["move"] = filtroMudou;

    if (filtroGrupo) filtros["group"] = filtroGrupo;

    if (filtroDateInicio) filtros["begin"] = filtroDateInicio.format("MM/YYYY");

    if (filtroDateFim) filtros["end"] = filtroDateFim.format("MM/YYYY");

    setFiltros(filtros);

    dataTable.current.buscarRecurso();
  }, [
    filtroPublicador,
    filtroPrivilegio,
    filtroMudou,
    filtroGrupo,
    filtroDateInicio,
    filtroDateFim,
  ]);

  const download = useCallback(async () => {
    const filtros = {};

    if (filtroPublicador) filtros["minister"] = filtroPublicador;

    if (filtroPrivilegio) filtros["privilege"] = filtroPrivilegio;

    if (filtroGrupo) filtros["group"] = filtroGrupo;

    if (filtroDateInicio) filtros["begin"] = filtroDateInicio.format("MM/YYYY");

    if (filtroDateFim) filtros["end"] = filtroDateFim.format("MM/YYYY");

    let queryParams = "";
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        queryParams += `&${key}=${value}`;
      });
    }

    const resPublicadores = await api.get(
      `registers/download?offset=0${queryParams}`,
      { responseType: "arraybuffer" }
    );
    if (resPublicadores) {
      FileDownload(resPublicadores.data, "RelatorioRegistros.xlsx");
    }
  }, [
    filtroPublicador,
    filtroPrivilegio,
    filtroGrupo,
    filtroDateInicio,
    filtroDateFim,
  ]);

  const getPublicadores = useCallback(async () => {
    const publicadores = [];
    const resPublicadores = await api.get(`ministers`);

    if (resPublicadores) {
      resPublicadores.data.data.forEach((pub) => {
        publicadores.push({ value: pub.id, label: pub.name });
      });

      setPublicadores(publicadores);
    }
  }, []);

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
    getPublicadores();
    getGrupos();
  }, [getPublicadores, getGrupos]);

  const excluirRegistro = useCallback((id) => {
    confirm({
      title: "Confirmar",
      content: `Deseja realmente excluir este Registro?`,
      okText: "Sim",
      cancelText: "Não",
      onOk() {
        async function deletar() {
          const response = await api.delete(`registers/${id}`);

          if (response) {
            message.success("Registro excluído!");
            dataTable.current.buscarRecurso();
          }
        }
        deletar();
      },
      onCancel() {},
    });
  }, []);

  return (
    <ContentTransparent>
      <Header>
        <PageHeader style={{ padding: 0 }} title="Registros" />
        {user_access === "A" && (
          <Button type="primary" onClick={() => form.current.openDrawer(null)}>
            Novo registro
            <Icon type="arrow-right" />
          </Button>
        )}
      </Header>
      <ContentLight style={{ marginBottom: 15 }}>
        <h1 style={{ fontSize: 18 }}>Filtros</h1>
        <Row gutter={30} style={{ marginBottom: 15 }}>
          <Col xs={24} sm={12}>
            Publicadores
            <Select
              mode="multiple"
              placeholder="Selecione um ou mais publicadores"
              value={filtroPublicador ? filtroPublicador.split(",") : undefined}
              options={publicadores}
              onChange={(value) => setFiltroPublicador(value.join(","))}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={6}>
            Privilégios
            <Select
              placeholder="Selecione um privilégio"
              value={filtroPrivilegio ? filtroPrivilegio : undefined}
              options={TipoPrivilegio}
              onChange={(value) => setFiltroPrivilegio(value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={6}>
            Incluir publicadores que mudaram?
            <Checkbox
              onChange={(e) => setFiltroMudou(e.target.checked)}
              style={{ width: "100%", marginTop: 5 }}
            >
              {filtroMudou ? "Sim" : "Não"}
            </Checkbox>
          </Col>
        </Row>
        <Row gutter={30} style={{ marginBottom: 15 }}>
          <Col xs={24} sm={12}>
            Grupos
            <Select
              mode="multiple"
              placeholder="Selecione um ou mais grupo"
              value={filtroGrupo ? filtroGrupo.split(",") : undefined}
              options={grupos}
              onChange={(value) => setFiltroGrupo(value.join(","))}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={6}>
            Início
            <DatePickerMonth
              placeholder="Mês/Ano Início"
              handleChange={(date) => {
                setFiltroDateInicio(date.format());
              }}
            />
          </Col>
          <Col xs={24} sm={6}>
            Fim
            <DatePickerMonth
              placeholder="Mês/Ano Fim"
              handleChange={(date) => {
                setFiltroDateFim(date.format());
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
            <Button type="primary" onClick={pesquisar}>
              Pesquisar
              <Icon type="search" />
            </Button>
          </Col>
        </Row>
      </ContentLight>
      <ContentLight>
        <DataTable
          ref={dataTable}
          columns={columns}
          filtros={filtros}
          recurso="registers"
        />
      </ContentLight>
      <FormRegistros
        ref={form}
        publicadores={publicadores}
        reload={() => dataTable.current.buscarRecurso()}
      />
    </ContentTransparent>
  );
};

export default Registros;
