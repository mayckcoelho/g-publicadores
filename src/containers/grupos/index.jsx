import React, { useCallback } from "react";

import { Button, Icon, PageHeader, Modal, message } from "antd";
import { Header } from "../../shared/styles";
import FormGrupos from "./form";
import {
  ContentLight,
  ContentTransparent,
} from "../../shared/components/Content";
import DataTable from "../../shared/components/dataTable";
import { TableIcon } from "../../shared/styles/index";
import api from "../../services";
import consts from "../../consts";
import { useRef } from "react";

const { confirm } = Modal;

const Grupos = () => {
  const dataTable = useRef(null);
  const form = useRef(null);

  const user_access = JSON.parse(localStorage.getItem(consts.USER_DATA)).access;

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      filterSearch: true,
    },
    {
      title: "Responsável",
      dataIndex: "elder",
      filterSearch: true,
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
          type="delete"
          onClick={() => excluirGrupo(value.id)}
        />
      ),
      fixed: "right",
      width: 1,
      hidden: user_access === "C",
    },
  ];

  const excluirGrupo = useCallback((id) => {
    confirm({
      title: "Confirmar",
      content: `Deseja realmente excluir este Grupo de Campo?`,
      okText: "Sim",
      cancelText: "Não",
      onOk() {
        async function deletar() {
          const response = await api.delete(`groups/${id}`);

          if (response) {
            message.success("Grupo de Campo excluído!");
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
        <PageHeader style={{ padding: 0 }} title="Grupos" />
        {user_access === "A" && (
          <Button type="primary" onClick={() => form.current.openDrawer(null)}>
            Novo grupo
            <Icon type="arrow-right" />
          </Button>
        )}
      </Header>
      <ContentLight>
        <DataTable ref={dataTable} columns={columns} recurso="groups" />
      </ContentLight>
      <FormGrupos ref={form} reload={() => dataTable.current.buscarRecurso()} />
    </ContentTransparent>
  );
};

export default Grupos;
