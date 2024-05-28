import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Form,
  Button,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Tag, // Tag 추가
} from "antd";
import axios from "axios";

interface DataType {
  key: number;
  orgName: string;
  orgCode: string;
  srcServiceType: string;
  suggestionOrgId: number | null; // suggestionOrgId 컬럼 추가
  displayOrder: number | null;
}

const EditableTable: React.FC = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [count, setCount] = useState(0);
  const [orgOptions, setOrgOptions] = useState<
    { orgName: string; orgCode: string; srcServiceType: string }[]
  >([
    { orgName: "신한은행", orgCode: "BANK1", srcServiceType: "BANK" },
    { orgName: "국민은행", orgCode: "BANK2", srcServiceType: "BANK" },
    { orgName: "신한카드", orgCode: "CARD1", srcServiceType: "CARD" },
  ]);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const response = await axios.get("/api/v1/org_data"); // 외부 API 엔드포인트
        setOrgOptions(response.data);
      } catch (error) {
        console.error("Failed to fetch org data:", error);
      }
    };

    fetchOrgData();
  }, []);

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      orgName: "",
      orgCode: "",
      srcServiceType: "",
      suggestionOrgId: null, // suggestionOrgId 초기값 추가
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
      await axios.post("/api/v1/suggestion_orgs", formattedValues);
      message.success("Data submitted successfully");
    } catch (error) {
      console.error("Failed to submit data:", error);
      message.error("Submission failed. Please check the form.");
    }
  };

  const handleOrgNameChange = (value: string, index: number) => {
    const selectedOrg = orgOptions.find((option) => option.orgName === value);
    const newDataSource = [...dataSource];
    if (selectedOrg) {
      newDataSource[index].orgName = selectedOrg.orgName;
      newDataSource[index].orgCode = selectedOrg.orgCode;
      newDataSource[index].srcServiceType = selectedOrg.srcServiceType;
      // suggestionOrgId는 자동으로 설정되므로 변경하지 않음
    }
    setDataSource(newDataSource);
    form.setFieldsValue({ table: newDataSource });
  };

  const validateSuggestionOrgId = (_: any, value: number) => {
    if (value === null || value === undefined || value < 1) {
      return Promise.reject(
        new Error("SuggestionOrgId must be a positive integer")
      );
    }
    return Promise.resolve();
  };

  const validateDisplayOrder = (_: any, value: number) => {
    if (value === null || value === undefined || value < 0) {
      return Promise.reject(
        new Error("DisplayOrder must be a non-negative integer")
      );
    }
    return Promise.resolve();
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
      title: "Org Name",
      dataIndex: "orgName",
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
    {
      title: "SuggestionOrgId",
      dataIndex: "suggestionOrgId",
      render: (_: any, record: DataType, index: number) => (
        <Form.Item
          name={["table", index, "suggestionOrgId"]}
          initialValue={record.suggestionOrgId}
          rules={[{ validator: validateSuggestionOrgId }]}
        >
          <InputNumber />
        </Form.Item>
      ),
    },
    {
      title: "Display Order",
      dataIndex: "displayOrder",
      render: (_: any, record: DataType, index: number) => (
        <Form.Item
          name={["table", index, "displayOrder"]}
          initialValue={record.displayOrder}
          rules={[{ validator: validateDisplayOrder }]}
        >
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
