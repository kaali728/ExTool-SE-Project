import { Flex, Input } from "@findnlink/neuro-ui";
import React, { useState } from "react";

function AssetsSearch() {
  const [searchText, setSearchText] = useState("");
  return (
    <Flex style={{ width: "350px" }}>
      <Input value={searchText} placeholder="Looking for a asset?" scale="l" />
    </Flex>
  );
}

export default AssetsSearch;
