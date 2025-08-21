export default async function sendEmail(name, email, message) {
  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY, 
    template_params: {
      name,
      email,
      message,
    },
  };

  const resp = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    // Log utile pour diagnostiquer (IDs/template erronés, quota, domaine non autorisé…)
    console.error("EmailJS error:", resp.status, text);
    throw new Error(`EmailJS failed: ${resp.status}`);
  }
}
