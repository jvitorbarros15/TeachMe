import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { messages } = req.body;
        const assistantId = process.env.ASSISTANT_ID;

        if (!assistantId) {
            return res.status(500).json({ error: "Missing Assistant ID in .env.local" });
        }

        // Create a new thread for conversation
        const thread = await openai.beta.threads.create();
        const threadId = thread.id;

        // Send the user's latest message to the assistant
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: messages[messages.length - 1].content
        });

        // Run the assistant on this thread
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistantId
        });

        // Wait for the assistant's response
        let runStatus;
        let retries = 10; // Max retries to check for response
        do {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
            runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
            retries--;
        } while (runStatus.status !== "completed" && retries > 0);

        if (runStatus.status !== "completed") {
            return res.status(500).json({ error: "AI did not complete the response" });
        }

        // Fetch assistant's response
        const responseMessages = await openai.beta.threads.messages.list(threadId);
        const assistantResponse = responseMessages.data.find(msg => msg.role === "assistant");

        res.status(200).json({ response: assistantResponse?.content || "No response from AI" });
    } catch (error) {
        console.error("Assistant API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from Assistant" });
    }
}
