import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App"; // Adjust the path if needed
import { Home } from "./components/Home";
import { Information } from "./components/Information";

// Mock components
jest.mock("./components/Home", () => ({
  Home: () => <div data-testid="home-component">Home Component</div>,
}));

jest.mock("./components/Information", () => ({
  Information: () => <div data-testid="information-component">Information Component</div>,
}));

describe("App Component", () => {
  const renderWithRouter = (initialPath = "/") => {
    window.history.pushState({}, "Test page", initialPath);
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  };

  test("should always display the title and buttons", () => {
    renderWithRouter();

    expect(screen.getByText("My App")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Information")).toBeInTheDocument();
  });

  test("should display the Home component when on the home page", () => {
    renderWithRouter("/");

    expect(screen.getByTestId("home-component")).toBeInTheDocument();
    expect(screen.queryByTestId("information-component")).not.toBeInTheDocument();
  });

  test("should display the Information component when on the information page", () => {
    renderWithRouter("/information");

    expect(screen.getByTestId("information-component")).toBeInTheDocument();
    expect(screen.queryByTestId("home-component")).not.toBeInTheDocument();
  });

  test("should update the URL path when buttons are clicked", () => {
    renderWithRouter();

    const homeButton = screen.getByText("Home");
    const informationButton = screen.getByText("Information");

    fireEvent.click(informationButton);
    expect(window.location.pathname).toBe("/information");
    expect(screen.getByTestId("information-component")).toBeInTheDocument();

    fireEvent.click(homeButton);
    expect(window.location.pathname).toBe("/");
    expect(screen.getByTestId("home-component")).toBeInTheDocument();
  });

  test("should show nothing on the screen for an undefined path", () => {
    renderWithRouter("/undefined-path");

    expect(screen.queryByTestId("home-component")).not.toBeInTheDocument();
    expect(screen.queryByTestId("information-component")).not.toBeInTheDocument();
  });
});
