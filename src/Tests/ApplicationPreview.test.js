import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ApplicationPreview from "../pages/Schemes/SchemeForm/ApplicationPreview";

const renderComponent = (state) => {
  return render(
    <MemoryRouter>
      <ApplicationPreview setActiveStep={() => {}} formData={{}} />
    </MemoryRouter>,
    state
  );
};

describe("Scheme Application Form", () => {
  test("renders schemes application form", () => {
    renderComponent({});
  });

  test("Testing Edit button", () => {
    renderComponent();
    const saveButton = screen.getByTestId("edit-button");
    fireEvent.click(saveButton);
  });
});
