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
          className="sheet-drag-handle"
          aria-label="Dismiss contact panel"
          onClick={onClose}
          onPointerDown={(event) => {
            dragStart.current = event.clientY;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (dragStart.current !== null && dialog.current)
              dialog.current.style.translate = `0 ${Math.max(0, event.clientY - dragStart.current)}px`;
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
          <span className="eyebrow">LET’S CONNECT</span>
          <button
            className="icon-button"
            aria-label="Close contact options"
            onClick={onClose}
          >
            <Glyph name="plus" className="close-icon" />
          </button>
        </div>
        <h2 id="contact-title">
          A conversation
          <br />
          is a good start<span>.</span>
        </h2>
        <p>Have an idea, a question, or just a hello?</p>
        <a className="sheet-email" href={`mailto:${email}`}>
          <Glyph name="mail" />
          <span>
            <strong>Send an email</strong>
            <small>{email}</small>
          </span>
          <Glyph name="arrow" />
        </a>
        <div className="sheet-actions">
          <button onClick={copyEmail}>
            <Glyph name="copy" />
            Copy email
          </button>
          <a href="/chao.vcf" download="Chao-Sun.vcf">
            <Glyph name="profile" />
            Save contact
          </a>
        </div>
        <div className="sheet-socials">
          <a
            href="https://github.com/rootSunc"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Glyph name="arrow" />
          </a>
          <a
            href="https://www.linkedin.com/in/chaosun526/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <Glyph name="arrow" />
          </a>
          <a href={`mailto:${email}?subject=Resume%20request`}>
            Résumé <Glyph name="arrow" />
          </a>
        </div>
        <div className="sheet-status" role="status">
          {status}
        </div>
      </div>
    </dialog>
  );
}
