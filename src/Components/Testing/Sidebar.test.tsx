import React from 'react'
import { render, unmountComponentAtNode } from "react-dom";
import { Sidebar } from '../Sidebar/Sidebar';
import { SidebarData } from '../Sidebar/SidebarData';
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from 'react-router-dom';

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

it("Testing Sidebar Data", () => {
	expect(SidebarData).toHaveLength(5);
});

it("Home is correctly redirecting to home", () => {
  expect(SidebarData[0].path).toBe("/");
})

//

it("Audio is correctly redirecting to children elem", () => {
  expect(SidebarData[1].path).toBe("#");
})

it("Audio/General redirect to the good path", () => {
  expect(SidebarData[1].subNav?.length).toBeGreaterThan(1);
  expect(SidebarData[1].subNav[0].path).toBe("/audio/general");
})

it("Audio/Mic Level redirect to the good path", () => {
  expect(SidebarData[1].subNav?.length).toBeGreaterThan(1);
  expect(SidebarData[1].subNav[1].path).toBe("/audio/mics-level");
})

//

it("Video is correctly redirecting to children elem", () => {
  expect(SidebarData[2].path).toBe("#");
})

it("Video/General redirect to the good path", () => {
  expect(SidebarData[2].subNav?.length).toBeGreaterThan(1);
  expect(SidebarData[2].subNav[0].path).toBe("/video/general");
})

it("Video/Video Level redirect to the good path", () => {
  expect(SidebarData[2].subNav?.length).toBeGreaterThan(1);
  expect(SidebarData[2].subNav[1].path).toBe("/video/mic-level");
})

//

it("Scenes is correctly redirecting to children elem", () => {
  expect(SidebarData[3].path).toBe("#");
})

it("Secenes/General redirect to the good path", () => {
  expect(SidebarData[3].subNav?.length).toBeGreaterThan(1);
  expect(SidebarData[3].subNav[0].path).toBe("/scenes/general");
})

it("Secenes/Scenes Level redirect to the good path", () => {
  expect(SidebarData[3].subNav?.length).toBeGreaterThan(1);
  expect(SidebarData[3].subNav[1].path).toBe("/scenes/mic-level");
})

//

it("Events is correctly redirecting to children elem", () => {
  expect(SidebarData[4].path).toBe("#");
})

it("Events/Generate Event Level redirect to the good path", () => {
  expect(SidebarData[4].subNav?.length).toBeGreaterThan(1);
  expect(SidebarData[4].subNav[0].path).toBe("/events/general");
})
