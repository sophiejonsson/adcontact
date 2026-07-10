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

/** Submit an RFQ/quote to Web3Forms. */
export async function submitToWeb3Forms(
  fields: Record<string, string>,
  captchaToken: string,
): Promise<{ ok: boolean; message: string }> {
  if (!ACCESS_KEY) return { ok: false, message: "The form isn't configured yet." };

  const data = {
    access_key: ACCESS_KEY,
    "h-captcha-response": captchaToken,
    botcheck: "",
    ...fields,
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(data),
    });
    const json = (await res.json().catch(() => ({ success: res.ok }))) as {
      success?: boolean;
      message?: string;
    };
    return { ok: Boolean(json.success), message: json.message ?? "" };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
