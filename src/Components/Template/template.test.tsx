import React from "react";
import { render } from "@testing-library/react";
import { Template } from "./template";

describe("Template", () => {
  it("renders the template page", () => {
    const { getByText } = render(<Template />);
    const headingElement = getByText("Template");
    expect(headingElement).toBeInTheDocument();
  });
});
