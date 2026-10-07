import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

const DialogContent = ({
  children,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  className,
  onClose,
  padded,
}) => {
  const dialogRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose?.();
    }
    if (event.key !== "Tab") return;
    const controls = Array.from(
      dialogRef.current.querySelectorAll(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
      ),
    ).filter((element) => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (!first) {
      event.preventDefault();
      return;
    }
    if (
      event.shiftKey &&
      (document.activeElement === first ||
        document.activeElement === dialogRef.current)
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last ||
        document.activeElement === dialogRef.current)
    ) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.16 }}
      className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 p-4 font-sans"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <motion.section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        initial={{
          opacity: 0,
          scale: reducedMotion ? 1 : 0.97,
          y: reducedMotion ? 0 : 8,
        }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{
          opacity: 0,
          scale: reducedMotion ? 1 : 0.97,
          y: reducedMotion ? 0 : 8,
        }}
        transition={{ duration: reducedMotion ? 0 : 0.16, ease: "easeOut" }}
        onKeyDown={handleKeyDown}
        className={clsx(
          "max-h-[calc(100dvh-2rem)] w-full max-w-[500px] overflow-y-auto rounded-2xl border border-[rgb(var(--color-gray-border))] bg-[rgb(var(--color-bg-card))] text-[rgb(var(--color-text))] shadow-xl outline-none scrollbar-thin",
          padded && "flex flex-col items-center gap-5 px-6 py-8",
          className,
        )}
      >
        {children}
      </motion.section>
    </motion.div>
  );
};

const Dialog = ({ open = true, onExitComplete, padded = true, ...props }) =>
  createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && <DialogContent key="dialog" padded={padded} {...props} />}
    </AnimatePresence>,
    document.body,
  );

export default Dialog;
