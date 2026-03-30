import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteUser, getAllUsers, generateSampleUser } from "@/api/users";
import UsersList from "./UsersList";

vi.mock("@/api/users", () => ({
  getAllUsers: vi.fn(),
  deleteUser: vi.fn(),
  generateSampleUser: vi.fn(),
}));

vi.mock("@/components/Modal", () => ({
  default: ({ title, children }: any) => (
    <div data-testid="modal">
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

vi.mock("@/components/IconButton", () => ({
  default: ({ onClick, tooltip, children }: any) => (
    <button onClick={onClick} title={tooltip}>
      {children}
    </button>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const mockUsers = [
  {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    email: "john@example.com",
    actions: ["create-item"],
  },
  {
    id: 2,
    firstname: "Alice",
    lastname: "Smith",
    email: "alice@example.com",
    actions: ["view-item"],
  },
];

describe("UsersList", () => {
it("should generate a sample user when clicking 'Click here'", async () => {
  (getAllUsers as any).mockResolvedValue([]);        
  (generateSampleUser as any).mockResolvedValue({}); 
  render(<UsersList />);

// Wait for loading to finish
  await waitFor(() =>
    expect(screen.queryByText("Loading users...")).not.toBeInTheDocument()
  );
  await screen.findByText(/No users yet/i);

  // Click the link
  await userEvent.click(screen.getByText("Click here"));

  expect(generateSampleUser).toHaveBeenCalled();
});

  it("should load state initially", () => {
    (getAllUsers as any).mockResolvedValue([]);

    render(<UsersList />);

    expect(screen.getByText("Loading users...")).toBeInTheDocument();
  });

  it("should render users after fetch", async () => {
    (getAllUsers as any).mockResolvedValue(mockUsers);

    render(<UsersList />);

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
  });

  it("should show error message when fetch fails", async () => {
    (getAllUsers as any).mockRejectedValue(new Error("fail"));

    render(<UsersList />);

    expect(await screen.findByText("Failed to load users.")).toBeInTheDocument();
  });

  it("should open Create User modal", async () => {
    (getAllUsers as any).mockResolvedValue([]);

    render(<UsersList />);

    await userEvent.click(screen.getByRole("button", { name: "Create" }));

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Create User")).toBeInTheDocument();
  });

  it("should open Edit User modal", async () => {
    (getAllUsers as any).mockResolvedValue(mockUsers);

    render(<UsersList />);

    const editButtons = await screen.findAllByTitle("Edit");
    await userEvent.click(editButtons[0]);

    expect(screen.getByText("Edit User")).toBeInTheDocument();
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("should open View User modal", async () => {
    (getAllUsers as any).mockResolvedValue(mockUsers);

    render(<UsersList />);

    const viewButtons = await screen.findAllByTitle("View");
    await userEvent.click(viewButtons[1]);

    expect(screen.getByText("View User")).toBeInTheDocument();
  });

  it("should open Run Action modal", async () => {
    (getAllUsers as any).mockResolvedValue(mockUsers);

    render(<UsersList />);

    const actionButtons = await screen.findAllByTitle("Run Action");
    await userEvent.click(actionButtons[0]);

    expect(screen.getByText("Run Action")).toBeInTheDocument();
  });

  it("should delete a user after confirmation", async () => {
    (getAllUsers as any).mockResolvedValue(mockUsers);
    (deleteUser as any).mockResolvedValue({});

    vi.stubGlobal(
      "confirm",
      vi.fn(() => true)
    );

    render(<UsersList />);

    const deleteButtons = await screen.findAllByTitle("Delete");
    await userEvent.click(deleteButtons[0]);

    expect(deleteUser).toHaveBeenCalledWith(1);
  });

  it("should not delete user if confirmation is cancelled", async () => {
    (getAllUsers as any).mockResolvedValue(mockUsers);

    vi.stubGlobal(
      "confirm",
      vi.fn(() => false)
    );

    render(<UsersList />);

    const deleteButtons = await screen.findAllByTitle("Delete");
    await userEvent.click(deleteButtons[0]);

    expect(deleteUser).not.toHaveBeenCalled();
  });
});
