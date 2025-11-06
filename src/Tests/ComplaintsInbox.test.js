import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import ComplaintsInbox from "../AppModules/PGR/ComplaintsInbox";
import { QueryClient, QueryClientProvider } from "react-query";
import { complaintsMock, localStorageMock } from "../components/MockData";
import * as ReactQuery from "react-query";
import useInboxData from "../Hooks/useInboxData";
import useShowCauseData from "../Hooks/useShowCauseData";
import useComplaintsCount from "../Hooks/useComplaintsCount";

const queryClient = new QueryClient();
jest.mock('../Hooks/useInboxData');
jest.mock('../Hooks/useShowCauseData');
jest.mock('../Hooks/useComplaintsCount');


const renderComponent = () => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  window.localStorage.setItem(
    "DfsWeb.user-info",
    JSON.stringify({ uuid: "mock-uuid", roles: [{ code: "AC" }] })
  );
  window.sessionStorage.setItem("statusFilter", "pending");
  useShowCauseData.mockReturnValue({
    data: null,
    isLoading: false,
    refetch: jest.fn(),
  });
  useComplaintsCount.mockReturnValue({
    data: {issuedTo: 0, issuedBy: 0},
    isLoading: false,
    refetch: jest.fn(),
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <ComplaintsInbox />
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

describe("ComplaintsInbox Page", () => {
  test("renders ComplaintsInbox component", async () => {
    useInboxData.mockReturnValue({
      data: { ...complaintsMock },
      isLoading: false,
      refetch: jest.fn(),
    });
    renderComponent();
  });
  test("Testing loading state", () => {
    useInboxData.mockReturnValue({
      data: [],
      isLoading: true,
      refetch: jest.fn(),
    });
    renderComponent();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
  test("Testing no Complaints state", () => {
    useInboxData.mockReturnValue({
      data: { complaints: [], totalCount: 0 },
      isLoading: false,
      refetch: jest.fn(),
    });
    renderComponent();
    expect(screen.getByText("GRM_NO_COMPLAINTS")).toBeInTheDocument();
  });
  test("Testing error state", () => {
    useInboxData.mockReturnValue({
      data: null,
      isLoading: false,
      refetch: jest.fn(),
    });
    renderComponent();
    expect(screen.getByText("GRM_ERROR_LOADING_COMPLAINTS")).toBeInTheDocument();
  });
  test("Testing View Details Button", () => {
    useInboxData.mockReturnValue({
      data: { ...complaintsMock },
      isLoading: false,
      refetch: jest.fn(),
    });
    renderComponent();
    const viewButton = screen.getAllByText("GRM_VIEW_DETAILS")[0];
    fireEvent.click(viewButton);
  });
  test("Testing Refresh Data", () => {
    useInboxData.mockReturnValue({
      data: { ...complaintsMock },
      isLoading: false,
      refetch: jest.fn(),
    });
    renderComponent();
    fireEvent.click(screen.getByTestId("RefreshIcon"));
  });
  test("Testing Search Functionality", () => {
    useInboxData.mockReturnValue({
      data: { ...complaintsMock },
      isLoading: false,
      refetch: jest.fn(),
    });
    renderComponent();
    expect(screen.getByText("PGR-2024-05")).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText("GRM_SEARCH_PLACEHOLDER");
    fireEvent.change(searchInput, { target: { value: "" } });
    fireEvent.keyDown(searchInput, { key: "Enter" });
    fireEvent.change(searchInput, { target: { value: "PGR-2024-06" } });
    const searchIcon = screen.getByTestId("SearchIcon");
    useInboxData.mockReturnValue({
      data: {
        complaints: [
          {
            serviceRequestId: "PGR-2024-06",
            complaintSubType: "PMKSY Yojana Scheme",
            status: "PENDINGATL1",
            sla: 14,
            tenantId: "br",
            district: "Amritsar",
            createdDate: "16-May-2024",
          },
        ],
        totalCount: 1,
      },
      isLoading: false,
      refetch: jest.fn(),
    });
    fireEvent.click(searchIcon);
    expect(screen.getByText("PGR-2024-06")).toBeInTheDocument();
    expect(screen.queryByText("PGR-2024-05")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("ClearIcon"));
    expect(searchInput.value).toBe("");
  });

  test("testing pending filter", () => {
    useInboxData.mockReturnValue({
      data: { ...complaintsMock },
      isLoading: false,
      refetch: jest.fn(),
    });
    renderComponent();

    const pendingButton = screen.getByTestId("pending-button");
    fireEvent.click(pendingButton);
    expect(screen.getByText("GRM_PENDING")).toBeInTheDocument();
  });

  test("testing Resolved filter", () => {
    useInboxData.mockReturnValue({
      data: { ...complaintsMock },
      isLoading: false,
      refetch: jest.fn(),
    });
    renderComponent();

    const resolvedButton = screen.getByTestId("resolved-button");
    fireEvent.click(resolvedButton);
    expect(screen.getByText("GRM_RESOLVED")).toBeInTheDocument();
  });
});
