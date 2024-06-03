import React, { useState, useEffect } from "react";
import { Select } from "antd";
import axios from "axios";

const SearchSelectBox: React.FC = () => {
  const [responseData, setResponseData] = useState<any>(null); // API 응답 데이터 상태

  useEffect(() => {
    // 페이지가 로드될 때 API 호출
    fetchData("/api/v1/fruits");
  }, []); // 빈 배열을 전달하여 최초 렌더링 시에만 실행

  const handleSelectChange = async (value: string) => {
    try {
      let url = "/api/v1/fruits";
      if (value) {
        url = `/api/v1/fruits?name=${value}`;
      }
      fetchData(url);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      setResponseData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <Select defaultValue="" onChange={handleSelectChange}>
        <Select.Option value="">Select a fruit</Select.Option>
        <Select.Option value="apple">apple</Select.Option>
        <Select.Option value="banana">banana</Select.Option>
        <Select.Option value="orange">orange</Select.Option>
      </Select>
      {/* API 응답 데이터를 표시하는 input 태그 */}
      <input type="text" value={responseData} readOnly />
    </div>
  );
};

export default SearchSelectBox;
