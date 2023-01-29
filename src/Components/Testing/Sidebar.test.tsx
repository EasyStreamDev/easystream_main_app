import React from 'react'
import { render, unmountComponentAtNode } from "react-dom";
import { Sidebar } from '../Sidebar/Sidebar';
import { SidebarData } from '../Sidebar/SidebarData';
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

it("Home is correctly redirecting to home", () => {
  expect(SidebarData[0].path).toBe("/");
})

//

it("Audio is correctly redirecting to children elem", () => {
  expect(SidebarData[1].path).toBe("#");
})

//

it("Video is correctly redirecting to children elem", () => {
  expect(SidebarData[2].path).toBe("#");
})

//

it("Scenes is correctly redirecting to children elem", () => {
  expect(SidebarData[3].path).toBe("#");
})
