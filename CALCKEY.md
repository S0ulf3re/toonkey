# All the changes to Calckey from stock Misskey

## Planned

- MFM button
- Classic mode make instance icon bring up new context menu
- Backfill remote users
- User "choices" (recommended users) like Mastodon and Soapbox
- Option to publicize instance blocks
- Better intro/onboarding
- Fully revamp non-logged-in screen
- Remote follow button
- Personal notes for all accounts
- Non-nyaify cat mode
- Timeline filters
- Filter notifications by user
- Join Reason system like Mastodon/Pleroma
- Build flag to remove NSFW/AI stuff
- [Rat mode?](https://stop.voring.me/notes/933fx97bmd)

## Work in progress

- Better Messaging UI
  - Videos can be played in DMs
- Make your password hasn't been pwned
- OCR image captioning
- Admin custom CSS
- Add back time machine (jump to date)
- Improve accesibility score
<details><summary>Current Misskey score is 57/100</summary>

![](https://pool.jortage.com/voringme/misskey/8ff18aae-4dc6-4b08-9e05-a4c9d051a9e3.png)

</details>

## Implemented

- Yarn 3
  - Fix Dockerfile @hanna
  - Upgrade packages with security vunrabilities
- Saner defaults
- Recommended instances timeline
- Improve mobile UX
  - Swipe through pages on mobile
  - Redesigned mobile bottom nav bar
  - Post button on TL
- Star as default reaction
- Like/star button
- Rosé Pine by default (+ non-themable elements made Rosé Pine)
- Better sidebar/navbar
- Add back groups
- MOTD (customizable by admins!)
- Custom randomized splash icons
- Self hosted, newly designed error images
  - Illustrated by [Henki](https://www.youtube.com/c/Henkiwashere)!
  - Licensed under the CC-BY-SA 4.0.
- Better timeline top bar
- Improved note style
  - Make more of the post clickable like every other SNS
  - No more details tag for reply attachments
  - Better CW button
- Mark as read from notifications widget
- Less cluttered notification summary
- Better welcome screen (not logged in)
- vue-plyr as video/audio player
- Ability to turn off "Connection lost" message
- Raw instance info only for moderators
- New spinner animation
- Spinner instead of "Loading..."
- SearchX instead of Google
- Always signToActivityPubGet
- Spacing on group items
- Quotes have solid border
- Reply limit bug fixed
- Make showing the update popup optional
- Improve PWA manifest
- Fix incoming chat scrolling globally
- Update notifier
- Allow admins to set logo URL via admin settings
- Obliteration of Ai-chan
- [Make showing ads optional](https://github.com/misskey-dev/misskey/pull/8996)
- [Tapping avatar in mobile opens account modal](https://github.com/misskey-dev/misskey/pull/9056)
- [OAuth bearer token authentication](https://github.com/misskey-dev/misskey/pull/9021)
- [Styled Repair Tools](https://github.com/misskey-dev/misskey/pull/8956)
- [Option to make enter send message](https://github.com/misskey-dev/misskey/pull/8954)
- [Autocomplete in messaging](https://github.com/misskey-dev/misskey/pull/8955)
- [Profile background as banner](https://codeberg.org/Freeplay/Misskey-Tweaks/src/branch/main/snippets/profile-background.styl)
- [Star is generic like/favorite](https://github.com/JakeMBauer/Misskey-Extras/blob/master/patches/star-is-like.patch)
  - 👍 also triggers generic like/favorite
- [Add additional background for acrylic popups if backdrop-filter is unsupported](https://github.com/misskey-dev/misskey/pull/8671)
- [Add parameters to MFM rotate](https://github.com/misskey-dev/misskey/pull/8549)
- Many changes from [Foundkey](https://akkoma.dev/FoundKeyGang/Foundkey)
	- 0ece67b04c3f0365057624c1068808276ccab981: refactor pages/auth.form.vue to composition API
	- 0ece67b04c3f0365057624c1068808276ccab981: refactor pages/auth.form.vue to composition API
	- 4bc9610d8bf5af736b5e89e4782395705de45d7d: remove unnecessary joins
	- 9ee609d70082f7a6dc119a5d83c0e7c5e1208676: enhance privacy of notes
	- 0fec6e10477b1c1b95d9469fbaf4e249a3722f12: remove ms dependency
	- 46fff77accbe8bf0fd3cc88170d67b997bf2bdc3:  client uses new API for child notes depth
	- c35372a20d22cddb75e93a0b407f2b652cd7faf0:  pack children without detail
	- aca724e0bfff3e58b4d273f3ee744e3f3aa9c39b: enable to fetch replies recursively
	- 2fe64c11502fd8d89c126558cd715e095c83754e: Refactor components/page/page.textarea.vue to composition API
	- 6d3181f9835955e5b79bde5484c74bd70e7f9535: Refactor components/page/page.text.vue to composition API
	- b630cd7eacd695bb705e6748c87f38425ec4ed45:  refactor: add NoteReactions.packMany
	- 3fe351df6d4e21f7748c46adfa6ca165abd030c0: fix: catch errors from packing with detail
	- 63591da33e233b2ed0ab331ae6bb3c9eff5020ae: refactor: colours in queue chart
	- 0f6d94f1e7e1f58cfbf8d07e5f835f8de626842e: backend: improve mutes and blocks
	- e2bf2715a6462ed377b033956d65260157f042ea: fix spelling error
	- 09a7eabda137e77f81ab31f65d69329670693c8d: backend: fix lint "no-throw-literal"
	- 4fbe2e065e75ed3e5b4dfdfd4be3baa03cc447c3: client: fix lint "quotes"
	- 585e4f5c42cfafb6cdf7eb601ab435d6a4d85a96: fix textarea not updating properly
	- 30d8bc9259cb6b72ed76d67b21dbb4cdceca8327: refactor: welcome.setup.vue to composition api
	- 751921e24f37ed707fe44a40d88eebb1299efa35: make emoji picker case insensitive
	- 298febeb9c9501e3e3df16982c08657d1da474e0: enhance: add re-collapsing to quoted notes
	- b0fdedb264db87575063abed45e52ad71ce4a6af: fix lints in folder.vue
	- 6fed87f85d132304eb84b0a59b84dce299a1822f: fix pagination.vue lints
	- Tosti's security fixes
