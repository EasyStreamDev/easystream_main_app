import React from 'react'
import { render, unmountComponentAtNode } from "react-dom";
import { Subtitles } from '../Subtitles/Subtitles';
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

it("Testing Subtitles", () => {
	act(() => {
		render(<Subtitles />, container);
	});
});
