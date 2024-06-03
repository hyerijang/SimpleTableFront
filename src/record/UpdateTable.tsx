import React, { useState } from "react";
import { Table, Input, Button, Form, Popconfirm, Select } from "antd";
import axios from "axios";
import TagWithColor from "./TagWithColor";

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
    },
    {
      title: "Org Code",
      dataIndex: "orgCode",
      width: "15%",
      editable: true,
    },
    {
      title: "Src Service Type",
      dataIndex: "srcServiceType",
      width: "15%",
      editable: true,
      render: (_: any, record: DataType) => (
        <TagWithColor srcServiceType={record.srcServiceType} />
      ), // TagWithColor 컴포넌트 사용
    },
    {
      title: "Suggestion Org ID",
      dataIndex: "suggestionOrgId",
      width: "15%",
      editable: true,
    },
    {
      title: "Display Order",
      dataIndex: "displayOrder",
      width: "15%",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Button onClick={cancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
          </span>
        ) : (
          <span>
            <Button
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              Edit
            </Button>
          </span>
        );
      },
    },
    {
      title: "Action2",
      dataIndex: "action2",
      render: (_: any, record: DataType) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => deleteRecord(record.id)}
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
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
            {dataIndex === "orgName" ? (
              <Select
                showSearch
                placeholder="Select an org"
                optionFilterProp="children"
                // onChange={(value) => handleOrgNameChange(value, index)}
              >
                <Select.Option>opt1</Select.Option>
                <Select.Option>opt2</Select.Option>
              </Select>
            ) : dataIndex === "orgCode" ? (
              <Input disabled />
            ) : dataIndex === "srcServiceType" ? (
              <TagWithColor srcServiceType={record.srcServiceType} />
            ) : (
              children
            )}
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
