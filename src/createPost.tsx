import { Devvit } from '@devvit/public-api';

import {type Context, type JobContext} from '@devvit/public-api'
// import {Preview} from '../components/preview.js'


const Preview = ()=>{
  return (
    <text>Hello World</text>
  )
}

export async function submitNewPost(
  ctx: Context | JobContext,
  ui: boolean
): Promise<void> {
  if (!ctx.subredditName) throw Error('no sub name')

  // const matchSetNum = await redisPostCountInc(ctx.redis)

  // requires special permission: post as viewer.
  const post = await ctx.reddit.submitPost({
    preview: <Preview />,
    subredditName: ctx.subredditName,
    title:'test'
    // title: `Fiddlesticks Match #${matchSetNum}`
  })

  if (ui && 'ui' in ctx) {
    ctx.ui.showToast({
      appearance: 'success',
      text: `Fiddlesticks match #${1} set.`
    })
    ctx.ui.navigateTo(post)
  }
  console.log(
    `fiddlesticks match #${1} set by ${ctx.userId ?? 'fiddlesticks-app'}`
  )
}


// Adds a new menu item to the subreddit allowing to create a new post
// Devvit.addMenuItem({
//   label: 'Create New Devvit Post (with Web View)',
//   location: 'subreddit',
//   onPress: async (_event, context) => {
//     const { reddit, ui } = context;
//     const subreddit = await reddit.getCurrentSubreddit();
//     const post = await reddit.submitPost({
//       title: 'Webview Example',
//       subredditName: subreddit.name,
//       // The preview appears while the post loads
//       preview: (
//         <vstack height="100%" width="100%" alignment="middle center">
//           <text size="large">Loading ...</text>
//         </vstack>
//       ),
//     });
//     ui.showToast({ text: 'Created post!' });
//     ui.navigateTo(post);
//   },
// });
