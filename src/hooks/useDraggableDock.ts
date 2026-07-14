import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

type DockPoint = {
  readonly x: number;
  readonly y: number;
};

type DragSession = {
  readonly offsetX: number;
  readonly offsetY: number;
  readonly pointerId: number;
};

type UseDraggableDockOptions = {
  readonly anchorRef: RefObject<HTMLElement | null>;
  readonly panelRef: RefObject<HTMLElement | null>;
  readonly storageKey: string;
  readonly gap?: number;
};

function readStoredPosition(storageKey: string): DockPoint | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<DockPoint>;

    if (typeof parsed.x !== 'number' || typeof parsed.y !== 'number') {
      return null;
    }

    return { x: parsed.x, y: parsed.y };
  } catch {
    return null;
  }
}

function clampPoint(point: DockPoint, panel: HTMLElement): DockPoint {
  const maxX = Math.max(8, window.innerWidth - panel.offsetWidth - 8);
  const maxY = Math.max(8, window.innerHeight - panel.offsetHeight - 8);

  return {
    x: Math.min(Math.max(8, point.x), maxX),
    y: Math.min(Math.max(8, point.y), maxY),
  };
}

export function useDraggableDock({
  anchorRef,
  panelRef,
  storageKey,
  gap = 12,
}: UseDraggableDockOptions) {
  const [customPosition, setCustomPosition] = useState<DockPoint | null>(() =>
    readStoredPosition(storageKey),
  );
  const [layoutVersion, setLayoutVersion] = useState(0);
  const dragSessionRef = useRef<DragSession | null>(null);

  const resolveAnchorPosition = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;

    if (!anchor || !panel) {
      return null;
    }

    const anchorRect = anchor.getBoundingClientRect();

    return clampPoint(
      {
        x: anchorRect.left,
        y: anchorRect.bottom + gap,
      },
      panel,
    );
  }, [anchorRef, gap, panelRef]);

  useLayoutEffect(() => {
    setLayoutVersion((version) => version + 1);
  }, [customPosition]);

  useEffect(() => {
    const handleResize = () => {
      const panel = panelRef.current;

      if (!panel) {
        return;
      }

      if (customPosition === null) {
        setLayoutVersion((version) => version + 1);
        return;
      }

      setCustomPosition((current) => {
        if (!current) {
          return current;
        }

        const clamped = clampPoint(current, panel);

        try {
          window.localStorage.setItem(storageKey, JSON.stringify(clamped));
        } catch {
          // Ignore storage failures.
        }

        return clamped;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [customPosition, panelRef, storageKey]);

  const persistCustomPosition = useCallback(
    (nextPoint: DockPoint) => {
      setCustomPosition(nextPoint);

      try {
        window.localStorage.setItem(storageKey, JSON.stringify(nextPoint));
      } catch {
        // Ignore storage failures in private browsing or quota errors.
      }
    },
    [storageKey],
  );

  const handleDragPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) {
        return;
      }

      const panel = panelRef.current;

      if (!panel) {
        return;
      }

      event.preventDefault();

      const rect = panel.getBoundingClientRect();
      const startPoint = customPosition ?? resolveAnchorPosition() ?? {
        x: rect.left,
        y: rect.top,
      };

      dragSessionRef.current = {
        offsetX: event.clientX - startPoint.x,
        offsetY: event.clientY - startPoint.y,
        pointerId: event.pointerId,
      };

      persistCustomPosition(startPoint);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [customPosition, panelRef, persistCustomPosition, resolveAnchorPosition],
  );

  const handleDragPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const session = dragSessionRef.current;
      const panel = panelRef.current;

      if (!session || session.pointerId !== event.pointerId || !panel) {
        return;
      }

      persistCustomPosition(
        clampPoint(
          {
            x: event.clientX - session.offsetX,
            y: event.clientY - session.offsetY,
          },
          panel,
        ),
      );
    },
    [panelRef, persistCustomPosition],
  );

  const finishDrag = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const session = dragSessionRef.current;

    if (!session || session.pointerId !== event.pointerId) {
      return;
    }

    dragSessionRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  void layoutVersion;

  const activePosition = customPosition ?? resolveAnchorPosition();
  const dockStyle = activePosition
    ? {
        left: `${activePosition.x}px`,
        top: `${activePosition.y}px`,
        bottom: 'auto',
        transform: 'none',
      }
    : undefined;

  return {
    dockStyle,
    handleDragPointerDown,
    handleDragPointerMove,
    handleDragPointerUp: finishDrag,
    handleDragPointerCancel: finishDrag,
    isFloating: activePosition !== null,
    isCustomPosition: customPosition !== null,
  };
}
