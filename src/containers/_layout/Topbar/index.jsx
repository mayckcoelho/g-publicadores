import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toggleCollapseMenu } from "./topbarActions";
import consts from "../../../consts";

import { Avatar, Menu, Dropdown, Icon } from "antd";
import {
  Image,
  TopbarLight,
  AvatarName,
  AvatarWrapper,
  SectionFlex,
  IconDown,
  IconMenuFold,
} from "./styles";

import Logo from "../../../assets/images/logo.png";

const menu = (
  <Menu>
    <Menu.Item
      onClick={() => {
        localStorage.clear();
        window.location.reload();
      }}
      key="3"
    >
      <Icon type="poweroff" />
      Sair da aplicação
    </Menu.Item>
  </Menu>
);

const Topbar = ({ toggleCollapseMenu }) => {
  const [collapsed, setCollapsed] = useState(false);

  function toggleCollapsed() {
    setCollapsed(!collapsed);
    toggleCollapseMenu();
  }

  return (
    <TopbarLight className="Header">
      <SectionFlex>
        <IconMenuFold
          type={collapsed ? "menu-unfold" : "menu-fold"}
          onClick={toggleCollapsed}
        />

        <Image src={Logo} alt="Logo Azymus" />
        <span>G-Publicadores</span>
      </SectionFlex>

      <SectionFlex>
        <Dropdown overlay={menu} trigger={["click"]}>
          <AvatarWrapper>
            <Avatar size="large" icon="user" />
            <AvatarName>
              {JSON.parse(localStorage.getItem(consts.USER_DATA)).name}
            </AvatarName>
            <IconDown type="down" />
          </AvatarWrapper>
        </Dropdown>
      </SectionFlex>
    </TopbarLight>
  );
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ toggleCollapseMenu }, dispatch);

export default connect(null, mapDispatchToProps)(Topbar);
