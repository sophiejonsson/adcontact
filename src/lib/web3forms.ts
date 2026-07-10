// Client-side submission to Web3Forms. Web3Forms' free tier is browser-only, so
// forms POST here directly (not through our server). The access key is exposed
// to the browser by design — Web3Forms keys are public, rate-limited, and only
// ever email your configured inbox. hCaptcha (Web3Forms' shared key) is verified
// on Web3Forms' side via the `h-captcha-response` field.

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
const ENDPOINT = "https://api.web3forms.com/submit";

export const WEB3FORMS_CONFIGURED = Boolean(ACCESS_KEY);

// Web3Forms' shared hCaptcha site key (free plan, no hCaptcha account needed).
export const HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

type Result = { ok: boolean; message: string };

async function post(data: Record<string, string>, file: File | null): Promise<Response> {
  if (file) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(data)) fd.append(k, v);
    fd.append("attachment", file, file.name);
    return fetch(ENDPOINT, { method: "POST", body: fd });
  }
  return fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(data),
  });
}

/** Submit an RFQ/quote to Web3Forms. Retries text-only if an attachment trips it up. */
export async function submitToWeb3Forms(
  fields: Record<string, string>,
  captchaToken: string,
  file: File | null = null,
): Promise<Result> {
  if (!ACCESS_KEY) return { ok: false, message: "The form isn't configured yet." };

  const data: Record<string, string> = {
    access_key: ACCESS_KEY,
    "h-captcha-response": captchaToken,
    botcheck: "",
    ...fields,
  };

  try {
    let res = await post(data, file);
    let json = await res.json().catch(() => ({ success: res.ok } as { success?: boolean; message?: string }));
    // If the attachment caused the failure, retry without it so the RFQ still lands.
    if (!json.success && file) {
      const withNote = {
        ...data,
        message:
          `${data.message ?? ""}\n\n[Note: customer attached "${file.name}" — it couldn't be uploaded; please request it directly.]`.trim(),
      };
      res = await post(withNote, null);
      json = await res.json().catch(() => ({ success: res.ok }));
    }
    return { ok: Boolean(json.success), message: json.message ?? "" };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
