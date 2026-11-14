import { useEffect, useRef, useState } from "react";
import { Glyph } from "./CardIcons";

export function ContactSheet({
  open,
  onClose,
  email,
}: {
  open: boolean;
  onClose: () => void;
  email: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState("");
  const dragStart = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      if (dialog.current?.open) dialog.current.close();
      return;
    }
    setStatus("");
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email copied.");
    } catch {
      setStatus(`Copy this address: ${email}`);
    }
  }

  return (
    <dialog
      ref={dialog}
      className="contact-sheet"
      aria-labelledby="contact-title"
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="sheet-content">
        <button
          type="button"
          className="sheet-drag-handle"
          aria-label="Dismiss contact panel"
          onClick={onClose}
          onPointerDown={(event) => {
            dragStart.current = event.clientY;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (dragStart.current !== null && dialog.current) {
              dialog.current.style.translate = `0 ${Math.max(0, event.clientY - dragStart.current)}px`;
            }
          }}
          onPointerUp={(event) => {
            const distance =
              dragStart.current === null
                ? 0
                : event.clientY - dragStart.current;
            dragStart.current = null;
            if (dialog.current) dialog.current.style.translate = "";
            if (distance > 60) onClose();
          }}
          onPointerCancel={() => {
            dragStart.current = null;
            if (dialog.current) dialog.current.style.translate = "";
          }}
        >
          <span className="sheet-handle" />
        </button>

        <div className="sheet-heading">
          <span className="specimen-mono-label">CORRESPONDENCE · HELSINKI</span>
          <button
            type="button"
            className="icon-button"
            aria-label="Close contact options"
            onClick={onClose}
          >
            <Glyph name="plus" className="close-icon" />
          </button>
        </div>

        <h2 id="contact-title">Write a note.</h2>
        <p>
          For architectural questions, thoughtful collaborations, or an unhurried
          exchange of ideas.
        </p>

        <a className="sheet-email" href={`mailto:${email}`}>
          <Glyph name="mail" />
          <span>
            <strong>Direct email</strong>
            <small>{email}</small>
          </span>
          <Glyph name="arrow" />
        </a>

        <div className="sheet-actions">
          <button type="button" onClick={copyEmail}>
            <Glyph name="copy" />
            <span>Copy email</span>
          </button>
          <a href="/chao.vcf" download="Chao-Sun.vcf">
            <Glyph name="profile" />
            <span>Save contact</span>
          </a>
        </div>

        <div className="sheet-socials">
          <a
            href="https://github.com/rootSunc"
            target="_blank"
            rel="noreferrer"
          >
            <span>GitHub</span>
            <Glyph name="arrow" />
          </a>
          <a
            href="https://www.linkedin.com/in/chaosun526/"
            target="_blank"
            rel="noreferrer"
          >
            <span>LinkedIn</span>
            <Glyph name="arrow" />
          </a>
          <a href={`mailto:${email}?subject=Resume%20request`}>
            <span>Résumé</span>
            <Glyph name="arrow" />
          </a>
        </div>

        <div className="sheet-status" role="status">
          {status}
        </div>
      </div>
    </dialog>
  );
}
