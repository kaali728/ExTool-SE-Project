import { Flex, Input } from "@findnlink/neuro-ui";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAssets } from "../../../lib/slices/assetSlice";

function AssetsSearch() {
  const disptach = useDispatch();
  const [searchText, setSearchText] = useState("");
  const assets = useSelector(selectAssets);
  return (
    <Flex style={{ width: "350px" }}>
      <Input value={searchText} placeholder="Looking for a asset?" scale="l" />
    </Flex>
  );
}

export default AssetsSearch;
