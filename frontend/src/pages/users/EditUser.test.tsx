import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import EditUserForm from "./EditUser";
import { updateUser } from "@/api/users";
import type { EditUserProps } from "@/types";

vi.mock("@/api/users", () => ({
  updateUser: vi.fn(),
}));

const mockUser: EditUserProps["user"] = {
  id: 1,
  firstname: "John",
  lastname: "Doe",
  email: "john@example.com",
  actions: ["create-item"],
};

describe("EditUserForm", () => {
  it("should display initial user values", () => {
    render(<EditUserForm user={mockUser} onSuccess={() => {}} onCancel={() => {}} />);

    expect(screen.getByPlaceholderText("Max")).toHaveValue("John");
    expect(screen.getByPlaceholderText("Mustermann")).toHaveValue("Doe");
    expect(screen.getByPlaceholderText("m.must@test.com")).toHaveValue("john@example.com");

    expect(screen.getByLabelText("Create Item")).toBeChecked();
  });

  it("should call updateUser with correct data and triggers onSuccess", async () => {
    const onSuccess = vi.fn();
    (updateUser as any).mockResolvedValueOnce({});

    render(<EditUserForm user={mockUser} onSuccess={onSuccess} onCancel={() => {}} />);

    await userEvent.clear(screen.getByPlaceholderText("Max"));
    await userEvent.type(screen.getByPlaceholderText("Max"), "Alice");

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(updateUser).toHaveBeenCalledWith(1, {
      firstname: "Alice",
      lastname: "Doe",
      email: "john@example.com",
      actions: ["create-item"],
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it("should show error when updateUser fails", async () => {
    (updateUser as any).mockRejectedValueOnce(new Error("fail"));

    render(<EditUserForm user={mockUser} onSuccess={() => {}} onCancel={() => {}} />);

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("User updation failed.")).toBeInTheDocument();
  });

  it("should disable submit button while loading", async () => {
    let resolvePromise: (value?: unknown) => void;

    (updateUser as any).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    render(<EditUserForm user={mockUser} onSuccess={() => {}} onCancel={() => {}} />);

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    const savingButton = screen.getByRole("button", { name: "Saving" });
    expect(savingButton).toBeDisabled();

    resolvePromise!();
  });

  it("should call onCancel when cancel button is clicked", async () => {
    const onCancel = vi.fn();

    render(<EditUserForm user={mockUser} onSuccess={() => {}} onCancel={onCancel} />);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalled();
  });
});
