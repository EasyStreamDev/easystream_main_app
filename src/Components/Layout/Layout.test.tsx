import React from "react";
import { render } from "@testing-library/react";
import Layout from "./Layout";

describe("Layout", () => {
  test("renders without error", () => {
    render(<Layout />);
  });
});
