import { Button, Box, Modal, Backdrop, Fade } from "@mui/material";
import "../CustomWidget.css";
import { useState, useEffect } from "react";
import FormModal from "../FormModal/FormModal";
import Mapper from "../Mapper";

export const CustomSubFormShushk = function (props) {
  const {
    relation,
    parent,
    schemeId,
    label,
    name,
    language,
    rawErrors,
    required = true,
    register,
    control,
    setValue,
    disable,
    modalName,
    disableAll,
    errors,
    reset,
    methods,
    scheme,
  } = props;
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEdit = (index) => {
    setEditIndex(index);
    handleOpen();
  };
  const renderValue = (value) => {
    if (value instanceof File) {
      return value.name;
    } else if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return value;
  };
  useEffect(() => {
    let currentFile;
    if (parent && relation) currentFile = control._formValues[parent][relation];
    else if (relation) currentFile = control._formValues[relation];

    if (currentFile) {
      setFormData(currentFile);
    }
  }, [control._formValues, parent, relation]);
  let finalResult = formData.reduce(
    (acc, item) => {
      acc.totalPlantsApplied += Number(item?.appliedPlants) || 0;
      acc.totalAreaApplied += Number(item?.plantsRakwa) || 0;
      return acc;
    },
    {
      totalPlantsApplied: 0,
      totalAreaApplied: 0,
    }
  );
  return (
    <div>
      <Button
        variant="outlined"
        component="label"
        sx={{
          backgroundColor: disable ? "#FF8E9E" : "#A5292B",
          color: disable ? "darkgray" : "white",
          borderColor: disable ? "gray" : "#A5292B",
          borderRadius: "0.5rem",
          "&:hover": {
            backgroundColor: disable ? "gray" : "white",
            color: disable ? "darkgray" : "#A5292B",
            borderColor: disable ? "gray" : "#A5292B",
          },
        }}
        onClick={disable ? undefined : handleOpen}
        disabled={disable}
      >
        {label}
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <FormModal
              parent={parent}
              relation={relation}
              schemeId={schemeId}
              label={name}
              open={open}
              handleCloseModal={handleClose}
              language={language}
              register={register}
              errors={rawErrors}
              control={control}
              setValue={setValue}
              setEditIndex={setEditIndex}
              editIndex={editIndex}
              formData={formData}
              setFormData={setFormData}
              defaultValues={editIndex !== null ? formData[editIndex] : {}}
              disableAll={disable}
              modalName={modalName}
              methods={methods}
            />
          </Box>
        </Fade>
      </Modal>
      <Box>
        {formData.map((data, index) => (
          <Box
            sx={{
              borderRadius: "1rem",
              borderColor: "black",
              borderWidth: "1px",
              margin: "10px 0",
              padding: "5px",
              cursor: "pointer",
            }}
            key={index}
            onClick={() => handleEdit(index)}
          >
            {Object.keys(data).map((key) => (
              <div key={key}>
                {key}: {renderValue(data[key])}
              </div>
            ))}
          </Box>
        ))}
      </Box>
      <Mapper
        parent={parent}
        relation={"cropCount"}
        type={"label"}
        obj={{
          ...scheme.properties["cropCount"],
          "title-en": `${scheme.properties["cropCount"]["title-en"]} : ${finalResult?.totalPlantsApplied}`,
          "title-hi": `${scheme.properties["cropCount"]["title-hi"]} : ${finalResult?.totalPlantsApplied}`,
        }}
        register={register}
        language={language}
        errors={errors}
        control={control}
        reset={reset}
        setValue={setValue}
        disableAll={disableAll}
        schemeId={schemeId}
      />
      <Mapper
        parent={parent}
        relation={"appliedArea"}
        type={"label"}
        obj={{
          ...scheme.properties["appliedArea"],
          "title-en": `${scheme.properties["appliedArea"]["title-en"]} : ${finalResult?.totalAreaApplied}`,
          "title-hi": `${scheme.properties["appliedArea"]["title-hi"]} : ${finalResult?.totalAreaApplied}`,
        }}
        register={register}
        language={language}
        errors={errors}
        control={control}
        reset={reset}
        setValue={setValue}
        disableAll={disableAll}
        schemeId={schemeId}
      />
    </div>
  );
};
