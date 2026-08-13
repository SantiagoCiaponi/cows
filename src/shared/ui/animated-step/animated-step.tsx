// shared/ui/animated-step/animated-step.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  // cada vez que cambia este valor, se dispara la animacion
  stepKey: string | number;
  // "forward" desliza de derecha a izquierda, "back" al reves xd
  direction?: "forward" | "back";
  children: React.ReactNode;
};

// duracion en ms de la animacion
const DURATION = 280;

export function AnimatedStep({ stepKey, direction = "forward", children }: Props) {
  const [displayedKey, setDisplayedKey] = useState(stepKey);
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
  const pendingChildren = useRef(children);
  const pendingKey = useRef(stepKey);

  useEffect(() => {
    pendingChildren.current = children;
    pendingKey.current = stepKey;

    // si el stepKey no cambio, solo actualizamos el contenido sin animacion
    if (stepKey === displayedKey) {
      setDisplayedChildren(children);
      return;
    }

    // 1. arrancar salida
    setPhase("exit");

    const t = setTimeout(() => {
      // 2. swap del contenido
      setDisplayedChildren(pendingChildren.current);
      setDisplayedKey(pendingKey.current);
      setPhase("enter");

      // 3. animar entrada y volver a idle
      const t2 = setTimeout(() => setPhase("idle"), DURATION);
      return () => clearTimeout(t2);
    }, DURATION);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey, children, displayedKey]);

  const isForward = direction === "forward";

  const transform = {
    idle: "translate-x-0 opacity-100",
    exit: isForward ? "-translate-x-8 opacity-0" : "translate-x-8 opacity-0",
    enter: isForward ? "translate-x-8 opacity-0" : "-translate-x-8 opacity-0",
  }[phase];

  return (
    <div
      className={["transition-all ease-in-out", transform].join(" ")}
      style={{ transitionDuration: `${DURATION}ms` }}
    >
      {displayedChildren}
    </div>
  );
}
