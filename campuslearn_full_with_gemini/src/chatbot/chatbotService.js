import emailjs from '@emailjs/browser';

export async function lookupFAQ(message) {
  try {
    const res = await fetch('http://localhost:5000/api/faqs');
    const faqs = await res.json();
    const text = message.toLowerCase();

    for (const faq of faqs) {
      const keywords = faq.keywords
        ? faq.keywords.split(',').map(k => k.trim().toLowerCase())
        : [];
      if (keywords.some(kw => text.includes(kw))) {
        return { source: 'faq', answer: faq.answer };
      }
    }

    return null;
  } catch (e) {
    console.error('FAQ fetch failed:', e);
    return null;
  }
}

export async function queryAI(message) {
  try {
    const res = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return { reply: data.reply || "AI service unavailable." };
  } catch (err) {
    console.error("AI query failed:", err);
    return { reply: "AI service unavailable." };
  }
}

export async function getTutorsForModule(code) {
  try {
    const res = await fetch(`http://localhost:5000/api/tutors/module/${encodeURIComponent(code)}`);
    const data = await res.json();
    return data.tutors || [];
  } catch (e) {
    console.error('Failed to fetch tutors', e);
    return [];
  }
}

export async function sendEmailToTutors(tutors, student, question) {
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const userId = import.meta.env.VITE_EMAILJS_USER_ID;

    if (!serviceId || !templateId || !userId)
      throw new Error('EmailJS not configured');

    await Promise.all(
      tutors.map(t =>
        emailjs.send(serviceId, templateId, {
          to_name: t.name || 'Tutor',
          to_email: t.email,
          student_name: student?.name || 'Anonymous',
          student_email: student?.email || 'unknown@domain',
          question,
        }, userId)
      )
    );

    return { ok: true };
  } catch (e) {
    console.error('EmailJS send failed', e);
    return { ok: false, error: String(e) };
  }
}
