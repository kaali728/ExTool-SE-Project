import { Modal, Input, Text, Flex, Button } from "@findnlink/neuro-ui";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { ASSET_PICK_DROP } from "lib/models/assetEnum";
import autoAnimate from "@formkit/auto-animate";
import { AssetTableObject, OfficeNote } from "types/global";

export default function RemoveRowModal({
  open,
  setOpen,
  onSubmit,
  save,
  title,
  selectedCellData,
}: {
  open: boolean;
  setOpen: (arg: boolean) => any;
  onSubmit: () => any;
  save: () => {};
  title: string;
  selectedCellData?: AssetTableObject;
}) {
  const [toggleSave, setToggleSave] = useState<boolean>(false);

  useEffect(() => {
    if (toggleSave) {
      save();
      setToggleSave(false);
    }
  }, [toggleSave]);

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      type="confirm"
      onConfirm={async () => {
        await onSubmit();
        setToggleSave(true);
        setOpen(false);
      }}
    >
      <Text weight="bold" scale="xl">
        <div style={{ color: "var(--error)" }}>{title}</div>
      </Text>
    </Modal>
  );
}
