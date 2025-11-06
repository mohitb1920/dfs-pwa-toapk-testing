import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import CarousalManagement from "../pages/Announcements/CarousalManagement";
import {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../services/announcementService";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import {
  localStorageMock,
  mockAnnouncements,
  mockEnLocalization,
  mockHiLocalization,
} from "../components/MockData";
import { getLocalizationMessages } from "../services/AnnouncementsLocalizationService";
import { QueryClient, QueryClientProvider } from "react-query";
import { useLocalizationStore } from "../Hooks/Store";

jest.mock("../services/announcementService");
jest.mock("../services/AnnouncementsLocalizationService");
jest.mock("../Hooks/Store");

const store = configureStore({
  reducer: rootReducer,
});
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        cacheTime: 0,
      },
    },
  });

const renderComponent = () => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  window.localStorage.setItem("WebApp.Employee.locale", "en_IN");
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <CarousalManagement />
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("CarousalManagement Page", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  test("renders CarousalManagement component", () => {
    useLocalizationStore.mockReturnValue({
      data: {},
      isLoading: false,
    });
    renderComponent();
  });
  test("Testing Add Announcement Action", () => {
    useLocalizationStore.mockReturnValue({
      data: {},
      isLoading: false,
    });
    renderComponent();

    fireEvent.click(screen.getByText("ANC_ADD_ANNOUNCEMENT"));
    expect(screen.getByTestId("announcement-form")).toBeInTheDocument();
  });
  test("testing Edit View Button clicks", async () => {
    const en_payload = {
      locale: "en_IN",
      module: "dfs-announcements",
      tenantId: "br",
    };
    const hi_payload = {
      locale: "hi_IN",
      module: "dfs-announcements",
      tenantId: "br",
    };
    useLocalizationStore.mockReturnValue({
      data: {},
      isLoading: false,
    });
    getAnnouncements.mockResolvedValueOnce({
      status: 200,
      data: { Announcements: mockAnnouncements },
    });
    getLocalizationMessages.mockResolvedValueOnce({
      status: 200,
      data: { messages: mockEnLocalization },
    });
    getLocalizationMessages.mockResolvedValueOnce({
      status: 200,
      data: { messages: mockHiLocalization },
    });

    renderComponent();

    await waitFor(() => {
      expect(getAnnouncements).toHaveBeenCalledTimes(1);
      expect(getLocalizationMessages).toHaveBeenCalledTimes(2);
      expect(getLocalizationMessages).toHaveBeenCalledWith(en_payload);
      expect(getLocalizationMessages).toHaveBeenCalledWith(hi_payload);
    });

    await waitFor(() => {
      const viewButton = screen.getByLabelText("View");
      fireEvent.click(viewButton);
      expect(screen.getByTestId("announcement-form")).toBeInTheDocument();
    });
    await waitFor(() => {
      const editButton = screen.getByLabelText("Edit");
      fireEvent.click(editButton);
      expect(screen.getByTestId("announcement-form")).toBeInTheDocument();
    });
    await waitFor(() => {
      const saveButton = screen.getByText("COMMON_UPDATE");
      updateAnnouncement.mockResolvedValueOnce({
        status: 200,
        data: { Announcements: mockAnnouncements },
      });
      fireEvent.click(saveButton);
      updateAnnouncement.mockResolvedValueOnce({
        status: 400,
      });
      fireEvent.click(saveButton);
    });
  });

  test("Testing modalClose", () => {
    useLocalizationStore.mockReturnValue({
      data: {},
      isLoading: false,
    });
    renderComponent();

    fireEvent.click(screen.getByText("ANC_ADD_ANNOUNCEMENT"));
    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);
  });

  test("create Announcement Flow", () => {
    useLocalizationStore.mockReturnValue({
      data: {},
      isLoading: false,
    });
    renderComponent();
    fireEvent.click(screen.getByText("ANC_ADD_ANNOUNCEMENT"));

    const englishTitleInput = screen.getByLabelText("English", {
      selector: 'input[id="outlined-title-en"]',
    });
    fireEvent.change(englishTitleInput, { target: { value: "Testing Title" } });

    const hindiTitleInput = screen.getByLabelText("हिन्दी", {
      selector: 'input[id="outlined-title-hi"]',
    });
    fireEvent.change(hindiTitleInput, { target: { value: "Testing Title" } });

    const englishTextInput = screen.getByLabelText("English", {
      selector: 'textarea[id="outlined-text-en"]',
    });
    fireEvent.change(englishTextInput, {
      target: { value: "Testing Announcemenet" },
    });

    const hindiTextInput = screen.getByLabelText("हिन्दी", {
      selector: 'textarea[id="outlined-text-hi"]',
    });
    fireEvent.change(hindiTextInput, {
      target: { value: "Testing Announcemenet" },
    });

    const contactInput = screen.getByPlaceholderText("98XXXXXXXX");
    fireEvent.change(contactInput, {
      target: { value: "9868586949" },
    });
    fireEvent.blur(contactInput);

    const urlInput = screen.getByPlaceholderText("https://url.in");
    fireEvent.change(urlInput, {
      target: { value: "https://www.google.in" },
    });

    const statusSwitch = screen.getByRole("checkbox");
    fireEvent.click(statusSwitch);

    const newLaunchedLabel = screen.getByLabelText("ANC_NEW_LAUNCHED");
    fireEvent.click(newLaunchedLabel);

    const previewButtons = screen.getByTestId("preview-lang");
    fireEvent.click(previewButtons);

    const saveButton = screen.getByText("COMMON_SAVE");
    createAnnouncement.mockResolvedValueOnce({
      status: 400,
    });
    fireEvent.click(saveButton);

    createAnnouncement.mockResolvedValueOnce({
      status: 200,
      data: { Announcements: mockAnnouncements },
    });
    fireEvent.click(saveButton);
  });
});
