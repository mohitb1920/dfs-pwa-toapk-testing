import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import ApplicationForm from "../pages/Schemes/SchemeForm/ApplicationRJSF";
import { personalInfoMockData } from "../components/MockData";

const store = configureStore({
  reducer: rootReducer,
});

describe("React Json Schema Form Test", () => {
  test("renders Form Component", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <ApplicationForm
            jsonSchema={personalInfoMockData}
            setApplicationFormData={() => {}}
            formData={{}}
            liveValidate={true}
          />
        </Provider>
      </MemoryRouter>
    );
    const textInputElements = screen.getAllByRole("textbox");
    expect(textInputElements.length).toBeGreaterThan(0);
    const textInputToInteractWith = textInputElements[0];
    fireEvent.change(textInputToInteractWith, {
      target: { value: "Shivamani" },
    });

    const datepickerelements = screen.getAllByPlaceholderText("DD MMMM, YYYY");
    expect(datepickerelements.length).toBeGreaterThan(0);
    const datepickerToInteractWith = datepickerelements[0];
    // console.log(datepickerToInteractWith);
    fireEvent.change(datepickerToInteractWith, "1996-06-20");
  });
});
