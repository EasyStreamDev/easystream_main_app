import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import Unauthorized from "./Unauthorized";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("Unauthorized", () => {
  beforeEach(() => {
    useNavigate.mockClear();
  });

  test("renders unauthorized message", () => {
    render(<Unauthorized />);
    expect(screen.getByText("Unauthorized")).toBeInTheDocument();
    expect(
      screen.getByText("You do not have access to the requested page.")
    ).toBeInTheDocument();
    expect(screen.getByText("Upgrade your subscription to access it.")).toBeInTheDocument();
  });
});
