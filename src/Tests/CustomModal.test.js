import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import CustomModal from "../components/CustomModal";

const store = configureStore({
  reducer: rootReducer,
});

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <CustomModal
          handleModalClose={() => {}}
          open={true}
          dialogHeader={"Test Header"}
          maxWidth={"md"}
        >
          <div>Hello!</div>
        </CustomModal>
      </Provider>
    </MemoryRouter>
  );
};

describe("CarousalManagement Page", () => {
  test("renders CustomModal component", () => {
    renderComponent();
  });
  test("testing closeModal action", () => {
    renderComponent();

    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);
  });
});
