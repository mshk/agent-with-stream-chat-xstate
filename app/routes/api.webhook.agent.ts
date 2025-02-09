import type { ActionFunctionArgs } from "@remix-run/node";
import { StreamChat } from "stream-chat";
import { GoogleGenerativeAI } from "@google/generative-ai";

// StreamChat クライアントのインスタンスを生成
const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function action({ request }: ActionFunctionArgs) {
  // POST リクエスト以外は拒否
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  // URL のクエリパラメータから parent_message_id を取得
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channel_id");

  console.log("agent: channelId", channelId);

  if (!channelId) {
    return Response.json(
      { error: "Missing channel_id query parameter" },
      { status: 400 }
    );
  }

  try {
    const channel = await serverClient.channel("messaging", channelId);

    const result = await channel.query({
      messages: { limit: 30 },
    });

    const messageTexts = result.messages.map((message) => message.text);

    if (!messageTexts.length) {
      return Response.json({ error: "No messages found" }, { status: 400 });
    }

    console.log("messageTexts", messageTexts);

    const genResult = await model.generateContent(messageTexts);


    const replyText = genResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      return Response.json({ error: "No reply text found" }, { status: 400 });
    }

    const sendReplyMessageResult = await channel.sendMessage({
      text: replyText,
      user: {
        id: "agent",
        name: "電話番号エージェント",
      },
    });

    return Response.json({ status: 200 });
  } catch (error) {
    console.error("メッセージの取得に失敗しました:", error);
    return Response.json(
      { error: "Failed to retrieve messages" },
      { status: 500 }
    );
  }
}
