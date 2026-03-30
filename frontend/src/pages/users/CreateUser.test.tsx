import { createUser } from "@/api/users";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, type Mock } from "vitest";
import CreateUserForm from "./CreateUser";

vi.mock("@/api/users", () => ({
  createUser: vi.fn(),
}));

describe("CreateUserForm", () => {
  it("should show an error when required fields are missing", async () => {
    render(<CreateUserForm onSuccess={() => {}} onCancel={() => {}} />);

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("Firstname, lastname and email are required.")).toBeInTheDocument();
  });

  it("should call createUser with correct data and triggers onSuccess", async () => {
    const onSuccess = vi.fn();
    (createUser as Mock).mockResolvedValueOnce({});

    render(<CreateUserForm onSuccess={onSuccess} onCancel={() => {}} />);

    await userEvent.type(screen.getByPlaceholderText("Max"), "Alice");
    await userEvent.type(screen.getByPlaceholderText("Mustermann"), "Smith");
    await userEvent.type(screen.getByPlaceholderText("m.must@test.com"), "alice@test.com");
    await userEvent.click(screen.getByLabelText("Create Item"));

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(createUser).toHaveBeenCalledWith({
      firstname: "Alice",
      lastname: "Smith",
      email: "alice@test.com",
      actions: ["create-item"],
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it("should show an error when API call fails", async () => {
    (createUser as Mock).mockRejectedValueOnce(new Error("fail"));

    render(<CreateUserForm onSuccess={() => {}} onCancel={() => {}} />);

    await userEvent.type(screen.getByPlaceholderText("Max"), "Alice");
    await userEvent.type(screen.getByPlaceholderText("Mustermann"), "Smith");
    await userEvent.type(screen.getByPlaceholderText("m.must@test.com"), "alice@test.com");

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("User creation failed")).toBeInTheDocument();
  });

  it("should disable submit button while loading", async () => {
    const onSuccess = vi.fn();

    let resolvePromise: (value?: unknown) => void;
    (createUser as Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    render(<CreateUserForm onSuccess={onSuccess} onCancel={() => {}} />);

    await userEvent.type(screen.getByPlaceholderText("Max"), "Alice");
    await userEvent.type(screen.getByPlaceholderText("Mustermann"), "Smith");
    await userEvent.type(screen.getByPlaceholderText("m.must@test.com"), "alice@test.com");

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    const savingButton = screen.getByRole("button", { name: "Saving" });
    expect(savingButton).toBeDisabled();

    resolvePromise!();
  });
});
