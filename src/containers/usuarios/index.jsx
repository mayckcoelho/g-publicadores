import React, { useRef } from "react";

import { Button, Icon, PageHeader } from "antd";
import { Header } from "../../shared/styles";
import FormUsuarios from "./form";
import {
  ContentLight,
  ContentTransparent,
} from "../../shared/components/Content";
import DataTable from "../../shared/components/dataTable";
import { TableIcon } from "../../shared/styles/index";
import consts from "../../consts";

const Usuarios = () => {
  const dataTable = useRef(null);
  const form = useRef(null);

  const user_email = JSON.parse(localStorage.getItem(consts.USER_DATA)).email;

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      width: "20%",
      filterSearch: true,
    },
    {
      title: "Email",
      dataIndex: "email",
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
      hidden: !consts.ALLOWED_EMAILS.includes(user_email),
    },
  ];

  return (
    <ContentTransparent>
      <Header>
        <PageHeader style={{ padding: 0 }} title="Usuários" />
        {consts.ALLOWED_EMAILS.includes(user_email) && (
          <Button type="primary" onClick={() => form.current.openDrawer(null)}>
            Novo usuário
            <Icon type="arrow-right" />
          </Button>
        )}
      </Header>
      <ContentLight>
        <DataTable ref={dataTable} columns={columns} recurso="users" />
      </ContentLight>
      <FormUsuarios
        ref={form}
        reload={() => dataTable.current.buscarRecurso()}
      />
    </ContentTransparent>
  );
};

export default Usuarios;
