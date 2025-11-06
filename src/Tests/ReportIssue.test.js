import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ReportIssue from "../AppModules/GRM9/ReportIssue";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import { MdmsService } from "../services/MDMS";
import userEvent from "@testing-library/user-event";
import { mockTechSupportMDMSResponse } from "../components/MockData";

jest.mock("../services/MDMS");

const renderComponent = (loggedIn) => {
  return render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <ReportIssue loading={false} />
      </I18nextProvider>
    </MemoryRouter>
  );
};

describe("Report issue Page", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  test("renders Report Issue Page", () => {
    renderComponent();
  });
  test("Testing User Change", () => {
    renderComponent();
    const farmerSection = screen.getByText("SUPPORT_FARMER");
    fireEvent.click(farmerSection);
    const dbtOptions = screen.getByLabelText("COMMON_YES");
    expect(dbtOptions).toBeInTheDocument();

    const govtOffcialSection = screen.getByText("SUPPORT_GOVT_OFFICIAL");
    fireEvent.click(govtOffcialSection);
    const emailInput = screen.getByPlaceholderText("COMMON_ENTER_MAIL_ID");
    expect(emailInput).toBeInTheDocument();
    fireEvent.change(emailInput, {
      target: { value: "testemail@mail.com" },
    });
  });
  test("Testing Report Issue Form", async () => {
    MdmsService.getTechSupportDropdownOptions.mockResolvedValueOnce({
      status: 200,
      "RAINMAKER-PGR": mockTechSupportMDMSResponse,
    });
    const handleCategoryChange = jest.fn();
    renderComponent(handleCategoryChange);
    await waitFor(() => {
      expect(MdmsService.getTechSupportDropdownOptions).toHaveBeenCalledTimes(
        1
      );
    });
    const previewButton = screen.getByText("COMMON_PREVIEW");
    fireEvent.click(previewButton);
    const nameError = screen.getByText("COMMON_NAME_VALIDATION_ERROR");
    expect(nameError).toBeInTheDocument();
    const contactError = screen.getByText("COMMON_MOBILE_VALIDATION_ERROR");
    expect(contactError).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText("COMMON_ENTER_FULLNAME");
    fireEvent.change(nameInput, {
      target: { value: "Jane Doe" },
    });
    const contactInput = screen.getByPlaceholderText(
      "COMMON_ENTER_MOBILE_NUMBER"
    );
    fireEvent.change(contactInput, {
      target: { value: "a" },
    });
    fireEvent.change(contactInput, {
      target: { value: "9876543210" },
    });
    const dbtYesOption = screen.getByLabelText("COMMON_YES");
    fireEvent.click(dbtYesOption);
    const dbtInput = screen.getByPlaceholderText("ENTER_DBT_NUMBER");
    expect(dbtInput).toBeInTheDocument();
    fireEvent.change(dbtInput, {
      target: { value: "9876543210544" },
    });
    const inputElements = screen.getAllByPlaceholderText("COMMON_SELECT");
    userEvent.click(inputElements[0]);

    const option1 = await screen.findByText("App Functionality Issues");
    const option2 = await screen.findByText("User Interface (UI) Issues");
    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();

    const descriptionInput = screen.getByPlaceholderText("WRITE_IN_BRIEF");
    fireEvent.change(descriptionInput, {
      target: { value: "Grievance Description" },
    });
    fireEvent.click(previewButton);
  });
});
