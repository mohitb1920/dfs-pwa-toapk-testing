import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import axios from "axios";
import AnnouncementConfigurator from "../pages/Announcements/AnnouncementConfigurator";
import { useTranslation } from "react-i18next";

jest.mock("axios");

const store = configureStore({
  reducer: rootReducer,
});

const renderComponent = (props) => {
  const {
    mode = "create",
    selectedAnnouncement = {
      title: { en: "", hi: "" },
      announcement: { en: "", hi: "" },
      contact: "",
      url: "",
      status: false,
      type: "INFORMATION",
    },
  } = props;
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <AnnouncementConfigurator
          onSaveClick={() => {}}
          mode={mode}
          selectedAnnouncement={selectedAnnouncement}
        />
      </Provider>
    </MemoryRouter>
  );
};

describe("CarousalManagement Page", () => {
  test("renders AnnouncementConfiguration modal", () => {
    renderComponent({ mode: "create" });
  });

  test("test Mobile Input Validation", async () => {
    renderComponent({ mode: "create" });
    const contactInput = screen.getByPlaceholderText("98XXXXXXXX");
    fireEvent.change(contactInput, {
        target: { value: "a" },
      });
    fireEvent.change(contactInput, {
      target: { value: "986858" },
    });
    fireEvent.blur(contactInput);
    const contactError = await screen.findByText(
      "COMMON_MOBILE_VALIDATION_ERROR"
    );
    expect(contactError).toBeInTheDocument();
  });
});
