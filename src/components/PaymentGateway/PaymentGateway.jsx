import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CreditCard,
  ShieldCheck,
  Tag,
  CheckCircle2,
} from "lucide-react";

import { getSubscriptionPlans } from "../../api/adminService";
import "./PaymentGateway.css";
import PromoCode from "../common/promocode/PromoCode";

const GST_RATE = 18;
const OTHER_TAX_RATE = 0;

const PaymentGateway = () => {
  const { planId } = useParams();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Reset any leftover window scroll so the admin layout
  // (sidebar + header) always sits in its original position
  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();

    // Keep the window pinned at the top while this page is open
    window.addEventListener("scroll", resetScroll);

    return () => {
      window.removeEventListener("scroll", resetScroll);
    };
  }, []);

  // Fetch selected plan
  useEffect(() => {
    let cancelled = false;

    const fetchPlan = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSubscriptionPlans();

        const plans = Array.isArray(response?.data)
          ? response.data
          : [];

        const selectedPlan = plans.find(
          (item) => String(item.planId) === String(planId)
        );

        if (!cancelled) {
          if (selectedPlan) {
            setPlan(selectedPlan);
          } else {
            setError("Selected subscription plan not found.");
          }
        }
      } catch (err) {
        console.error("Payment plan error:", err);

        if (!cancelled) {
          setError("Unable to load payment details. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPlan();

    return () => {
      cancelled = true;
    };
  }, [planId]);

  // Calculate payment amount
  const pricing = useMemo(() => {
    const originalPrice = Number(plan?.price) || 0;

    const discountAmount =
      (originalPrice * discountPercent) / 100;

    const discountedPrice =
      originalPrice - discountAmount;

    const gstAmount =
      (discountedPrice * GST_RATE) / 100;

    const otherTaxes =
      (discountedPrice * OTHER_TAX_RATE) / 100;

    return {
      originalPrice,
      discountAmount,
      gstAmount,
      otherTaxes,
      total:
        discountedPrice + gstAmount + otherTaxes,
    };
  }, [plan, discountPercent]);

  // Currency formatter
  const formatCurrency = (amount) => {
    return `₹ ${Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // Apply Promo Code
  const handleApplyPromo = (e) => {
    e.preventDefault();

    const code = promoCode.trim().toUpperCase();

    if (!code) {
      setDiscountPercent(0);
      setPromoMessage("Please enter a promo code.");
      return;
    }

    if (code === "SAVE20") {
      setDiscountPercent(20);
      setPromoMessage(
        "Promo code applied successfully! 20% discount added."
      );
    } else {
      setDiscountPercent(0);
      setPromoMessage("Invalid promo code.");
    }
  };

  // Payment submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    if (!agreedToTerms) return;

    // Integrate your payment API / Razorpay checkout here.
    console.log("Selected Plan ID:", planId);
    console.log("Total Payment:", pricing.total);
  };

  // Loading State
  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-state">
          Loading payment details...
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="payment-page">
        <div className="payment-state payment-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      {/* Promo code button + modal */}
      <PromoCode />
      <div className="payment-card">

        {/* Header */}
        <div className="payment-heading">

          <div className="payment-heading-icon">
            <CreditCard size={27} />
          </div>

          <div>
            <p className="payment-eyebrow">
              SECURE CHECKOUT
            </p>

            <h1>Payment Gateway</h1>
          </div>

        </div>

        <div className="payment-heading-line" />

        <form onSubmit={handlePaymentSubmit}>

          {/* Selected Plan */}
          <div className="payment-field">

            <label htmlFor="payment-plan">
              Plan
            </label>

            <input
              id="payment-plan"
              type="text"
              value={plan?.planName || ""}
              readOnly
            />

          </div>

          {/* Promo Code */}
          <div className="payment-field">

            <label htmlFor="payment-promo">
              Enter Promo Code
            </label>

            <div className="payment-promo-row">

              <div className="payment-promo-input-wrap">

                <Tag size={18} />

                <input
                  id="payment-promo"
                  type="text"
                  placeholder="e.g. SAVE20"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    setPromoMessage("");
                  }}
                />

              </div>

              <button
                type="button"
                className="payment-apply-btn"
                onClick={handleApplyPromo}
              >
                Apply
              </button>

            </div>

            {promoMessage && (
              <p
                className={`payment-promo-message ${discountPercent > 0
                  ? "success"
                  : "error"
                  }`}
                role="status"
              >
                {promoMessage}
              </p>
            )}

          </div>

          {/* Pricing Summary */}
          <div className="payment-summary">

            <h2>Payment Summary</h2>

            <div className="payment-summary-row">
              <span>Original Price</span>

              <strong>
                {formatCurrency(pricing.originalPrice)}
              </strong>
            </div>

            <div className="payment-summary-row">
              <span>
                Discount ({discountPercent}%)
              </span>

              <strong
                className={
                  discountPercent > 0
                    ? "discount-value"
                    : ""
                }
              >
                {discountPercent > 0
                  ? `− ${formatCurrency(pricing.discountAmount)}`
                  : "0%"}
              </strong>
            </div>

            <div className="payment-summary-row">
              <span>GST (18.00%)</span>

              <strong>
                {formatCurrency(pricing.gstAmount)}
              </strong>
            </div>

            <div className="payment-summary-row">
              <span>Other Taxes (0.00%)</span>

              <strong>
                {formatCurrency(pricing.otherTaxes)}
              </strong>
            </div>

            <div className="payment-summary-total">
              <span>Total Payment</span>

              <strong>
                {formatCurrency(pricing.total)}
              </strong>
            </div>

          </div>

          {/* Terms & Conditions */}
          <label className="payment-terms">

            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) =>
                setAgreedToTerms(e.target.checked)
              }
            />

            <span className="payment-custom-checkbox">
              <CheckCircle2 size={15} />
            </span>

            <span>
              I agree to the{" "}
              <a href="/terms-and-conditions">
                Terms & Conditions
              </a>
            </span>

          </label>

          {/* Proceed Button */}
          <button
            type="submit"
            className="payment-submit-btn"
            disabled={!agreedToTerms}
          >

            <ShieldCheck size={19} />

            Proceed to Pay{" "}
            {formatCurrency(pricing.total)}

          </button>

          {/* Secure Note */}
          <p className="payment-secure-note">
            <ShieldCheck size={14} />
            Your payment details are handled securely.
          </p>

        </form>

      </div>

    </div>
  );
};

export default PaymentGateway;

// import React, { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   CreditCard,
//   ShieldCheck,
//   Tag,
//   CheckCircle2,
// } from "lucide-react";

// import { getSubscriptionPlans } from "../../api/adminService";
// import "./PaymentGateway.css";
// import PromoCode from "../common/promocode/PromoCode";

// const GST_RATE = 18;
// const OTHER_TAX_RATE = 0;

// const PaymentGateway = () => {
//   const { planId } = useParams();

//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [promoCode, setPromoCode] = useState("");
//   const [discountPercent, setDiscountPercent] = useState(0);
//   const [promoMessage, setPromoMessage] = useState("");
//   const [agreedToTerms, setAgreedToTerms] = useState(false);

//   // Fetch selected plan
//   useEffect(() => {
//     let cancelled = false;

//     const fetchPlan = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await getSubscriptionPlans();

//         const plans = Array.isArray(response?.data)
//           ? response.data
//           : [];

//         const selectedPlan = plans.find(
//           (item) => String(item.planId) === String(planId)
//         );

//         if (!cancelled) {
//           if (selectedPlan) {
//             setPlan(selectedPlan);
//           } else {
//             setError("Selected subscription plan not found.");
//           }
//         }
//       } catch (err) {
//         console.error("Payment plan error:", err);

//         if (!cancelled) {
//           setError("Unable to load payment details. Please try again.");
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchPlan();

//     return () => {
//       cancelled = true;
//     };
//   }, [planId]);

//   // Calculate payment amount
//   const pricing = useMemo(() => {
//     const originalPrice = Number(plan?.price) || 0;

//     const discountAmount =
//       (originalPrice * discountPercent) / 100;

//     const discountedPrice =
//       originalPrice - discountAmount;

//     const gstAmount =
//       (discountedPrice * GST_RATE) / 100;

//     const otherTaxes =
//       (discountedPrice * OTHER_TAX_RATE) / 100;

//     return {
//       originalPrice,
//       discountAmount,
//       gstAmount,
//       otherTaxes,
//       total:
//         discountedPrice + gstAmount + otherTaxes,
//     };
//   }, [plan, discountPercent]);

//   // Currency formatter
//   const formatCurrency = (amount) => {
//     return `₹ ${Number(amount || 0).toLocaleString(
//       "en-IN",
//       {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }
//     )}`;
//   };

//   // Apply Promo Code
//   const handleApplyPromo = (e) => {
//     e.preventDefault();

//     const code = promoCode.trim().toUpperCase();

//     if (!code) {
//       setDiscountPercent(0);
//       setPromoMessage("Please enter a promo code.");
//       return;
//     }

//     if (code === "SAVE20") {
//       setDiscountPercent(20);
//       setPromoMessage(
//         "Promo code applied successfully! 20% discount added."
//       );
//     } else {
//       setDiscountPercent(0);
//       setPromoMessage("Invalid promo code.");
//     }
//   };

//   // Payment submission
//   const handlePaymentSubmit = (e) => {
//     e.preventDefault();

//     if (!agreedToTerms) return;

//     // Integrate your payment API / Razorpay checkout here.
//     console.log("Selected Plan ID:", planId);
//     console.log("Total Payment:", pricing.total);
//   };

//   // Loading State
//   if (loading) {
//     return (
//       <div className="payment-page">
//         <div className="payment-state">
//           Loading payment details...
//         </div>
//       </div>
//     );
//   }

//   // Error State
//   if (error) {
//     return (
//       <div className="payment-page">
//         <div className="payment-state payment-error">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="payment-page">
//       {/* Promo code button + modal */}
//       <PromoCode />
//       <div className="payment-card">

//         {/* Header */}
//         <div className="payment-heading">

//           <div className="payment-heading-icon">
//             <CreditCard size={27} />
//           </div>

//           <div>
//             <p className="payment-eyebrow">
//               SECURE CHECKOUT
//             </p>

//             <h1>Payment Gateway</h1>
//           </div>

//         </div>

//         <div className="payment-heading-line" />

//         <form onSubmit={handlePaymentSubmit}>

//           {/* Selected Plan */}
//           <div className="payment-field">

//             <label htmlFor="payment-plan">
//               Plan
//             </label>

//             <input
//               id="payment-plan"
//               type="text"
//               value={plan?.planName || ""}
//               readOnly
//             />

//           </div>

//           {/* Promo Code */}
//           <div className="payment-field">

//             <label htmlFor="payment-promo">
//               Enter Promo Code
//             </label>

//             <div className="payment-promo-row">

//               <div className="payment-promo-input-wrap">

//                 <Tag size={18} />

//                 <input
//                   id="payment-promo"
//                   type="text"
//                   placeholder="e.g. SAVE20"
//                   value={promoCode}
//                   onChange={(e) => {
//                     setPromoCode(e.target.value);
//                     setPromoMessage("");
//                   }}
//                 />

//               </div>

//               <button
//                 type="button"
//                 className="payment-apply-btn"
//                 onClick={handleApplyPromo}
//               >
//                 Apply
//               </button>

//             </div>

//             {promoMessage && (
//               <p
//                 className={`payment-promo-message ${discountPercent > 0
//                   ? "success"
//                   : "error"
//                   }`}
//                 role="status"
//               >
//                 {promoMessage}
//               </p>
//             )}

//           </div>

//           {/* Pricing Summary */}
//           <div className="payment-summary">

//             <h2>Payment Summary</h2>

//             <div className="payment-summary-row">
//               <span>Original Price</span>

//               <strong>
//                 {formatCurrency(pricing.originalPrice)}
//               </strong>
//             </div>

//             <div className="payment-summary-row">
//               <span>
//                 Discount ({discountPercent}%)
//               </span>

//               <strong
//                 className={
//                   discountPercent > 0
//                     ? "discount-value"
//                     : ""
//                 }
//               >
//                 {discountPercent > 0
//                   ? `− ${formatCurrency(pricing.discountAmount)}`
//                   : "0%"}
//               </strong>
//             </div>

//             <div className="payment-summary-row">
//               <span>GST (18.00%)</span>

//               <strong>
//                 {formatCurrency(pricing.gstAmount)}
//               </strong>
//             </div>

//             <div className="payment-summary-row">
//               <span>Other Taxes (0.00%)</span>

//               <strong>
//                 {formatCurrency(pricing.otherTaxes)}
//               </strong>
//             </div>

//             <div className="payment-summary-total">
//               <span>Total Payment</span>

//               <strong>
//                 {formatCurrency(pricing.total)}
//               </strong>
//             </div>

//           </div>

//           {/* Terms & Conditions */}
//           <label className="payment-terms">

//             <input
//               type="checkbox"
//               checked={agreedToTerms}
//               onChange={(e) =>
//                 setAgreedToTerms(e.target.checked)
//               }
//             />

//             <span className="payment-custom-checkbox">
//               <CheckCircle2 size={15} />
//             </span>

//             <span>
//               I agree to the{" "}
//               <a href="/terms-and-conditions">
//                 Terms & Conditions
//               </a>
//             </span>

//           </label>

//           {/* Proceed Button */}
//           <button
//             type="submit"
//             className="payment-submit-btn"
//             disabled={!agreedToTerms}
//           >

//             <ShieldCheck size={19} />

//             Proceed to Pay{" "}
//             {formatCurrency(pricing.total)}

//           </button>

//           {/* Secure Note */}
//           <p className="payment-secure-note">
//             <ShieldCheck size={14} />
//             Your payment details are handled securely.
//           </p>

//         </form>

//       </div>

//     </div>
//   );
// };

// export default PaymentGateway;
