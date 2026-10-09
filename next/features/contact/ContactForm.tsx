"use client";

import { AnimatePresence, motion } from "motion/react";
import { useActionState, useState } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { sendMessage, type ContactState } from "./actions";

const initial: ContactState = { status: "idle" };

function Field({
  name,
  label,
  error,
  defaultValue,
  multiline,
  type = "text",
  autoComplete,
}: {
  name: "name" | "email" | "message";
  label: string;
  error?: string;
  defaultValue?: string;
  multiline?: boolean;
  type?: string;
  autoComplete?: string;
}) {
  const id = `contact-${name}`;
  const shared = {
    id,
    name,
    defaultValue,
    required: true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    placeholder: " ",
    className: cn(
      "peer w-full resize-none border-b bg-transparent pt-7 pb-3 text-base text-ink outline-none transition-colors duration-300",
      error ? "border-[var(--magenta)]" : "border-white/15 focus:border-[var(--accent)]",
    ),
  };

  return (
    <div className="relative">
      {multiline ? (
        <textarea {...shared} rows={4} maxLength={4000} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-0 left-0 hud transition-all duration-300 peer-focus:text-[var(--accent)]"
      >
        {label}
      </label>
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 ease-[var(--ease-out-expo)] peer-focus:scale-x-100"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 font-mono text-xs text-[var(--magenta)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Success({
  name,
  simulated,
  onReset,
}: {
  name: string;
  simulated: boolean;
  onReset: () => void;
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: ease.outExpo }}
      className="flex min-h-[26rem] flex-col items-center justify-center text-center"
      role="status"
    >
      <div className="relative grid size-28 place-items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute inset-0 rounded-full border border-[var(--accent)]"
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{
              duration: 2.4,
              delay: i * 0.6,
              repeat: Infinity,
              ease: ease.outExpo,
            }}
          />
        ))}
        <svg viewBox="0 0 52 52" className="relative size-16" aria-hidden>
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: ease.outExpo }}
          />
          <motion.path
            d="M15 27 l7 7 l15 -16"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.55, ease: ease.outExpo }}
          />
        </svg>
      </div>
      <p className="mt-10 hud">
        <span className="text-accent">Uplink</span> · Signal received
      </p>
      <p className="mt-4 display-wide text-2xl uppercase md:text-3xl">
        Thanks, {name.split(" ")[0]}
      </p>
      <p className="mt-4 max-w-sm text-sm text-ink-dim">
        {simulated
          ? "Development mode: the message was logged on the server, not emailed."
          : "Your message is on its way. Expect a reply in your inbox."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 hud underline-offset-4 transition-colors hover:text-accent hover:underline"
      >
        Send another
      </button>
    </motion.div>
  );
}

export function ContactForm() {
  const [formKey, setFormKey] = useState(0);
  return <ContactFormInner key={formKey} onReset={() => setFormKey((k) => k + 1)} />;
}

function ContactFormInner({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useActionState(sendMessage, initial);
  const errorState = state.status === "error" ? state : null;

  return (
    <AnimatePresence mode="wait">
      {state.status === "success" ? (
        <Success name={state.name} simulated={state.simulated} onReset={onReset} />
      ) : (
        <motion.form
          key="form"
          action={action}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.4, ease: ease.warp }}
          className="relative flex flex-col gap-8"
          noValidate
        >
          <Field
            name="name"
            label="Your name"
            autoComplete="name"
            error={errorState?.fields?.name}
            defaultValue={errorState?.values.name}
          />
          <Field
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            error={errorState?.fields?.email}
            defaultValue={errorState?.values.email}
          />
          <Field
            name="message"
            label="Project or message"
            multiline
            error={errorState?.fields?.message}
            defaultValue={errorState?.values.message}
          />
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Company
              <input type="text" name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <p role="alert" className="font-mono text-xs text-[var(--magenta)]">
              {errorState && !errorState.fields ? errorState.message : null}
            </p>
            <Magnetic strength={0.4}>
              <button
                type="submit"
                disabled={pending}
                data-cursor={pending ? undefined : "Send"}
                className="relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[var(--accent)] px-8 py-4 font-mono text-xs font-semibold tracking-[0.24em] text-[var(--void-0)] uppercase transition-[filter,opacity] hover:brightness-110 disabled:opacity-60"
              >
                {pending ? (
                  <>
                    <motion.span
                      aria-hidden
                      className="size-3 rounded-full border-2 border-[var(--void-0)] border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    Transmitting
                  </>
                ) : (
                  <>
                    Transmit <span aria-hidden>→</span>
                  </>
                )}
              </button>
            </Magnetic>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
