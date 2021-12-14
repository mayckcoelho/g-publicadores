import React, { useRef, useState, useEffect, useCallback } from "react";

import { Button, Icon, PageHeader, Modal, message } from "antd";
import { Header } from "../../shared/styles";
import FormFilters from "./filters";
import FormRegistros from "./form";
import {
  ContentLight,
  ContentTransparent,
} from "../../shared/components/Content";
import DataTable from "../../shared/components/dataTable";
import { TableIcon } from "../../shared/styles/index";
import { TipoMascara } from "../../enums";
import api from "../../services";
import consts from "../../consts";

const { confirm } = Modal;

const Registros = () => {
  const [publicadores, setPublicadores] = useState([]);

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

  useEffect(() => {
    getPublicadores();
  }, [getPublicadores]);

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

  const reloadData = useCallback((params) => {
    dataTable.current.buscarRecurso(params);
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
      <FormFilters reload={reloadData} publicadores={publicadores} />
      <ContentLight>
        <DataTable
          ref={dataTable}
          searchOnMount={false}
          columns={columns}
          recurso="registers"
        />
      </ContentLight>
      <FormRegistros
        ref={form}
        publicadores={publicadores}
        reload={reloadData}
      />
    </ContentTransparent>
  );
};

export default Registros;
