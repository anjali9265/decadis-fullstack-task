import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import RunActionForm from "./RunAction";
import { runAction } from "../../api/users";
import type { RunActionProps } from "../../types";

vi.mock("../../api/users", () => ({
  runAction: vi.fn(),
}));

const mockUser: RunActionProps["user"] = {
  id: 1,
  firstname: "John",
  lastname: "Doe",
  email: "john@example.com",
  actions: ["create-item"],
};

describe("RunActionForm", () => {
  it("should show all actions in the dropdown", () => {
    render(<RunActionForm user={mockUser} onCancel={() => {}} />);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4);

    expect(screen.getByRole("option", { name: "Create Item" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Delete Item" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "View Item" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Move Item" })).toBeInTheDocument();
  });

  it("should disable Run button when no action is selected", () => {
    render(<RunActionForm user={mockUser} onCancel={() => {}} />);

    expect(screen.getByRole("button", { name: "Run" })).toBeDisabled();
  });

  it("should enable Run button when an action is selected", async () => {
    render(<RunActionForm user={mockUser} onCancel={() => {}} />);

    // Select by VALUE, not label
    await userEvent.selectOptions(screen.getByRole("combobox"), "delete-item");

    expect(screen.getByRole("button", { name: "Run" })).toBeEnabled();
  });

  it("should call runAction and show success message", async () => {
    (runAction as any).mockResolvedValueOnce({
      status: 200,
      data: { message: "Action executed successfully" },
    });

    render(<RunActionForm user={mockUser} onCancel={() => {}} />);

    await userEvent.selectOptions(screen.getByRole("combobox"), "view-item");
    await userEvent.click(screen.getByRole("button", { name: "Run" }));

    expect(runAction).toHaveBeenCalledWith(1, "view-item");

    expect(await screen.findByText("Action executed successfully")).toBeInTheDocument();
  });

  it("should show error message when API returns 400", async () => {
    (runAction as any).mockResolvedValueOnce({
      status: 400,
      data: { error: "Invalid action" },
    });

    render(<RunActionForm user={mockUser} onCancel={() => {}} />);

    await userEvent.selectOptions(screen.getByRole("combobox"), "move-item");
    await userEvent.click(screen.getByRole("button", { name: "Run" }));

    expect(await screen.findByText("Invalid action")).toBeInTheDocument();
  });

  it("should show fallback error message when API throws error", async () => {
    (runAction as any).mockRejectedValueOnce(new Error("fail"));

    render(<RunActionForm user={mockUser} onCancel={() => {}} />);

    await userEvent.selectOptions(screen.getByRole("combobox"), "create-item");
    await userEvent.click(screen.getByRole("button", { name: "Run" }));

    expect(await screen.findByText("Running action failed.")).toBeInTheDocument();
  });

  it("should show loading state while running", async () => {
    let resolvePromise: (value?: unknown) => void;

    (runAction as any).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    render(<RunActionForm user={mockUser} onCancel={() => {}} />);

    await userEvent.selectOptions(screen.getByRole("combobox"), "delete-item");
    await userEvent.click(screen.getByRole("button", { name: "Run" }));

    expect(screen.getByRole("button", { name: "Running" })).toBeDisabled();

    resolvePromise!();
  });

  it("should call onCancel when Cancel button is clicked", async () => {
    const onCancel = vi.fn();

    render(<RunActionForm user={mockUser} onCancel={onCancel} />);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalled();
  });
});
