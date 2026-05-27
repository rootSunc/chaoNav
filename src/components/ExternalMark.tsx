export function ExternalMark({ show }: { show: boolean }) {
  return show ? (
    <span aria-hidden="true" className="external-mark">
      ↗
    </span>
  ) : null;
}
