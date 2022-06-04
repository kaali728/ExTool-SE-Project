import React from "react";

type AssetType = {
  onBackClick: () => void;
  id: String;
};

export default function Asset({ onBackClick, id }: AssetType) {
  return (
    <div>
      <div onClick={onBackClick}>Back Button</div>
      {id}
    </div>
  );
}
