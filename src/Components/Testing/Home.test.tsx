import React from 'react'
import { render, unmountComponentAtNode } from "react-dom";
import { Home } from '../Home/Home';
import { act } from "react-dom/test-utils";
import { HashRouter as Router } from 'react-router-dom';

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

it("Testing Home", () => {
	act(() => {
		render(
      <Router>
        <Home />
      </Router>
    , container);
	});
});
