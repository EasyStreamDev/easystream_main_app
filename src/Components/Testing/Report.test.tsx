import React from 'react'
import { render, unmountComponentAtNode } from "react-dom";
import { Report } from '../Report/Report';
import { act } from "react-dom/test-utils";

let container: any = null;
beforeEach(() => {
  // met en place un élément DOM comme cible de rendu
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // nettoie en sortie de test
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("Testing Report", () => {
	act(() => {
		render(<Report />, container);
	});
	expect(container.textContent).toBe(" Report");
});
