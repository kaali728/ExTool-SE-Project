import { Flex, Input } from "@findnlink/neuro-ui";
import useAsyncEffect from "lib/hooks/useAsyncEffect";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AssetType } from "types/global";
import {
  selectAssets,
  setfilteredAssets,
} from "../../../lib/slices/assetSlice";

function AssetsSearch() {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const assets = useSelector(selectAssets);

  const handleChanged = (e: any) => {
    const { value } = e.target;
    setSearchText(value);
  };

  function filterAssets() {
    const lowerCaseTextFilters = searchText
      .toLowerCase()
      .split(/\s+/g)
      .filter((item) => item.length > 0);

    const filteredAssets = Object.values(assets).filter((asset) => {
      for (const filter of lowerCaseTextFilters) {
        if (asset.name.indexOf(filter) === -1) {
          return false;
        }
      }
      return true;
    });

    return filteredAssets;
  }

  useAsyncEffect(
    async (stopped) => {
      const filteredArticles = await new Promise<Array<AssetType>>(
        (resolve) => {
          resolve(filterAssets());
        }
      );
      if (stopped()) return;
      dispatch(setfilteredAssets(filteredArticles));
    },
    [searchText, assets]
  );

  return (
    <Flex style={{ width: "350px" }}>
      <Input
        value={searchText}
        placeholder="Looking for a asset?"
        scale="l"
        onChange={handleChanged}
      />
    </Flex>
  );
}

export default AssetsSearch;
