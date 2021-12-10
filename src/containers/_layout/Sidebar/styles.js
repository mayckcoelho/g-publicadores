import styled from "styled-components";

import { Menu, Icon } from "antd";

const { SubMenu } = Menu;

export const MenuItem = styled(Menu.Item)`
  &&.ant-menu-item-selected {
    background-color: #c1ddf4;
    color: #2767b0;
  }

  &&.ant-menu-item-selected::after {
    border-right: 3px solid #2767b0 !important;
  }

  &&.ant-menu-item:hover {
    color: #2767b0;
  }

  &&.ant-menu-item:active {
    background-color: #c1ddf4;
  }

  &&.ant-menu-item-selected > a,
  .ant-menu-item-selected > a:hover {
    color: #2767b0;
  }

  &&.ant-menu-item > a:hover {
    color: #2767b0;
  }
`;

export const SubMenuItem = styled(SubMenu)`
  &&.ant-menu-submenu-selected {
    color: #2767b0;
  }

  &&.ant-menu-item:hover,
  .ant-menu-item-active,
  .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
  .ant-menu-submenu-active,
  .ant-menu-submenu-title:hover {
    color: #2767b0;
  }

  &&.ant-menu-submenu-inline
    > .ant-menu-submenu-title:hover
    .ant-menu-submenu-arrow::after,
  &&.ant-menu-submenu-inline
    > .ant-menu-submenu-title:hover
    .ant-menu-submenu-arrow::before {
    background: linear-gradient(to right, #2767b0, #2767b0);
  }
`;

export const IconSidebar = styled(Icon)`
  && {
    font-size: 18px;
    margin-right: 1em;
  }
`;
