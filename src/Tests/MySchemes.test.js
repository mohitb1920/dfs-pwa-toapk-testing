import { render, screen } from "@testing-library/react";
import MySchemes from "../pages/Schemes/MySchemes";

describe("My Schemes Tests", () => {
  test("render my schemes", () => {
    render(<MySchemes />);
  });
});
