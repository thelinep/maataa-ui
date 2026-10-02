import React from "react";

export interface SnapshotProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  onSnapshot?: () => void;
}

export function Snapshot({ onSnapshot, children = "Save snapshot", ...props }: SnapshotProps) {
  return (
    <button type="button" {...props} onClick={onSnapshot}>
      {children}
    </button>
  );
}
