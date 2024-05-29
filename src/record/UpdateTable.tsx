import React, { useState } from "react";
import { Table, Input, Button, Form } from "antd";
import axios from "axios";

const EditableTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      orgName: "Org1",
      orgCode: "001",
      srcServiceType: "Type1",
      suggestionOrgId: 10,
      displayOrder: 1,
    },
    {
      id: 2,
      orgName: "Org2",
      orgCode: "002",
      srcServiceType: "Type2",
      suggestionOrgId: 20,
      displayOrder: 2,
    },
  ]);

  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
        await axios.put(`api/v1/suggestion_org/${id}`, row);
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
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Button onClick={cancel}>Cancel</Button>
          </span>
        ) : (
          <Button disabled={editingKey !== ""} onClick={() => edit(record)}>
            Edit
          </Button>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
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
        pagination={false}
      />
    </Form>
  );
};

export default EditableTable;