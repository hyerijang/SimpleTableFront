import React from "react";
import { Tag } from "antd";

const TagWithColor = ({ srcServiceType }: { srcServiceType: string }) => {
  const hashString = (str: string | String) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash &= hash; // Convert to 32bit integer
    }
    return hash;
  };

  // srcServiceType 태그 색상
  const getTagColor = (srcServiceType: String) => {
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

  return <Tag color={getTagColor(srcServiceType)}>{srcServiceType}</Tag>;
};

export default TagWithColor;
