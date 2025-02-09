import { Channel as StreamChannel, StreamChat } from 'stream-chat';

import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
} from 'stream-chat-react';
import { useState, useEffect } from 'react';
type ChatComponentProps = {
  apiKey: string;
  userId: string;
  token: string;
};

export function ChatComponent({ apiKey, userId, token }: ChatComponentProps) {
  const chatClient = StreamChat.getInstance(apiKey);
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  
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

  useEffect(() => {
    const currentChannel = chatClient.channel('messaging', 'example-channel', {
      name: 'Example Channel',
      members: [userId],
    });
    setChannel(currentChannel);
  }, [chatClient, userId]);


  // Stream ChatのWebhookを設定するのは面倒なので、
  const customSubmitHandler = async (message: any) => {
    console.log('customSubmitHandler', message);


    await channel?.sendMessage(message);

    console.log('sendMessage', message);

    fetch(`/api/webhook/agent?channel_id=${channel.id}`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => console.log('Agent API response:', data))
      .catch(err => console.error('Error calling Agent API:', err));
  };

  return (
    <div style={{ height: '100vh' }}>
      <Chat client={chatClient} theme="str-chat__theme-light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput overrideSubmitHandler={customSubmitHandler} />
          </Window>
        </Channel>
      </Chat>
    </div>
  );
}