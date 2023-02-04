import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";
import Link from "../Link";
import ToggleFlag from "../ToggleFlag";

test("renders the react logo", () => {
  render(<App />);
  const imgLogo = screen.getByRole("img");
  const src = imgLogo.getAttribute("src");
  expect(src).toBeDefined();
});

test("render Link component", () => {
  render(<Link />);
  const anchor = screen.getByText("Aprende react");
  expect(anchor).toBeInTheDocument();
});

test("render Link component with react url", () => {
  render(<Link />);
  const anchor = screen.getByRole("link");
  const url = anchor.getAttribute("href");
  expect(url).toEqual("https://reactjs.org");
});

test("render toggle", () => {
  render(<ToggleFlag />);
  const text = screen.getByText("Activar toggle");
  expect(text).toBeInTheDocument();
});

test("render ", () => {
  render(<ToggleFlag />);

  const text = screen.getByLabelText("Activar toggle");
  expect(text).toBeInTheDocument();
  fireEvent.click(text);
  const text2 = screen.getByLabelText("Desactivar toggle");
  expect(text2).toBeInTheDocument();
});
