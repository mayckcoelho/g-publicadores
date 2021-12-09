import React, { useState, useEffect } from "react";

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

const Registros = ({ history }) => {
  const [reload, setReload] = useState(false);
  const [cadastroVisible, setCadastroVisible] = useState(false);
  const [idRegistro, setIdRegistro] = useState(null);

  const [publicadores, setPublicadores] = useState([]);
  const [grupos, setGrupos] = useState([]);

  const [filtros, setFiltros] = useState({});
  const [filtroPublicador, setFiltroPublicador] = useState(null);
  const [filtroPrivilegio, setFiltroPrivilegio] = useState(null);
  const [filtroMudou, setFiltroMudou] = useState(false);
  const [filtroGrupo, setFiltroGrupo] = useState(null);
  const [filtroDateInicio, setFiltroDateInicio] = useState(null);
  const [filtroDateFim, setFiltroDateFim] = useState(null);

  const user_email = JSON.parse(localStorage.getItem(consts.USER_DATA)).email;

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
      title: "Publicações",
      dataIndex: "publishers",
      width: "20%",
    },
    {
      title: "Vídeos",
      dataIndex: "videos",
      width: "20%",
    },
    {
      title: "Tempo",
      dataIndex: "",
      width: "20%",
      render: (v) => `${v.hours}${v.timeValue === "H" ? "h" : "m"}`,
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
      title: "Observações",
      dataIndex: "obs",
    },
    {
      title: "",
      dataIndex: "",
      render: (value) => (
        <TableIcon type={"edit"} onClick={() => setIdRegistro(value.id)} />
      ),
      fixed: "right",
      width: "1%",
      hidden: !consts.ALLOWED_EMAILS.includes(user_email),
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
      hidden: !consts.ALLOWED_EMAILS.includes(user_email),
    },
  ];

  function limparFiltros() {
    setFiltroPublicador(null);
    setFiltroPrivilegio(null);
    setFiltroMudou(false);
    setFiltroGrupo(null);
    setFiltroDateInicio(null);
    setFiltroDateFim(null);

    setFiltros({});

    setReload(true);
  }

  function pesquisar() {
    const filtros = {};

    if (filtroPublicador) filtros["publicador"] = filtroPublicador;

    if (filtroPrivilegio) filtros["privilegio"] = filtroPrivilegio;

    if (filtroMudou) filtros["mudou"] = filtroMudou;

    if (filtroGrupo) filtros["grupo"] = filtroGrupo;

    if (filtroDateInicio)
      filtros["inicio"] = filtroDateInicio.format("MM/YYYY");

    if (filtroDateFim) filtros["fim"] = filtroDateFim.format("MM/YYYY");

    setFiltros(filtros);

    setReload(true);
  }

  async function download() {
    const filtros = {};

    if (filtroPublicador) filtros["publicador"] = filtroPublicador;

    if (filtroPrivilegio) filtros["privilegio"] = filtroPrivilegio;

    if (filtroGrupo) filtros["grupo"] = filtroGrupo;

    if (filtroDateInicio)
      filtros["inicio"] = filtroDateInicio.format("MM/YYYY");

    if (filtroDateFim) filtros["fim"] = filtroDateFim.format("MM/YYYY");

    let queryParams = "";
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        queryParams += `&${key}=${value}`;
      });
    }

    const resPublicadores = await api.get(
      `registros/download?offset=0${queryParams}`,
      { responseType: "arraybuffer" }
    );
    if (resPublicadores) {
      FileDownload(resPublicadores.data, "RelatorioRegistros.xlsx");
    }
  }

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

  async function getGrupos() {
    const grupos = [];
    const resGrupos = await api.get(`groups`);

    if (resGrupos) {
      resGrupos.data.data.forEach((grp) => {
        grupos.push({ value: grp.id, label: grp.nome });
      });
      setGrupos(grupos);
    }
  }

  useEffect(() => {
    getPublicadores();
    getGrupos();
  }, []);

  function excluirRegistro(id) {
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
            setReload(true);
          }
        }
        deletar();
      },
      onCancel() {},
    });
  }

  return (
    <ContentTransparent>
      <Header>
        <PageHeader style={{ padding: 0 }} title="Registros" />
        {consts.ALLOWED_EMAILS.includes(user_email) && (
          <Button type="primary" onClick={() => setCadastroVisible(true)}>
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
              handleChange={(date, dateM) => {
                setFiltroDateInicio(dateM);
              }}
            />
          </Col>
          <Col xs={24} sm={6}>
            Fim
            <DatePickerMonth
              placeholder="Mês/Ano Fim"
              handleChange={(date, dateM) => {
                setFiltroDateFim(dateM);
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
              onClick={() => download()}
            >
              Download XLSX
              <Icon type="download" />
            </Button>
            <Button
              style={{ marginRight: 15 }}
              type="danger"
              onClick={() => limparFiltros()}
            >
              Limpar
              <Icon type="delete" />
            </Button>
            <Button type="primary" onClick={() => pesquisar()}>
              Pesquisar
              <Icon type="search" />
            </Button>
          </Col>
        </Row>
      </ContentLight>
      <ContentLight>
        <DataTable
          reload={reload}
          handleReload={(r) => setReload(r)}
          columns={columns}
          filtros={filtros}
          recurso="registers"
        />
      </ContentLight>
      <FormRegistros
        registro={idRegistro}
        handleVisible={(status, reload, recurso) => {
          setCadastroVisible(status);
          setReload(reload);
          setIdRegistro(recurso);
        }}
        visible={cadastroVisible}
      />
    </ContentTransparent>
  );
};

export default Registros;
