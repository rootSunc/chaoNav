import { useRef, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { useDraggableDock } from '../hooks/useDraggableDock';

type DraggablePlayerDockProps = {
  readonly anchorRef: RefObject<HTMLElement | null>;
  readonly children: (props: {
    readonly dockRef: RefObject<HTMLElement | null>;
    readonly dockStyle: CSSProperties | undefined;
    readonly isFloating: boolean;
    readonly onDragHandlePointerDown: ReturnType<typeof useDraggableDock>['handleDragPointerDown'];
    readonly onDragHandlePointerMove: ReturnType<typeof useDraggableDock>['handleDragPointerMove'];
    readonly onDragHandlePointerUp: ReturnType<typeof useDraggableDock>['handleDragPointerUp'];
    readonly onDragHandlePointerCancel: ReturnType<typeof useDraggableDock>['handleDragPointerCancel'];
  }) => ReactNode;
};

export function DraggablePlayerDock({ anchorRef, children }: DraggablePlayerDockProps) {
  const dockRef = useRef<HTMLElement>(null);
  const drag = useDraggableDock({
    anchorRef,
    panelRef: dockRef,
    storageKey: 'chao-nav:player-dock-position',
    gap: 12,
  });

  return children({
    dockRef,
    dockStyle: drag.dockStyle,
    isFloating: drag.isFloating,
    onDragHandlePointerDown: drag.handleDragPointerDown,
    onDragHandlePointerMove: drag.handleDragPointerMove,
    onDragHandlePointerUp: drag.handleDragPointerUp,
    onDragHandlePointerCancel: drag.handleDragPointerCancel,
  });
}
