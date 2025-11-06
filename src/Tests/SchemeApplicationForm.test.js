import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SchemeApplicationForm from "../pages/Schemes/SchemeApplicationForm";

const renderComponent = (state) => {
  return render(
    <MemoryRouter>
      <SchemeApplicationForm />
    </MemoryRouter>,
    state
  );
};

describe("Scheme Application Form", () => {
  test("renders schemes application form", () => {
    renderComponent({});
  });

  test("Testing save and back buttons", () => {
    renderComponent();
    const saveButton = screen.getByTestId("save-button");
    fireEvent.click(saveButton);
  });

  test("Testing Close Icon", () => {
    renderComponent();
    const closeIcon = screen.getByTestId("HighlightOffOutlinedIcon");
    fireEvent.click(closeIcon);
  });
});
