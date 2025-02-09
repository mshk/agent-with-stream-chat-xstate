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

  const { userId } = await request.json();
  
  try {
    const token = serverClient.createToken(userId);
    return Response.json({ token });
  } catch (error) {
    return Response.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
