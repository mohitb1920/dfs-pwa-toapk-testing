import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  localStorageMock,
  mockPgrData,
  mockWorkflowData,
} from "../components/MockData";
import ComplaintDetails from "../AppModules/PGR/ComplaintDetails";
import * as ReactQuery from "react-query";
import { PGRService } from "../services/PGR";
import { UploadServices } from "../services/UploadService";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";

jest.mock("../services/PGR");
jest.mock("../services/UploadService");

const queryClient = new QueryClient();

const store = configureStore({
  reducer: rootReducer,
});

const renderComponent = () => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  window.localStorage.setItem(
    "DfsWeb.user-info",
    JSON.stringify({ uuid: "mock-uuid" })
  );
  jest.spyOn(ReactQuery, "useQuery").mockImplementation((queryKey, queryFn) => {
    if (queryKey[0] === "complaintDetails") {
      return {
        data: { ...mockPgrData },
        isLoading: false,
        refetch: jest.fn(),
      };
    }
    if (queryKey[0] === "workFlowDetails") {
      return {
        data: { ...mockWorkflowData },
        isLoading: false,
        refetch: jest.fn(),
      };
    }
    if (queryKey[0] === "Showcause_Deatils") {
      return {
        data: {},
        isLoading: false,
        revalidate: jest.fn(),
      };
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
      <Provider store={store}>
          <ComplaintDetails />
          </Provider>
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

describe("ComplaintDetails Page", () => {
  test("renders ComplaintDetails component", () => {
    renderComponent();
  });
  test("Testing Respond button Click", async () => {
    renderComponent();
    const respondButton = screen.getByText("GRM_COMMENT");
    fireEvent.click(respondButton);
    expect(screen.getByTestId("employee-response")).toBeInTheDocument();
    const remarksInput = screen.getByTestId("remarks-input");
    expect(remarksInput).toBeInTheDocument();
    fireEvent.change(remarksInput, { target: { value: "abcd" } });

    const previewButton = screen.getByText("COMMON_PREVIEW");
    expect(previewButton).toBeInTheDocument();
    fireEvent.click(previewButton);

    const editButton = screen.getByText("COMMON_EDIT");
    expect(editButton).toBeInTheDocument();

    const saveButton = screen.getByText("COMMON_SUBMIT");
    expect(saveButton).toBeInTheDocument();
    await waitFor(() => {
      PGRService.update.mockResolvedValueOnce({
        status: 400,
        data: [],
      });
    });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(
        screen.getByText("GRM_RESPONSE_SUBMISSION_ERROR")
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      PGRService.update.mockResolvedValueOnce({
        status: 200,
        data: {
          ServiceWrappers: [{ service: { serviceRequestId: "PGR-2332" } }],
        },
      });
    });
    fireEvent.click(saveButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("ticket-details")).toBeInTheDocument();
    });

    const doneButton = screen.getByText("COMMON_DONE");
    fireEvent.click(doneButton);
  });
  test("Testing Farmer Documents Preview", async () => {
    renderComponent();
    const previewButtons = screen.getAllByText("COMMON_VIEW");
    expect(previewButtons[0]).toBeInTheDocument();
    fireEvent.click(previewButtons[0]);
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();

    expect(previewButtons[1]).toBeInTheDocument();
    fireEvent.click(previewButtons[1]);
    const pdf = screen.getByTestId("pdf-document");
    expect(pdf).toBeInTheDocument();
  });
  test("Testing Respond with Documents Upload", async () => {
    global.URL.createObjectURL = jest.fn(() => "mock-url");
    renderComponent();
    const respondButton = screen.getByText("GRM_COMMENT");
    fireEvent.click(respondButton);
    const remarksInput = screen.getByTestId("remarks-input");
    expect(remarksInput).toBeInTheDocument();
    fireEvent.change(remarksInput, { target: { value: "abcd" } });
    // const file = new File(["dummy content"], "example.png", {
    //   type: "image/png",
    // });

    // const input = screen.getByTestId("dropzone");
    // // Simulate file drop
    // fireEvent.change(input, {
    //   target: {
    //     files: [file],
    //   },
    // });
    // await waitFor(() => {
    //   expect(screen.getByTestId("RemoveIcon")).toBeInTheDocument();
    // });

    // const viewButtons = screen.getAllByText("COMMON_VIEW");
    // fireEvent.click(viewButtons[viewButtons.length - 1]);
    // expect(screen.getByRole("dialog")).toBeInTheDocument();

    const previewButton = screen.getByText("COMMON_PREVIEW");
    fireEvent.click(previewButton);
    const saveButton = screen.getByText("COMMON_SUBMIT");
    expect(saveButton).toBeInTheDocument();
    // await waitFor(() => {
    //   UploadServices.Filestorage.mockResolvedValueOnce({
    //     status: 400,
    //     data: [],
    //   });
    // });
    // fireEvent.click(saveButton);
    // await waitFor(() => {
    //   expect(
    //     screen.getByText("DOCUMENT_UPLOAD_FAIL_ERROR")
    //   ).toBeInTheDocument();
    // });

    // await waitFor(() => {
    //   UploadServices.Filestorage.mockResolvedValueOnce({
    //     status: 201,
    //     data: {
    //       files: [{ fileStoreId: "abcd8765jhfsd" }],
    //     },
    //   });
    // });
    await waitFor(() => {
      PGRService.update.mockResolvedValueOnce({
        status: 200,
        data: {
          ServiceWrappers: [{ service: { serviceRequestId: "PGR-2332" } }],
        },
      });
    });
    fireEvent.click(saveButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("ticket-details")).toBeInTheDocument();
    });
  });
});
