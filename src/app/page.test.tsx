import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("@/app/actions", () => ({ signInWithGitHub: vi.fn() }));

describe("Home", () => {
  it("mostra o nome do produto e o botão de login", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "R2 Tech Center" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar com GitHub" })).toBeInTheDocument();
  });
});
