import React, { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { Box, Container, LinearProgress, Typography } from "@mui/material";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import { Facility } from "../../services/FacilityService";
import { TENANT_ID } from "../../components/Utils";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/Button/CustomButton";
import {
  ButtonColor,
  ButtonSize,
  ButtonState,
} from "../../components/Button/ButtonEnums";
import { useTranslation } from "react-i18next";
import ActionConfirmationDialog from "../../components/ActionConfirmationDialog";
import AgentConfirmationDialog from "../../components/AgentConfirmationModal";

const columns = [
  {
    id: "id",
    label: "COMMON_ID",
    align: "left",
    width: "200px",
    sort: false,
  },
  {
    id: "name",
    label: "COMMON_NAME",
    align: "left",
    width: "200px",
    sort: false,
  },
  {
    id: "cropName",
    label: "CROP_NAME",
    align: "left",
    sort: false,
  },
  {
    id: "manager",
    label: "Manager",
    align: "left",
    sort: false,
  },
];

function DataCleanupModule() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [assetsData, setAssetsData] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = JSON.parse(localStorage.getItem("DfsWeb.locationData"));

  const getAssetsData = async () => {
    const payload = {
      Facility: {
        isGroupKeyBasedSearch: true,
        latitude: location?.latitude,
        longitude: location?.longitude,
        tenantId: TENANT_ID,
      },
    };
    setLoading(true);
    const params = { limit: pageSize, pageNo: page + 1, tenantId: TENANT_ID };
    const response = await Facility.search(payload, params);

    if (response?.status === 200) {
      const {
        data: { Facilities: { result = [], totalCount = 0 } = {} } = {},
      } = response;
      setAssetsData({ data: result, totalCount });
    }
    setLoading(false);
  };

  const getValue = ({ value, column }) => {
    const { id } = column;
    if (id === "cropName") {
      const fields = Array.isArray(value?.fields) ? value.fields : [];
      const crop = fields.find((element) => element.key === "cropName");
      return crop?.value ?? " - ";
    }
    return value;
  };

  let groupedRows = {};
  const groupColorMap = {};
  if (assetsData && assetsData?.data?.length > 0) {
    groupedRows = assetsData.data.reduce((acc, row) => {
      if (!acc[row.groupKey]) acc[row.groupKey] = [];
      acc[row.groupKey].push(row);
      return acc;
    }, {});
    const groupColors = ["#BBDEFB", "#FFECB3"];
    Object.keys(groupedRows).forEach((groupName, index) => {
      groupColorMap[groupName] = groupColors[index % groupColors.length];
    });
  }

  const handleRowClick = (row) => {
    let path = `${window.contextPath}/data-cleanup/assets-details`;
    navigate(path, {
      state: {
        data: row,
        categoryCode: Number(row.categoryId),
        category: null,
        isDataCleanup: true,
      },
    });
  };

  const handleDeleteAsset = async () => {
    const selectedAssets = assetsData.data.filter((asset) =>
      selectedIds.includes(asset.id)
    );
    setOpen(false);
    setOpenDeleteModal(true);
    setDeleteLoading(true);
    const payload = { Facilities: selectedAssets };
    const response = await Facility.delete(payload);
    if (response?.status === 202) {
      setDeleteLoading(false);
      setDeleteStatus(true);
    }
  };

  const onClose = () => {
    setOpenDeleteModal(false);
    if (deleteStatus) {
      setSelectedIds([]);
      getAssetsData();
    }
  };

  useEffect(() => {
    getAssetsData();
  }, [page, pageSize]);

  return (
    <Container variant="primary">
      <Box className="inner-box-screen m-auto mb-20">
        <Box className="breadcrumbs-container mb-10">
          <BasicBreadcrumbs />
        </Box>
        <Box className="mb-3 flex justify-end">
          <CustomButton
            color={ButtonColor.PRIMARY}
            size={ButtonSize.MEDIUM}
            onClick={() => setOpen(true)}
            state={
              selectedIds.length > 0
                ? ButtonState.ENABLED
                : ButtonState.DISABLED
            }
          >
            {t("COMMON_DELETE")}
          </CustomButton>
        </Box>
        {loading ? (
          <Box className="m-auto -mb-1" sx={{ width: "100%" }}>
            <LinearProgress color="success" />
          </Box>
        ) : (
          <CustomTable
            tableData={assetsData}
            columns={columns}
            valueRenderer={getValue}
            handleRowClick={handleRowClick}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            groupColorMap={groupColorMap}
            isSelectable={true}
            selected={selectedIds}
            setSelected={setSelectedIds}
          />
        )}
      </Box>
      <ActionConfirmationDialog
        open={open}
        setOpen={setOpen}
        onContinueClick={handleDeleteAsset}
        actionHeader={"COMMON_DELETE"}
        warningText={"COMMON_DELETE_SELECTED_ITEMS_WARNING"}
        isDelete={true}
      />
      <AgentConfirmationDialog
        open={openDeleteModal}
        loading={deleteLoading}
        status={deleteStatus}
        t={t}
        onClose={onClose}
      >
        {!deleteLoading && (
          <Typography>
            {deleteStatus ? t("DELETE_MULTI_SUCCESSFUL") : t("DELETE_FAILED")}
          </Typography>
        )}
      </AgentConfirmationDialog>
    </Container>
  );
}

export default DataCleanupModule;
