import axios from "../axios";

export interface Subscription {
    plan: string;
    plan_status: "active" | "trialing" | "canceled";
    plan_renewal: string | null;
    scan_limit: number;
    scan_usage: number;
}

// 1. Get current subscription info
export async function getUserSubscription(): Promise<Subscription> {
    const res = await axios.get("/user/subscription");
    return res.data;
}

// 2. Create Stripe checkout session
export async function createCheckoutSession(
    plan: "starter" | "pro" | "growth" | "premium",
    billingCycle: "monthly" | "yearly" = "monthly",
    mode: "byok" | "managed" = "byok"
) {
    const res = await axios.post("/stripe/create-checkout-session", {
        plan,
        billingCycle,
        mode,
    });
    return res.data;
}

// 3. Open Stripe customer portal
export async function createCustomerPortal() {
    const res = await axios.post("/stripe/create-customer-portal");
    return res.data;
}

// 4. Purchase credit pack
export async function createCreditPurchaseSession(
    pack: "credit_1000" | "credit_2000"
) {
    const res = await axios.post("/stripe/create-credit-session", {
        pack,
    });
    return res.data;
}
