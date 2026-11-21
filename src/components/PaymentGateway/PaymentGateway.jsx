import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CreditCard,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Receipt,
  XCircle,
  AlertTriangle,
  Sparkles,
  Ban,
  X,
  ArrowRight,
  Loader2,
  Lock,
  Crown,
  BadgeCheck,
} from "lucide-react";

import {
  getSubscriptionPlans,
  calculateSubscription,
  checkoutSubscription,
  getApiError,
} from "../../api/adminService";
import "./PaymentGateway.css";
import PromoCode from "../common/promocode/PromoCode";

const GST_RATE = 18;

/* ---------- Reusable alert ---------- */
const ALERT_META = {
  success: { title: "Promo code applied", Icon: CheckCircle2 },
  error: { title: "Something went wrong", Icon: XCircle },
  warning: { title: "Promo code needed", Icon: AlertTriangle },
  used: { title: "Promo code already used", Icon: Ban },
};

// Detects the "one-time use" rejection coming back from the API
const isAlreadyUsed = (source) =>
  source?.alreadyUsed === true ||
  source?.isUsed === true ||
  source?.response?.status === 409 ||
  /already\s+(been\s+)?(used|redeemed|applied)|one[-\s]?time|single[-\s]?use/i.test(
    source?.message || source?.response?.data?.message || ""
  );

const PaymentAlert = ({ type = "error", title, message, savedText, onClose }) => {
  const meta = ALERT_META[type] || ALERT_META.error;
  const { Icon } = meta;

  return (
    <div
      className={`payment-alert ${type}`}
      role={type === "success" ? "status" : "alert"}
    >
      <span className="payment-alert-icon">
        <Icon size={18} />
      </span>

      <div className="payment-alert-body">
        <strong className="payment-alert-title">{title || meta.title}</strong>
        <p className="payment-alert-text">{message}</p>

        {savedText && (
          <span className="payment-alert-chip">
            <Sparkles size={13} />
            {savedText}
          </span>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          className="payment-alert-close"
          onClick={onClose}
          aria-label="Dismiss message"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

/* ---------- Animated amount (counts up / down smoothly) ---------- */
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const useCountUp = (value, duration = 650) => {
  const target = Number(value) || 0;
  const [display, setDisplay] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;

    if (from === target || prefersReducedMotion()) {
      current.current = target;
      setDisplay(target);
      return undefined;
    }

    let raf;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out
      const next = from + (target - from) * eased;
      current.current = next;
      setDisplay(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return display;
};

const AnimatedAmount = ({ value, format }) => format(useCountUp(value));

const PaymentGateway = () => {
  const { planId } = useParams();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [baseCalc, setBaseCalc] = useState(null); // without promo
  const [calc, setCalc] = useState(null); // currently shown

  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoStatus, setPromoStatus] = useState(""); // "success" | "error" | "warning" | "used" | ""
  const [applying, setApplying] = useState(false);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  // Keep window pinned at top so admin layout stays in place
  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    resetScroll();
    window.addEventListener("scroll", resetScroll);
    return () => window.removeEventListener("scroll", resetScroll);
  }, []);

  // Fetch plan + initial calculation (no promo)
  useEffect(() => {
    let cancelled = false;

    const fetchPlan = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSubscriptionPlans();
        const plans = Array.isArray(response?.data) ? response.data : [];
        const selectedPlan = plans.find(
          (item) => String(item.planId) === String(planId)
        );

        if (cancelled) return;

        if (!selectedPlan) {
          setError("Selected subscription plan not found.");
          return;
        }

        setPlan(selectedPlan);

        try {
          const result = await calculateSubscription({ planId });
          if (!cancelled) {
            setBaseCalc(result);
            setCalc(result);
          }
        } catch (calcErr) {
          console.error("Calculate error:", calcErr);
        }
      } catch (err) {
        console.error("Payment plan error:", err);
        if (!cancelled) {
          setError("Unable to load payment details. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPlan();
    return () => {
      cancelled = true;
    };
  }, [planId]);

  // Pricing: API first, plan price as fallback for the original price
  const pricing = useMemo(() => {
    const planPrice = Number(plan?.price) || 0;

    if (calc) {
      const originalPrice =
        calc.originalPrice > 0 ? calc.originalPrice : planPrice;
      const discountAmount = calc.discountAmount || 0;
      const discountPercent =
        originalPrice > 0
          ? Number(((discountAmount / originalPrice) * 100).toFixed(2))
          : 0;

      return {
        originalPrice,
        discountPercent,
        discountAmount,
        gstPercent: calc.gstPercent ?? GST_RATE,
        gstAmount: calc.gstAmount,
        otherTaxes: calc.otherTaxes,
        total: calc.total,
      };
    }

    const gstAmount = (planPrice * GST_RATE) / 100;
    return {
      originalPrice: planPrice,
      discountPercent: 0,
      discountAmount: 0,
      gstPercent: GST_RATE,
      gstAmount,
      otherTaxes: 0,
      total: planPrice + gstAmount,
    };
  }, [plan, calc]);

  const formatCurrency = (amount) =>
    `₹ ${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const clearPromoMessage = () => {
    setPromoMessage("");
    setPromoStatus("");
  };

  // Apply promo code through the API
  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (applying) return;

    const code = promoCode.trim().toUpperCase();

    if (!code) {
      setAppliedCode("");
      setCalc(baseCalc);
      setPromoStatus("warning");
      setPromoMessage("Please enter a promo code to get a discount.");
      return;
    }

    try {
      setApplying(true);
      clearPromoMessage();

      const result = await calculateSubscription({ planId, promoCode: code });

      if (result.isValid === false || result.discountAmount <= 0) {
        setAppliedCode("");
        setCalc(baseCalc);
        if (isAlreadyUsed(result)) {
          setPromoStatus("used");
          setPromoMessage(
            result.message ||
              "This promo code is valid for one-time use only and has already been redeemed."
          );
        } else {
          setPromoStatus("error");
          setPromoMessage(result.message || "Invalid promo code.");
        }
        return;
      }

      const base =
        result.originalPrice > 0 ? result.originalPrice : Number(plan?.price) || 0;
      const percent =
        base > 0 ? Number(((result.discountAmount / base) * 100).toFixed(2)) : 0;

      setCalc(result);
      setAppliedCode(code);
      setPromoStatus("success");
      setPromoMessage(
        result.message || `${code} applied! ${percent}% discount added.`
      );
    } catch (err) {
      setAppliedCode("");
      setCalc(baseCalc);
      if (isAlreadyUsed(err)) {
        setPromoStatus("used");
        setPromoMessage(
          getApiError(
            err,
            "This promo code is valid for one-time use only and has already been redeemed."
          )
        );
      } else {
        setPromoStatus("error");
        setPromoMessage(getApiError(err, "Invalid promo code."));
      }
    } finally {
      setApplying(false);
    }
  };

  // Editing the code after applying removes the discount
  const handlePromoChange = (e) => {
    setPromoCode(e.target.value);
    clearPromoMessage();
    if (appliedCode) {
      setAppliedCode("");
      setCalc(baseCalc);
    }
  };

  // Remove an applied code (the code is only consumed after a successful payment)
  const handleRemovePromo = () => {
    setPromoCode("");
    setAppliedCode("");
    setCalc(baseCalc);
    clearPromoMessage();
  };

  // Checkout
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms || paying) return;

    try {
      setPaying(true);
      setPayError("");

      const result = await checkoutSubscription({
        planId,
        promoCode: appliedCode,
      });

      const url = result?.paymentUrl ?? result?.redirectUrl ?? result?.checkoutUrl;
      if (url) {
        window.location.href = url;
        return;
      }

      // Razorpay checkout: open it here using `result`
      console.log("Checkout response:", result);
    } catch (err) {
      console.error("Checkout error:", err);
      if (appliedCode && isAlreadyUsed(err)) {
        // Code was redeemed elsewhere in the meantime: drop the discount
        setAppliedCode("");
        setCalc(baseCalc);
        setPromoStatus("used");
        setPromoMessage(
          "This promo code was just redeemed and can't be used again. The discount has been removed."
        );
      } else {
        setPayError(getApiError(err, "Unable to start payment. Please try again."));
      }
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-state">
          <Loader2 className="payment-state-spin" size={22} />
          Loading payment details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-page">
        <div className="payment-state payment-error">{error}</div>
      </div>
    );
  }

  const isFree = pricing.total <= 0;
  const ready = agreedToTerms && !paying;

  return (
    <div className="payment-page">
      <PromoCode />

      <div className="payment-layout">
        {/* ================= CHECKOUT CARD ================= */}
        <div className="payment-card">
          {/* Premium header band */}
          <div className="payment-hero">
            <div className="payment-hero-main">
              <div className="payment-heading-icon">
                <CreditCard size={22} />
              </div>
              <div>
                <p className="payment-eyebrow">SECURE CHECKOUT</p>
                <h1>Payment Gateway</h1>
              </div>
            </div>

            <span className="payment-ssl">
    <Lock size={14} strokeWidth={3} />
    <span>Secure payments powered by</span>
    <strong>Razorpay</strong>
</span>
          </div>

          <form onSubmit={handlePaymentSubmit} className="payment-form">
            <div className="payment-grid">
              {/* LEFT: plan + promo + alert */}
              <div className="payment-col">
                <div className="payment-field">
                  <span className="payment-label">Selected Plan</span>
                  <div className="payment-plan-tile">
                    <span className="payment-plan-icon">
                      <Crown size={18} />
                    </span>
                    <strong title={plan?.planName || ""}>{plan?.planName || "-"}</strong>
                    <BadgeCheck className="payment-plan-check" size={18} />
                  </div>
                </div>

                <div className="payment-field">
                  <label htmlFor="payment-promo" className="payment-label">
                    Enter Promo Code
                  </label>

                  <div className="payment-promo-row">
                    <div className={`payment-promo-input-wrap ${appliedCode ? "is-applied" : ""}`}>
                      <Tag size={17} />
                      <input
                        id="payment-promo"
                        type="text"
                        placeholder="e.g. SAVE20"
                        value={promoCode}
                        onChange={handlePromoChange}
                        readOnly={Boolean(appliedCode)}
                        autoComplete="off"
                      />
                    </div>

                    <button
                      type="button"
                      className={`payment-apply-btn ${appliedCode ? "remove" : ""}`}
                      onClick={appliedCode ? handleRemovePromo : handleApplyPromo}
                      disabled={applying}
                    >
                      {applying && <Loader2 className="btn-spin" size={15} />}
                      {appliedCode ? "Remove" : applying ? "Applying..." : "Apply"}
                    </button>
                  </div>
                </div>

                {promoMessage && (
                  <PaymentAlert
                    key={`${promoStatus}-${promoMessage}`}
                    type={promoStatus || "error"}
                    title={
                      promoStatus === "error" ? "Invalid promo code" : undefined
                    }
                    message={promoMessage}
                    savedText={
                      promoStatus === "success" && pricing.discountAmount > 0
                        ? `You saved ${formatCurrency(pricing.discountAmount)}`
                        : ""
                    }
                    onClose={clearPromoMessage}
                  />
                )}
              </div>

              {/* RIGHT: summary */}
              <div className="payment-summary">
                <h2>
                  <span className="payment-summary-icon">
                    <Receipt size={15} />
                  </span>
                  Payment Summary
                </h2>

                <div className="payment-summary-row" style={{ "--i": 0 }}>
                  <span>Original Price</span>
                  <strong>{formatCurrency(pricing.originalPrice)}</strong>
                </div>

                <div className="payment-summary-row" style={{ "--i": 1 }}>
                  <span>Discount ({pricing.discountPercent}%)</span>
                  <strong
                    className={pricing.discountAmount > 0 ? "discount-value" : ""}
                  >
                    {pricing.discountAmount > 0 ? "− " : ""}
                    <AnimatedAmount
                      value={pricing.discountAmount}
                      format={formatCurrency}
                    />
                  </strong>
                </div>

                <div className="payment-summary-row" style={{ "--i": 2 }}>
                  <span>GST ({Number(pricing.gstPercent).toFixed(2)}%)</span>
                  <strong>{formatCurrency(pricing.gstAmount)}</strong>
                </div>

                <div className="payment-summary-row" style={{ "--i": 3 }}>
                  <span>Other Taxes (0.00%)</span>
                  <strong>{formatCurrency(pricing.otherTaxes)}</strong>
                </div>

                <div className="payment-summary-total" style={{ "--i": 4 }}>
                  <span>Total Payment</span>
                  <strong>
                    <AnimatedAmount value={pricing.total} format={formatCurrency} />
                  </strong>
                </div>
              </div>
            </div>

            {/* FOOTER: terms + button */}
            <div className="payment-footer">
              <label className="payment-terms">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <span className="payment-custom-checkbox">
                  <CheckCircle2 size={15} />
                </span>
                <span>
                  I agree to the{" "}
                  <a href="/terms-and-conditions">Terms & Conditions</a>
                </span>
              </label>

              {payError && (
                <PaymentAlert
                  type="error"
                  title="Payment could not start"
                  message={payError}
                  onClose={() => setPayError("")}
                />
              )}

              <button
                type="submit"
                className={`payment-submit-btn ${ready ? "is-ready" : ""} ${paying ? "is-loading" : ""}`}
                disabled={!agreedToTerms || paying}
              >
                <span className="btn-shine" aria-hidden="true" />
                <span className="btn-content">
                  {paying ? (
                    <>
                      <Loader2 className="btn-spin" size={18} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      {isFree ? (
                        "Activate Plan"
                      ) : (
                        <>Proceed to Pay {formatCurrency(pricing.total)}</>
                      )}
                      <ArrowRight className="btn-arrow" size={18} />
                    </>
                  )}
                </span>
                {paying && <span className="btn-progress" aria-hidden="true" />}
              </button>

              {!agreedToTerms && (
                <p className="payment-hint">Accept the terms to enable payment</p>
              )}

              <div className="payment-trust">
                <span>
                  <Lock size={13} />
                  Encrypted
                </span>
                <span>
                  <ShieldCheck size={13} />
                  Safe checkout
                </span>
                <span>
                  <BadgeCheck size={13} />
                  Instant activation
                </span>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default PaymentGateway;