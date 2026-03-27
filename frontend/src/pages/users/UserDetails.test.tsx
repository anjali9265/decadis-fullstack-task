import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ViewUser from "./UserDetails";
import type { UserDetailsProps } from "../../types";

const mockUser: UserDetailsProps["user"] = {
  id: 1,
  firstname: "John",
  lastname: "Doe",
  email: "john@example.com",
  actions: ["create-item", "view-item"],
};

describe("ViewUser", () => {
  it("should display user details correctly", () => {
    render(<ViewUser user={mockUser} />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("should display all user actions as tags", () => {
    render(<ViewUser user={mockUser} />);

    expect(screen.getByText("create-item")).toBeInTheDocument();
    expect(screen.getByText("view-item")).toBeInTheDocument();

    expect(screen.queryByText("No actions assigned")).not.toBeInTheDocument();
  });

  it("should show fallback message when user has no actions", () => {
    const userWithoutActions = {
      ...mockUser,
      actions: [],
    };

    render(<ViewUser user={userWithoutActions} />);

    expect(screen.getByText("No actions assigned")).toBeInTheDocument();
  });
});
