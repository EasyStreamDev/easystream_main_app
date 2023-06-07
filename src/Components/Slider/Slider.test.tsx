import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CustomizedSlider from "./Slider";

describe("CustomizedSlider", () => {
  const mockSendData = jest.fn();
  const mockSendActive = jest.fn();

  beforeEach(() => {
    mockSendData.mockClear();
    mockSendActive.mockClear();
  });

  test("renders the component with correct props", () => {
    const props = {
      name: "Micro",
      value: 50,
      isActive: true,
      sendData: mockSendData,
      sendActive: mockSendActive,
    };

    const { getByText, getByLabelText } = render(<CustomizedSlider {...props} />);

    const nameElement = getByText("Micro");
    expect(nameElement).toBeInTheDocument();

    const sliderElement = getByLabelText("Micro");
    expect(sliderElement).toBeInTheDocument();
  });
});
