import React, { useState } from "react";

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

const { confirm } = Modal;

const Grupos = ({ history }) => {
  const [reload, setReload] = useState(false);
  const [cadastroVisible, setCadastroVisible] = useState(false);
  const [idGrupo, setIdGrupo] = useState(null);

  const user_email = JSON.parse(localStorage.getItem(consts.USER_DATA)).email;

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
        <TableIcon type={"edit"} onClick={() => setIdGrupo(value.id)} />
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
          onClick={() => excluirGrupo(value.id)}
        />
      ),
      fixed: "right",
      width: 1,
      hidden: !consts.ALLOWED_EMAILS.includes(user_email),
    },
  ];

  function excluirGrupo(id) {
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
        <PageHeader style={{ padding: 0 }} title="Grupos" />
        {consts.ALLOWED_EMAILS.includes(user_email) && (
          <Button type="primary" onClick={() => setCadastroVisible(true)}>
            Novo grupo
            <Icon type="arrow-right" />
          </Button>
        )}
      </Header>
      <ContentLight>
        <DataTable
          reload={reload}
          handleReload={(r) => setReload(r)}
          columns={columns}
          recurso="groups"
        />
      </ContentLight>
      <FormGrupos
        grupo={idGrupo}
        handleVisible={(status, reload, recurso) => {
          setCadastroVisible(status);
          setReload(reload);
          setIdGrupo(recurso);
        }}
        visible={cadastroVisible}
      />
    </ContentTransparent>
  );
};

export default Grupos;
