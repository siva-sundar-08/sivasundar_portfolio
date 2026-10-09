"use server";

export type ContactState =
  | { status: "idle" }
  | { status: "success"; name: string; simulated: boolean }
  | {
      status: "error";
      message: string;
      fields?: Partial<Record<"name" | "email" | "message", string>>;
      values: { name: string; email: string; message: string };
    };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validates the contact form and relays it through FormSubmit's AJAX API.
 * Set CONTACT_FORMSUBMIT_ID to your FormSubmit email or random alias. Without
 * it, development logs the message and reports success; production refuses.
 */
export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Honeypot: real people never see or fill this field.
  if (String(formData.get("company") ?? "") !== "") {
    return { status: "success", name: values.name, simulated: true };
  }

  const fields: NonNullable<Extract<ContactState, { status: "error" }>["fields"]> = {};
  if (values.name.length < 2) fields.name = "Tell me your name.";
  if (!EMAIL.test(values.email)) fields.email = "That email doesn't look right.";
  if (values.message.length < 10) fields.message = "A little more detail, please (10+ characters).";
  if (values.message.length > 4000) fields.message = "Please keep it under 4000 characters.";
  if (Object.keys(fields).length > 0) {
    return { status: "error", message: "Check the highlighted fields.", fields, values };
  }

  const target = process.env.CONTACT_FORMSUBMIT_ID;
  if (!target) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] CONTACT_FORMSUBMIT_ID not set; message not sent:", values);
      return { status: "success", name: values.name, simulated: true };
    }
    return {
      status: "error",
      message: "The contact form isn't configured yet. Please reach out on LinkedIn.",
      values,
    };
  }

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(target)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...values,
        _subject: `Portfolio uplink from ${values.name}`,
        _template: "table",
        _replyto: values.email,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`FormSubmit responded ${response.status}`);
    return { status: "success", name: values.name, simulated: false };
  } catch (error) {
    console.error("[contact] send failed", error);
    return {
      status: "error",
      message: "The signal didn't go through. Try again in a moment, or use LinkedIn.",
      values,
    };
  }
}
