import { Modal, Input, Text, Flex, Button } from "@findnlink/neuro-ui";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { ASSET_PICK_DROP } from "lib/models/assetEnum";
import autoAnimate from "@formkit/auto-animate";
import { AssetTableObject, OfficeNote } from "types/global";

export default function RowModal({
  open,
  setOpen,
  onSubmit,
  save,
  title,
  selectedCellData,
}: {
  open: boolean;
  setOpen: (arg: boolean) => any;
  onSubmit: ({ date, status, destination, confirmed, officeNotes }: any) => any;
  save: () => {};
  title: string;
  selectedCellData?: AssetTableObject;
}) {
  const officeNotesRef = useRef(null);
  const [toggleSave, setToggleSave] = useState<boolean>(false);

  useEffect(() => {
    if (toggleSave) {
      save();
      setToggleSave(false);
    }
  }, [toggleSave]);

  const [formData, setFormData] = useState<{
    destination: string;
    date: string;
    report: string;
    officeNotes: OfficeNote[];
    confirmed: boolean;
    status: string;
  }>({
    destination: "",
    date: "",
    report: "",
    officeNotes: [],
    confirmed: false,
    status: "",
  });

  useEffect(() => {
    if (selectedCellData) {
      setFormData({
        destination: selectedCellData.destination,
        date: selectedCellData.date,
        report: selectedCellData.report!,
        officeNotes: selectedCellData.officeNotes
          ? selectedCellData.officeNotes
          : [],
        confirmed: selectedCellData.confirmed,
        status: selectedCellData.status,
      });
    }
  }, [selectedCellData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name.includes("officeNote")) {
      const noteIndex = Number(name.replace("officeNote", ""));
      setFormData((prev) => ({
        ...prev,
        officeNotes: prev.officeNotes.map((officeNote, index) => {
          if (index === noteIndex) {
            return { text: value, checked: false };
          }
          return officeNote;
        }),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (formData.status === "Select" || formData.status === "") {
      toast.error("Please select a status!");
      return true;
    }
    if (formData.destination === "") {
      toast.error("Please pick a destination!");
      return true;
    }
    if (formData.date === "") {
      toast.error("Please pick a date and time!");
      return true;
    }

    onSubmit({
      date: formData.date,
      status: formData.status,
      destination: formData.destination,
      confirmed: formData.confirmed,
      officeNotes: formData.officeNotes,
    });

    setToggleSave(true);
    setFormData({
      destination: "",
      date: "",
      report: "",
      officeNotes: [],
      confirmed: false,
      status: "",
    });

    return false;
  };

  useEffect(() => {
    officeNotesRef.current && autoAnimate(officeNotesRef.current);
  }, [officeNotesRef]);

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      type="confirm"
      onConfirm={async () => {
        const modalOpen = await handleSubmit();
        setOpen(modalOpen);
      }}
    >
      <Text weight="bold" scale="xl">
        {title}
      </Text>
      <Flex>
        <Text margin="xl 0 m 0" scale="s">
          Status
        </Text>
        <select name="status" onChange={handleChange} value={formData.status}>
          <option value={"Select"}>Select</option>
          <option value={ASSET_PICK_DROP.PICKUP}>
            {ASSET_PICK_DROP.PICKUP}
          </option>
          <option value={ASSET_PICK_DROP.DROP_OFF}>
            {ASSET_PICK_DROP.DROP_OFF}
          </option>
          <option value={ASSET_PICK_DROP.AWAITING_PAYMENT}>
            {ASSET_PICK_DROP.AWAITING_PAYMENT}
          </option>
        </select>

        <Text margin="xl 0 m 0" scale="s">
          Destination
        </Text>
        <Input
          name={"destination"}
          value={formData.destination}
          onChange={handleChange}
        />

        <Text margin="xl 0 m 0" scale="s">
          Date
        </Text>
        <Input
          name={"date"}
          type="datetime-local"
          value={formData.date}
          onChange={handleChange}
        />
        <Text margin="xl 0 m 0" scale="s">
          Office Notes
        </Text>

        <div ref={officeNotesRef}>
          {formData.officeNotes.map(
            (officeNote: { text: string; checked: boolean }, index: number) => (
              <div key={index}>
                <Flex
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <span></span>
                  <Button
                    onClick={() => {
                      let _officeNotes = formData.officeNotes;
                      _officeNotes.splice(index, 1);
                      setFormData((prev) => ({
                        ...prev,
                        officeNotes: _officeNotes,
                      }));
                    }}
                    scale="s"
                    margin="m 0"
                  >
                    Remove
                  </Button>
                </Flex>
                <textarea
                  key={index}
                  name={"officeNote" + index}
                  value={officeNote.text}
                  onChange={handleChange}
                />
              </div>
            )
          )}
        </div>

        <Button
          onClick={() => {
            setFormData((prev) => ({
              ...prev,
              officeNotes: [...prev.officeNotes, { text: "", checked: false }],
            }));
          }}
        >
          + Add office note
        </Button>
      </Flex>
    </Modal>
  );
}
