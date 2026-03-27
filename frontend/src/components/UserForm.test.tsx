import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import UserForm from "./UserForm";

describe("UserForm", () => {
  it("should display empty fields when no initialValues are provided", () => {
    render(
      <UserForm
        onSubmit={() => {}}
        onCancel={() => {}}
        loading={false}
        error=""
      />
    );

    expect(screen.getByPlaceholderText("Max")).toHaveValue("");
    expect(screen.getByPlaceholderText("Mustermann")).toHaveValue("");
    expect(screen.getByPlaceholderText("m.must@test.com")).toHaveValue("");
  });

  it("should display initialValues when provided", () => {
    render(
      <UserForm
        initialValues={{
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
          actions: ["create-item", "view-item"],
        }}
        onSubmit={() => {}}
        onCancel={() => {}}
        loading={false}
        error=""
      />
    );

    expect(screen.getByPlaceholderText("Max")).toHaveValue("John");
    expect(screen.getByPlaceholderText("Mustermann")).toHaveValue("Doe");
    expect(screen.getByPlaceholderText("m.must@test.com")).toHaveValue("john@example.com");

    expect(screen.getByLabelText("Create Item")).toBeChecked();
    expect(screen.getByLabelText("View Item")).toBeChecked();
    expect(screen.getByLabelText("Delete Item")).not.toBeChecked();
  });

  it("should update input fields", async () => {
    render(
      <UserForm
        onSubmit={() => {}}
        onCancel={() => {}}
        loading={false}
        error=""
      />
    );

    await userEvent.type(screen.getByPlaceholderText("Max"), "Alice");
    await userEvent.type(screen.getByPlaceholderText("Mustermann"), "Smith");
    await userEvent.type(screen.getByPlaceholderText("m.must@test.com"), "alice@test.com");

    expect(screen.getByPlaceholderText("Max")).toHaveValue("Alice");
    expect(screen.getByPlaceholderText("Mustermann")).toHaveValue("Smith");
    expect(screen.getByPlaceholderText("m.must@test.com")).toHaveValue("alice@test.com");
  });

  it("should toggle actions checkboxes", async () => {
    render(
      <UserForm
        onSubmit={() => {}}
        onCancel={() => {}}
        loading={false}
        error=""
      />
    );

    const create = screen.getByLabelText("Create Item");
    const deleteItem = screen.getByLabelText("Delete Item");

    expect(create).not.toBeChecked();
    await userEvent.click(create);
    expect(create).toBeChecked();

    await userEvent.click(deleteItem);
    expect(deleteItem).toBeChecked();

    // toggle off
    await userEvent.click(create);
    expect(create).not.toBeChecked();
  });

  it("should call onSubmit with correct data", async () => {
    const onSubmit = vi.fn();

    render(
      <UserForm
        onSubmit={onSubmit}
        onCancel={() => {}}
        loading={false}
        error=""
      />
    );

    await userEvent.type(screen.getByPlaceholderText("Max"), "Alice");
    await userEvent.type(screen.getByPlaceholderText("Mustermann"), "Smith");
    await userEvent.type(screen.getByPlaceholderText("m.must@test.com"), "alice@test.com");
    await userEvent.click(screen.getByLabelText("Create Item"));

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(onSubmit).toHaveBeenCalledWith({
      firstname: "Alice",
      lastname: "Smith",
      email: "alice@test.com",
      actions: ["create-item"],
    });
  });

  it("should call onCancel when cancel button is clicked", async () => {
    const onCancel = vi.fn();

    render(
      <UserForm
        onSubmit={() => {}}
        onCancel={onCancel}
        loading={false}
        error=""
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("should disable submit button when loading", () => {
    render(
      <UserForm
        onSubmit={() => {}}
        onCancel={() => {}}
        loading={true}
        error=""
      />
    );

    const submitButton = screen.getByRole("button", { name: "Saving" });
    expect(submitButton).toBeDisabled();
  });

  it("should show error message when error prop is provided", () => {
    render(
      <UserForm
        onSubmit={() => {}}
        onCancel={() => {}}
        loading={false}
        error="Something went wrong"
      />
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
