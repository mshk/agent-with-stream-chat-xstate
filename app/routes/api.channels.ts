import { TypedResponse } from "@remix-run/node";
import { StreamChat } from 'stream-chat';
import type { ActionFunctionArgs } from "@remix-run/node";

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export async function action({ request }: ActionFunctionArgs): Promise<TypedResponse> {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { channelId, userId } = await request.json();
  
  try {
    const channel = serverClient.channel('messaging', channelId, {
      created_by_id: userId,
    });
    
    await channel.create();
    return Response.json({ channel });
  } catch (error) {
    return Response.json({ error: 'Failed to create channel' }, { status: 500 });
  }
}