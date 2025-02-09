import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from 'stream-chat-react';

type ChatComponentProps = {
  apiKey: string;
  userId: string;
  token: string;
};


export function ChatComponent({ apiKey, userId, token }: ChatComponentProps) {
  const chatClient = StreamChat.getInstance(apiKey);
  
  if (!chatClient.userID) {
    chatClient.connectUser(
      {
        id: userId,
        name: 'Example User',
        image: 'https://getstream.io/random_svg/?id=example-user',
      },
      token,
    );
  }

  const channel = chatClient.channel('messaging', 'example-channel', {
    name: 'Example Channel',
    members: [userId],
  });

  return (
    <div style={{ height: '100vh' }}>
      <Chat client={chatClient} theme="str-chat__theme-light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}