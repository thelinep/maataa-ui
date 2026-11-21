import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders nothing when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders its children when isOpen is true", () => {
    render(
      <Modal isOpen onClose={() => {}}>
        Content
      </Modal>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders a title when provided", () => {
    render(
      <Modal isOpen onClose={() => {}} title="Settings">
        Content
      </Modal>
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders a footer when provided", () => {
    render(
      <Modal isOpen onClose={() => {}} footer={<span>Footer</span>}>
        Content
      </Modal>
    );
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={onClose} title="Settings">
        Content
      </Modal>
    );
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("hides the close button when closeButton is false", () => {
    render(
      <Modal isOpen onClose={() => {}} title="Settings" closeButton={false}>
        Content
      </Modal>
    );
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("calls onClose when the overlay is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={onClose}>
        Content
      </Modal>
    );
    // Content wrapper div -> dialog box div -> overlay div
    const contentWrapper = screen.getByText("Content");
    const dialogBox = contentWrapper.parentElement!;
    const overlay = dialogBox.parentElement!;
    await user.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it("does not call onClose when clicking inside the dialog content", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    await user.click(screen.getByText("Content"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it.each(["sm", "md", "lg"] as const)("renders the %s size without throwing", (size) => {
    render(
      <Modal isOpen onClose={() => {}} size={size}>
        Content
      </Modal>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

describe("Modal accessibility", () => {
  const Harness = ({ onClose = () => {} }: { onClose?: () => void }) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open</button>
        <Modal
          isOpen={open}
          onClose={() => {
            onClose();
            setOpen(false);
          }}
          title="Edit budget"
          footer={<button>Save</button>}
        >
          <input aria-label="Name" />
        </Modal>
      </>
    );
  };

  it("is a modal dialog labelled by its title", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = screen.getByRole("dialog", { name: "Edit budget" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("moves focus into the dialog when it opens", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toContainElement(document.activeElement as HTMLElement);
  });

  it("closes on Escape and returns focus to the opener", async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const opener = screen.getByRole("button", { name: "Open" });
    await userEvent.click(opener);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("keeps Tab focus inside the dialog", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = screen.getByRole("dialog");
    for (let i = 0; i < 5; i++) {
      await userEvent.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    for (let i = 0; i < 5; i++) {
      await userEvent.tab({ shift: true });
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });

  it("restores the previous body overflow when closed", async () => {
    document.body.style.overflow = "scroll";
    const { rerender } = render(
      <Modal isOpen onClose={() => {}}>
        x
      </Modal>
    );
    expect(document.body.style.overflow).toBe("hidden");
    rerender(
      <Modal isOpen={false} onClose={() => {}}>
        x
      </Modal>
    );
    expect(document.body.style.overflow).toBe("scroll");
    document.body.style.overflow = "";
  });

  it("is named by ariaLabel when there is no title", () => {
    render(
      <Modal isOpen onClose={() => {}} ariaLabel="Crop photo">
        <p>Body</p>
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: "Crop photo" })).toBeInTheDocument();
  });

  it("still has a name when neither title nor ariaLabel is given", () => {
    render(
      <Modal isOpen onClose={() => {}}>
        <p>Body</p>
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: "Dialog" })).toBeInTheDocument();
  });

  it("prefers the title over ariaLabel", () => {
    render(
      <Modal isOpen onClose={() => {}} title="Edit project" ariaLabel="Ignored">
        <p>Body</p>
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: "Edit project" })).toBeInTheDocument();
  });

  it("gives the close button a 44px touch target", () => {
    render(
      <Modal isOpen onClose={() => {}} title="T">
        <p>Body</p>
      </Modal>
    );
    const close = screen.getByRole("button", { name: "Close" });
    expect(close.style.width).toBe("44px");
    expect(close.style.height).toBe("44px");
  });

  it("turns its animations off for reduced motion", () => {
    const { container } = render(
      <Modal isOpen onClose={() => {}} title="T">
        <p>Body</p>
      </Modal>
    );
    expect(container.ownerDocument.querySelector("style")?.textContent).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*animation: none !important/
    );
  });
});
