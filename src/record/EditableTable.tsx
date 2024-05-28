import React, { useState } from "react";
import {
  Table,
  Input,
  Form,
  Button,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";

interface DataType {
  key: number;
  orgName: string;
  orgCode: string;
  srcServiceType: string;
  displayOrder: number | null;
}

const EditableTable: React.FC = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [count, setCount] = useState(0);

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      orgName: "",
      orgCode: "",
      srcServiceType: "",
      displayOrder: null,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleDelete = (key: number) => {
    const newDataSource = dataSource.filter((item) => item.key !== key);
    setDataSource(newDataSource);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = values.table.map((row: DataType) => ({
        ...row,
        displayOrder: row.displayOrder === null ? undefined : row.displayOrder,
      }));
      await axios.post("/api/v1/suggestion_org", formattedValues);
      message.success("Data submitted successfully");
    } catch (error) {
      console.error("Failed to submit data:", error);
      message.error("Submission failed. Please check the form.");
    }
  };

  const columns = [
    {
      title: "Org Name",
      dataIndex: "orgName",
      render: (_: any, record: DataType, index: number) => (
        <Form.Item
          name={["table", index, "orgName"]}
          rules={[{ required: true, message: "Org Name is required" }]}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      title: "Org Code",
      dataIndex: "orgCode",
      render: (_: any, record: DataType, index: number) => (
        <Form.Item
          name={["table", index, "orgCode"]}
          rules={[{ required: true, message: "Org Code is required" }]}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      title: "Src Service Type",
      dataIndex: "srcServiceType",
      render: (_: any, record: DataType, index: number) => (
        <Form.Item
          name={["table", index, "srcServiceType"]}
          rules={[{ required: true, message: "Src Service Type is required" }]}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      title: "Display Order",
      dataIndex: "displayOrder",
      render: (_: any, record: DataType, index: number) => (
        <Form.Item name={["table", index, "displayOrder"]}>
          <InputNumber />
        </Form.Item>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: DataType) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button>Delete</Button>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <Form form={form} name="dynamic_form_nest_item" onFinish={handleSave}>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowClassName={() => "editable-row"}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <Button onClick={handleAdd} type="primary">
          Add a row
        </Button>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default EditableTable;
