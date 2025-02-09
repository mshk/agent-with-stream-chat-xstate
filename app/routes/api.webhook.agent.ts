import type { ActionFunctionArgs } from "@remix-run/node";
import { StreamChat } from "stream-chat";

// StreamChat クライアントのインスタンスを生成
const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export async function action({ request }: ActionFunctionArgs) {
  // POST リクエスト以外は拒否
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  // URL のクエリパラメータから parent_message_id を取得
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channel_id");

  console.log('agent: channelId', channelId);

  if (!channelId) {
    return Response.json(
      { error: "Missing channel_id query parameter" },
      { status: 400 }
    );
  }

  try {
    // 親メッセージを取得
    const channel = await serverClient.channel('messaging', channelId);

    
    const result = await channel.query({
      messages: { limit: 30 }
  });

    return Response.json({ status: 200, });

  } catch (error) {
    console.error("メッセージの取得に失敗しました:", error);
    return Response.json({ error: "Failed to retrieve messages" }, { status: 500 });
  }
} 