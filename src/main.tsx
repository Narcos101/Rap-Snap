// import './createPost.js';

import { Devvit, useState } from '@devvit/public-api';
import { storeMaxScoreInRedis, getMaxScoreFromRedis } from './utils/redis.js';

// Defines the messages that are exchanged between Devvit and Web View
type WebViewMessage =
  | {
      type: 'initialLoad';
      data: { username: string; currentCounter: number   };
    }
  | {
      type: 'sendMessage';
      data: { currentMessage: string };
    }
  | {
    type: 'gameOver';
    data: { userScore: string };
  }

Devvit.configure({
  redditAPI: true,
  redis: true,
});


// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Create a Rap Snap Game',
  height: 'tall',
  render: (context) => {
    // Load username with `useAsync` hook
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? 'anon';
    });

    const [attempt,setAttempt] = useState(0)

    const [message,setMessage] = useState("")

    const [state,setState] = useState('initialLoad')

    // Create a reactive state for web view visibility
    const [webviewVisible, setWebviewVisible] = useState(false);

    const onMessage = async (msg: WebViewMessage) => {
      switch (msg.type) {
        case 'initialLoad':
          
        
        break;
        case 'sendMessage': {
          // await context.redis.set(`message_${context.postId}`, msg.data.currentMessage.toString());
          context.ui.webView.postMessage('myWebView', {
            type: 'recieveMessage',
            data: {
              currentMessage: msg.data.currentMessage,
            },
        });break;}
        case 'gameOver':{
          setState('gameOver');
          const userScore = msg.data.userScore;
          await storeMaxScoreInRedis(context,context.userId,context.postId,Number(userScore))
          const maxScore = await getMaxScoreFromRedis(context,context.userId,context.postId)
          console.log(maxScore)
          context.ui.webView.postMessage('myWebView2', {
            type: 'initialData',
            data: {
              currentScore: msg.data.userScore,
              maxScore:maxScore
            }
          });break;
        }

        default:
          throw new Error(`Unknown message type: ${msg satisfies never}`);
      }
    };

    const onShowWebviewClick = () => {
      setWebviewVisible(true);
      context.ui.webView.postMessage('myWebView', {
        type: 'initialLoad',
        data: {
          username: username,
        },
      });
    };

    switch(state){
      case 'initialLoad':{
        return(
          <vstack grow padding="small">
            <vstack
              grow={!webviewVisible}
              height={webviewVisible ? '0%' : '100%'}
              alignment="middle center"
            >
              <text size="xlarge" weight="bold">
                Rap Snap
              </text>
              <spacer />
              <vstack alignment="start middle">
                <hstack>
                  <text size="medium">Username:</text>
                  <text size="medium" weight="bold">
                    {' '}
                    {username ?? ''}
                  </text>
                </hstack>
              </vstack>
              <spacer />
              <button onPress={onShowWebviewClick}>Launch App</button>
            </vstack>
            <vstack grow={webviewVisible} height={webviewVisible ? '100%' : '0%'}>
              <vstack border="thick" borderColor="black" height={webviewVisible ? '100%' : '0%'}>
                <webview
                  id="myWebView"
                  url="page.html"
                  onMessage={(msg) => onMessage(msg as WebViewMessage)}
                  grow
                  height={webviewVisible ? '100%' : '0%'}
                />
              </vstack>
            </vstack>
          </vstack>
        )
      }
      case 'gameOver':{
          return <webview
            id="myWebView2"
            url="gameover.html"
            onMessage={(msg) => onMessage(msg as WebViewMessage)}
            grow
            height={webviewVisible ? '100%' : '0%'}
          />
      }
      default: return <text>Game Over</text>
    }
    
  },
});

export default Devvit;
