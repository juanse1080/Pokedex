import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from "../Popover";
import { Button } from "@/atoms/Button";

describe("Popover", () => {
  it("should render trigger button", () => {
    render(
      <Popover trigger={<Button>Open</Button>}>
        <div>Content</div>
      </Popover>
    );
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });

  it("should not show panel initially", () => {
    render(
      <Popover trigger={<Button>Open</Button>}>
        <div>Content</div>
      </Popover>
    );
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("should show panel when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<Button>Open</Button>}>
        <div>Content</div>
      </Popover>
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("should close panel when trigger is clicked again", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<Button>Open</Button>}>
        <div>Content</div>
      </Popover>
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    expect(screen.getByText("Content")).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("should close panel when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<Button>Open</Button>}>
        <div>Content</div>
      </Popover>
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    expect(screen.getByText("Content")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("should render title when provided", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<Button>Open</Button>} title="Popover Title">
        <div>Content</div>
      </Popover>
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);

    expect(screen.getByText("Popover Title")).toBeInTheDocument();
  });

  it("should have correct aria attributes when open", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<Button>Open</Button>}>
        <div>Content</div>
      </Popover>
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("should close when closeOnSelect is true and content is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<Button>Open</Button>} closeOnSelect>
        <button>Action</button>
      </Popover>
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);

    const actionButton = screen.getByRole("button", { name: "Action" });
    await user.click(actionButton);

    expect(screen.queryByRole("button", { name: "Action" })).not.toBeInTheDocument();
  });

  it("should not close when closeOnSelect is false and content is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<Button>Open</Button>} closeOnSelect={false}>
        <button>Action</button>
      </Popover>
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);

    const actionButton = screen.getByRole("button", { name: "Action" });
    await user.click(actionButton);

    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("should support align prop", () => {
    const { container } = render(
      <Popover trigger={<Button>Open</Button>} align="right">
        <div>Content</div>
      </Popover>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("right");
  });
});

