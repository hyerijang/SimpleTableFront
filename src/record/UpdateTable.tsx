import React, { useState } from "react";
import { Table, Input, Button, Form, Popconfirm, Select, Tag } from "antd";
import axios from "axios";

interface DataType {
  id: string;
  orgName: string;
  orgCode: string;
  srcServiceType: string;
  suggestionOrgId: number;
  displayOrder: number;
}

const EditableTable = () => {
  const [data, setData] = useState([
    {
      id: "1",
      orgName: "Org1",
      orgCode: "001",
      srcServiceType: "Type1",
      suggestionOrgId: 10,
      displayOrder: 1,
    },
    {
      id: "2",
      orgName: "Org2",
      orgCode: "002",
      srcServiceType: "Type2",
      suggestionOrgId: 20,
      displayOrder: 2,
    },
  ]);

  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();

  const isEditing = (record: DataType) => record.id === editingKey;

  const edit = (record: DataType) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const save = async (id: string) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
        await axios.put(`api/v1/suggestion_orgs/${id}`, row);
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const cancel = () => {
    setEditingKey("");
    form.resetFields();
  };

  const deleteRecord = async (id: string) => {
    try {
      await axios.delete(`api/v1/suggestion_orgs/${id}`);
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
    } catch (err) {
      console.log("Delete failed:", err);
    }
  };

  const orgOptions = [
    { orgCode: "001", orgName: "Org1" },
    { orgCode: "002", orgName: "Org2" },
    // Add more options as needed
  ];

  const handleOrgNameChange = (value: string, index: number) => {
    // Handle org name change here
  };

  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash &= hash; // Convert to 32bit integer
    }
    return hash;
  };

  // srcServiceType 태그 색상
  const getTagColor = (srcServiceType: string) => {
    const colors = [
      "blue",
      "green",
      "red",
      "yellow",
      "orange",
      "purple",
      "cyan",
      "magenta",
    ];
    const index = Math.abs(hashString(srcServiceType)) % colors.length;
    return colors[index];
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "5%",
      editable: false,
    },
    {
      title: "Org Name",
      dataIndex: "orgName",
      width: "15%",
      editable: true,
      render: (_: any, record: DataType, index: number) => (
        <Form.Item
          name={["table", index, "orgName"]}
          rules={[{ required: true, message: "Org Name is required" }]}
        >
          <Select
            showSearch
            placeholder="Select an org"
            optionFilterProp="children"
            onChange={(value) => handleOrgNameChange(value, index)}
          >
            {orgOptions.map((option) => (
              <Select.Option key={option.orgCode} value={option.orgName}>
                {option.orgName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Org Code",
      dataIndex: "orgCode",
      width: "15%",
      editable: true,
      render: (_: any, record: DataType, index: number) => (
        <Form.Item
          name={["table", index, "orgCode"]}
          initialValue={record.orgCode}
        >
          <Input disabled />
        </Form.Item>
      ),
    },
    {
      title: "Src Service Type",
      dataIndex: "srcServiceType",
      width: "15%",
      editable: true,
      render: (_: any, record: DataType, index: number) => (
        <Form.Item
          name={["table", index, "srcServiceType"]}
          initialValue={record.srcServiceType}
        >
          <span>
            {record.srcServiceType && (
              <Tag color={getTagColor(record.srcServiceType)}>
                {record.srcServiceType}
              </Tag>
            )}
          </span>
        </Form.Item>
      ),
    },
    // Add more columns as needed
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType:
          col.dataIndex === "suggestionOrgId" ||
          col.dataIndex === "displayOrder"
            ? "number"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }: {
    editing: boolean;
    dataIndex: string;
    title: React.ReactNode;
    inputType: "text" | "number";
    record: DataType;
    index: number;
    children: React.ReactNode;
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            <Input type={inputType} />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{ pageSize: 10, position: ["bottomCenter"] }}
      />
    </Form>
  );
};

export default EditableTable;
