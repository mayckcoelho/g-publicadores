import React, { useEffect, useState, useRef } from "react";
import api from "../../../services";

import { Table, Input, Button, Icon, ConfigProvider, Empty } from "antd";
import { useCallback } from "react";

const DataTable = ({ recurso, columns, reload, handleReload, filtros }) => {
  const [dataColumns, setDataColumns] = useState(columns);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef(null);

  const buscarRecurso = useCallback(
    async (params = {}) => {
      setLoading(true);

      let queryParams = "";

      const limit = params.results || 10;
      const offset = (params.page - 1) * limit || 0;
      const sortField = params.sortField;
      const sortOrder = params.sortOrder;
      const filters = params.filters;

      for (let filter in filters) {
        queryParams += `&${filter}=${filters[filter]}`;
      }

      if (sortField && sortOrder)
        queryParams += `&order[${
          sortOrder === "ascend" ? "asc" : "desc"
        }]=${sortField}`;

      if (filtros) {
        Object.entries(filtros).forEach(([key, value]) => {
          queryParams += `&${key}=${value}`;
        });
      }

      const response = await api.get(
        `${recurso}?limit=${limit}&offset=${offset}${queryParams}`
      );

      if (response) {
        const pages = { ...params.pagination };

        pages.total = parseInt(response.data.total);

        if (!pages.current) pages.current = 1;

        setLoading(false);
        setData(response.data.data);
        setPagination(pages);
      }
    },
    [filtros, recurso]
  );

  function handleTableChange(pagination, filters, sorter) {
    const pager = { pagination };
    pager.current = pagination.current;

    buscarRecurso({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      filters: filters,
      pagination,
    });
  }

  const getColumnSearchProps = useCallback((dataIndex) => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={`Buscar ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <Icon
          type="search"
          style={{ color: filtered ? "#1890ff" : undefined }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => {
            searchInput.current.select();
          });
        }
      },
    };
  }, []);

  function handleSearch(selectedKeys, confirm) {
    confirm();
    setSearchText(selectedKeys[0]);
  }

  function handleReset(clearFilters) {
    clearFilters();
    setSearchText("");
  }

  useEffect(() => {
    buscarRecurso();

    const cols = [];

    columns.forEach((col) => {
      if (col.hidden) return false;

      if (col.filterSearch) {
        cols.push({ ...col, ...getColumnSearchProps(col.dataIndex) });
      } else {
        cols.push({ ...col });
      }
    });
    setDataColumns(cols);
  }, [buscarRecurso, columns, getColumnSearchProps]);

  useEffect(() => {
    if (reload) {
      buscarRecurso();
      handleReload(false);
    }
  }, [reload, buscarRecurso, handleReload]);

  return (
    <ConfigProvider
      renderEmpty={() => <Empty description="Sem dados para exibir" />}
    >
      <Table
        columns={dataColumns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: true }}
        tableLayout="fixed"
        size="middle"
        searchText={searchText}
      />
    </ConfigProvider>
  );
};
export default DataTable;
