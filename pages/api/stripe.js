import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { email, priceId } = req.body; // Price ID from Stripe dashboard

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            customer_email: email,
            line_items: [
                {
                    price: priceId, // Price ID from Stripe dashboard
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_URL}/profile?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/profile?canceled=true`,
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error("Stripe error:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
}
