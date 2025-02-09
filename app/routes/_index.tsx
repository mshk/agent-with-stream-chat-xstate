import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { StreamChat } from 'stream-chat';
import { ClientOnly } from "remix-utils/client-only";
import { useEffect, useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const serverClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY!,
    process.env.STREAM_API_SECRET!
  );
  
  const userId = 'example-user'; // 実際の実装ではセッションなどから取得
  const token = serverClient.createToken(userId);

  return json({
    token,
    apiKey: process.env.STREAM_API_KEY,
    userId,
  });
}

export default function Index() {
  const { token, apiKey, userId } = useLoaderData<typeof loader>();
  const [ChatComponent, setChatComponent] = useState<any>(null);

  useEffect(() => {
    // クライアントサイドでのみインポートを実行
    import("../components/Chat.client").then((module) => {
      setChatComponent(() => module.ChatComponent);
    });
  }, []);

  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => {
        if (!ChatComponent) return <div>Loading...</div>;
        return <ChatComponent apiKey={apiKey!} userId={userId} token={token} />;
      }}
    </ClientOnly>
  );
}
