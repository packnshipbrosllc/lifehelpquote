"use client";

import { useState, useEffect, useRef } from "react";

const STEPS = [
  { id: "age", gate: 1 },
  { id: "health", gate: 2 },
  { id: "timeline", gate: 3 },
  { id: "budget", gate: 4 },
  { id: "need", gate: 5 },
  { id: "contact", gate: 6 },
  { id: "consent", gate: 7 },
];

const EXIT_MESSAGES = {
  age_young: {
    title: "You're Thinking Ahead",
    body: "Most people your age don't even consider life insurance — the fact that you're here says a lot. While most policies require you to be 25+, it's never too early to learn. Bookmark this page and come back when you're ready.",
    type: "soft",
  },
  age_over: {
    title: "We Appreciate You",
    body: "Coverage options change after 70, but there are still plans designed for you. We'd recommend speaking with a licensed agent who specializes in senior coverage.",
    type: "soft",
  },
  health_terminal: {
    title: "We're Here For You",
    body: "We understand this is a difficult time. While traditional coverage may not be available, guaranteed acceptance policies exist with no health questions. A licensed agent can walk you through your options with care.",
    type: "empathetic",
  },
  health_hospital: {
    title: "Focus on What Matters Right Now",
    body: "Your health comes first. When you're feeling better, come back and we'll help you find the right coverage. Wishing you a speedy recovery.",
    type: "empathetic",
  },
  timeline_research: {
    title: "No Rush — We'll Be Here",
    body: "Smart move doing your research first. We'll keep your info on file and check in when you're closer to making a decision. Knowledge is power.",
    type: "nurture",
  },
  budget_low: {
    title: "Good News",
    body: "Many term life policies actually start well under $30/month. Rates depend on your age and health. It's worth getting a free quote — you might be surprised.",
    type: "soft",
  },
};

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ width: "100%", marginBottom: 32 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "#8a8a8a",
          letterSpacing: "0.02em",
        }}
      >
        <span>Step {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div
        style={{
          width: "100%",
          height: 4,
          background: "#e8e8e8",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg, #1a5632, #2d8a4e)",
            borderRadius: 2,
            transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
    </div>
  );
}

function OptionButton({ label, sublabel, selected, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "16px 20px",
        marginBottom: 10,
        border: selected ? "2px solid #1a5632" : "2px solid #e0e0e0",
        borderRadius: 12,
        background: selected ? "#f0f7f2" : "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 14,
        textAlign: "left",
        transition: "all 0.2s ease",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = "#b0b0b0";
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = "#e0e0e0";
      }}
    >
      {icon && (
        <span style={{ fontSize: 22, flexShrink: 0, width: 32, textAlign: "center" }}>
          {icon}
        </span>
      )}
      <div>
        <div style={{ fontSize: 16, fontWeight: 500, color: "#1a1a1a", lineHeight: 1.3 }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: 13, color: "#777", marginTop: 3, lineHeight: 1.4 }}>
            {sublabel}
          </div>
        )}
      </div>
    </button>
  );
}

function ExitScreen({ data }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px", animation: "fadeIn 0.4s ease" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: data.type === "empathetic" ? "#fef3e6" : data.type === "nurture" ? "#e8f0fe" : "#f0f7f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          fontSize: 28,
        }}
      >
        {data.type === "empathetic" ? "💛" : data.type === "nurture" ? "📚" : "👋"}
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>
        {data.title}
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#555", lineHeight: 1.7, maxWidth: 400, margin: "0 auto" }}>
        {data.body}
      </p>
    </div>
  );
}

function SuccessScreen() {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px", animation: "fadeIn 0.4s ease" }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "#f0f7f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          fontSize: 36,
        }}
      >
        ✓
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
        You're All Set
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#555", lineHeight: 1.7, maxWidth: 420, margin: "0 auto 24px" }}>
        A licensed agent will reach out within 24 hours with a personalized quote based on your answers. No pressure, no obligation.
      </p>
      <div style={{ background: "#f7f7f7", borderRadius: 12, padding: "20px 24px", maxWidth: 360, margin: "0 auto", textAlign: "left" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#1a5632", marginBottom: 10 }}>
          What happens next:
        </div>
        {["An agent reviews your profile", "They'll call or text you", "You get a free, no-obligation quote"].map((item, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "#555",
              padding: "6px 0",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: "#2d8a4e", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeadForm() {
  const [step, setStep] = useState(0);
  const [exit, setExit] = useState(null);
  const [success, setSuccess] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    health: "",
    timeline: "",
    budget: "",
    need: [],
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    tcpa: false,
  });
  const [errors, setErrors] = useState({});
  const containerRef = useRef(null);

  const goNext = () => {
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
    }, 200);
  };

  const goExit = (key) => {
    setAnimating(true);
    setTimeout(() => {
      setExit(EXIT_MESSAGES[key]);
      setAnimating(false);
    }, 200);
  };

  const handleSelect = (field, value) => {
    setFormData((d) => ({ ...d, [field]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData((d) => {
      const arr = d[field] || [];
      if (arr.includes(value)) return { ...d, [field]: arr.filter((v) => v !== value) };
      return { ...d, [field]: [...arr, value] };
    });
  };

  const getProductRouting = () => {
    const needs = formData.need;
    const hasDependents = needs.includes("dependents") || needs.includes("mortgage");
    const hasFinalExpense = needs.includes("final_expense");
    const isOlder = formData.age === "51-70";

    if (hasDependents && hasFinalExpense) {
      if (isOlder) return "whole_life";
      return "premium";
    }
    if (isOlder && hasFinalExpense) return "final_expense";
    if (hasDependents) return "term_life";
    if (needs.includes("all")) return "premium";
    return "term_life";
  };

  const submitLead = async () => {
    const lead = {
      lead_id: `LI-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`,
      timestamp: new Date().toISOString(),
      source: "lifehelpquote.com_organic",
      contact: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        email: formData.email,
      },
      profile: {
        age: formData.age,
        health_status: formData.health,
        timeline: formData.timeline,
        budget: formData.budget,
        need: formData.need,
        recommended_product: getProductRouting(),
      },
      consent: {
        tcpa_consent: true,
        consent_text:
          "I agree to be contacted by a licensed insurance agent by phone, text, or email regarding life insurance options. I understand this is not a commitment to purchase.",
        timestamp: new Date().toISOString(),
        form_url: typeof window !== "undefined" ? window.location.href : "",
      },
    };

    // Log to console for testing
    console.log("LEAD CAPTURED:", JSON.stringify(lead, null, 2));

    // ---- WEBHOOK: Uncomment and add your endpoint ----
    // try {
    //   await fetch("https://your-webhook-url.com/api/leads", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(lead),
    //   });
    // } catch (err) {
    //   console.error("Webhook failed:", err);
    // }

    // ---- API ROUTE: Send to /api/leads for server-side storage ----
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch (err) {
      console.error("API route failed:", err);
    }

    setSuccess(true);
  };

  const validateContact = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = true;
    if (!formData.lastName.trim()) e.lastName = true;
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) e.phone = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, exit, success]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
              How old are you?
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#777", marginBottom: 24 }}>
              This helps us find the right coverage type for you.
            </p>
            {[
              { label: "Under 25", value: "under_25", icon: "🎓" },
              { label: "25 – 35", value: "25-35", icon: "💼" },
              { label: "36 – 50", value: "36-50", icon: "🏠" },
              { label: "51 – 70", value: "51-70", icon: "🌿" },
              { label: "Over 70", value: "over_70", icon: "🕊" },
            ].map((o) => (
              <OptionButton
                key={o.value}
                label={o.label}
                icon={o.icon}
                selected={formData.age === o.value}
                onClick={() => {
                  handleSelect("age", o.value);
                  setTimeout(() => {
                    if (o.value === "under_25") goExit("age_young");
                    else if (o.value === "over_70") goExit("age_over");
                    else goNext();
                  }, 250);
                }}
              />
            ))}
          </div>
        );

      case 1:
        return (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
              How's your health?
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#777", marginBottom: 24 }}>
              No judgment — this just helps us match you with the right options.
            </p>
            {[
              { label: "Generally healthy", value: "healthy", sublabel: "No major ongoing conditions", icon: "💚" },
              { label: "Some health issues", value: "some_issues", sublabel: "Manageable conditions, medication, etc.", icon: "🩺" },
              { label: "Currently hospitalized", value: "hospitalized", icon: "🏥" },
              { label: "Terminal diagnosis", value: "terminal", icon: "🤍" },
            ].map((o) => (
              <OptionButton
                key={o.value}
                label={o.label}
                sublabel={o.sublabel}
                icon={o.icon}
                selected={formData.health === o.value}
                onClick={() => {
                  handleSelect("health", o.value);
                  setTimeout(() => {
                    if (o.value === "terminal") goExit("health_terminal");
                    else if (o.value === "hospitalized") goExit("health_hospital");
                    else goNext();
                  }, 250);
                }}
              />
            ))}
          </div>
        );

      case 2:
        return (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
              When are you looking to get covered?
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#777", marginBottom: 24 }}>
              Timing helps us prioritize your quote.
            </p>
            {[
              { label: "Within 30 days", value: "30_days", sublabel: "Ready to move forward", icon: "⚡" },
              { label: "1 – 3 months", value: "1-3_months", sublabel: "Exploring options seriously", icon: "📅" },
              { label: "Just researching", value: "researching", sublabel: "Learning for now", icon: "📚" },
            ].map((o) => (
              <OptionButton
                key={o.value}
                label={o.label}
                sublabel={o.sublabel}
                icon={o.icon}
                selected={formData.timeline === o.value}
                onClick={() => {
                  handleSelect("timeline", o.value);
                  setTimeout(() => {
                    if (o.value === "researching") goExit("timeline_research");
                    else goNext();
                  }, 250);
                }}
              />
            ))}
          </div>
        );

      case 3:
        return (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
              What's your monthly budget?
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#777", marginBottom: 24 }}>
              Most people are surprised how affordable coverage can be.
            </p>
            {[
              { label: "Under $30/month", value: "under_30", icon: "💰" },
              { label: "$30 – $50/month", value: "30-50", icon: "💵" },
              { label: "$50 – $100/month", value: "50-100", icon: "💎" },
              { label: "$100 – $200+/month", value: "100-200+", icon: "🏆" },
            ].map((o) => (
              <OptionButton
                key={o.value}
                label={o.label}
                icon={o.icon}
                selected={formData.budget === o.value}
                onClick={() => {
                  handleSelect("budget", o.value);
                  setTimeout(() => {
                    if (o.value === "under_30") goExit("budget_low");
                    else goNext();
                  }, 250);
                }}
              />
            ))}
          </div>
        );

      case 4:
        return (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
              What's driving your interest?
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#777", marginBottom: 24 }}>
              Select all that apply — it helps us find the best fit.
            </p>
            {[
              { label: "Protecting my family / dependents", value: "dependents", icon: "👨‍👩‍👧‍👦" },
              { label: "Covering mortgage or debt", value: "mortgage", icon: "🏠" },
              { label: "Final expenses / burial costs", value: "final_expense", icon: "🕊" },
              { label: "All of the above", value: "all", icon: "✅" },
            ].map((o) => (
              <OptionButton
                key={o.value}
                label={o.label}
                icon={o.icon}
                selected={formData.need.includes(o.value)}
                onClick={() => {
                  if (o.value === "all") {
                    setFormData((d) => ({ ...d, need: ["dependents", "mortgage", "final_expense", "all"] }));
                  } else {
                    handleMultiSelect("need", o.value);
                  }
                }}
              />
            ))}
            <button
              onClick={() => { if (formData.need.length > 0) goNext(); }}
              disabled={formData.need.length === 0}
              style={{
                width: "100%",
                padding: "16px",
                marginTop: 12,
                background: formData.need.length > 0 ? "#1a5632" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: formData.need.length > 0 ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
            >
              Continue
            </button>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
              Almost there — how can we reach you?
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#777", marginBottom: 24 }}>
              A licensed agent will contact you with a free, no-obligation quote.
            </p>
            {[
              { key: "firstName", label: "First Name", type: "text", placeholder: "John" },
              { key: "lastName", label: "Last Name", type: "text", placeholder: "Smith" },
              { key: "phone", label: "Phone", type: "tel", placeholder: "(555) 123-4567" },
              { key: "email", label: "Email", type: "email", placeholder: "john@example.com" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={formData[f.key]}
                  onChange={(e) => {
                    setFormData((d) => ({ ...d, [f.key]: e.target.value }));
                    setErrors((er) => ({ ...er, [f.key]: false }));
                  }}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: errors[f.key] ? "2px solid #d44" : "2px solid #e0e0e0",
                    borderRadius: 10,
                    fontSize: 16,
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none",
                    transition: "border 0.2s ease",
                    boxSizing: "border-box",
                    background: "#fff",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#1a5632")}
                  onBlur={(e) => { if (!errors[f.key]) e.target.style.borderColor = "#e0e0e0"; }}
                />
                {errors[f.key] && (
                  <div style={{ fontSize: 12, color: "#d44", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
                    {f.key === "phone" ? "Enter a valid 10-digit phone number" : f.key === "email" ? "Enter a valid email address" : "This field is required"}
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => { if (validateContact()) goNext(); }}
              style={{
                width: "100%",
                padding: "16px",
                marginTop: 8,
                background: "#1a5632",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Continue
            </button>
          </div>
        );

      case 6:
        return (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
              One last step
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#777", marginBottom: 24 }}>
              Please review and confirm below.
            </p>
            <div style={{ background: "#f7f7f7", borderRadius: 12, padding: "16px 20px", marginBottom: 20, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555", lineHeight: 1.8 }}>
              <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
              <div><strong>Phone:</strong> {formData.phone}</div>
              <div><strong>Email:</strong> {formData.email}</div>
              <div><strong>Age range:</strong> {formData.age}</div>
              <div><strong>Timeline:</strong> {formData.timeline === "30_days" ? "Within 30 days" : "1-3 months"}</div>
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                cursor: "pointer",
                marginBottom: 20,
                padding: "16px",
                border: formData.tcpa ? "2px solid #1a5632" : "2px solid #e0e0e0",
                borderRadius: 12,
                background: formData.tcpa ? "#f0f7f2" : "#fff",
                transition: "all 0.2s ease",
              }}
              onClick={() => setFormData((d) => ({ ...d, tcpa: !d.tcpa }))}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  border: formData.tcpa ? "2px solid #1a5632" : "2px solid #ccc",
                  background: formData.tcpa ? "#1a5632" : "#fff",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                  transition: "all 0.2s ease",
                }}
              >
                {formData.tcpa && <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                I agree to be contacted by a licensed insurance agent by phone, text, or email regarding life insurance options. I understand this is not a commitment to purchase. Standard message and data rates may apply. You can opt out at any time.
              </span>
            </label>
            <button
              onClick={() => { if (formData.tcpa) submitLead(); }}
              disabled={!formData.tcpa}
              style={{
                width: "100%",
                padding: "18px",
                background: formData.tcpa ? "#1a5632" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 17,
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                cursor: formData.tcpa ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                letterSpacing: "0.01em",
              }}
            >
              Get My Free Quote
            </button>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#999", textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
              Content is educational. Actual rates vary by age, health, and coverage amount. Consult a licensed agent for personalized quotes.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f5f0eb 0%, #eae5df 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "40px 16px 60px",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        input::placeholder { color: #bbb; }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 32, maxWidth: 480 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a5632", letterSpacing: "0.04em", marginBottom: 8 }}>
          LifeHelpQuote
        </div>
        {!exit && !success && step === 0 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 8 }}>
              Protect What Matters Most
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#666", lineHeight: 1.6 }}>
              Answer a few quick questions and get a free life insurance quote — no commitment, no pressure.
            </p>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          borderRadius: 20,
          padding: "32px 28px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          animation: "fadeIn 0.4s ease",
          opacity: animating ? 0.3 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        {success ? <SuccessScreen /> : exit ? <ExitScreen data={exit} /> : (
          <>
            <ProgressBar current={step + 1} total={STEPS.length} />
            {renderStep()}
          </>
        )}
      </div>

      {!exit && !success && (
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 28, flexWrap: "wrap" }}>
          {["🔒 Secure & Private", "⚡ 60-Second Form", "💯 No Obligation"].map((t, i) => (
            <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#999", letterSpacing: "0.02em" }}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
