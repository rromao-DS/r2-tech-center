import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("mostra o nome do produto", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "R2 Tech Center" })).toBeInTheDocument();
  });
});
