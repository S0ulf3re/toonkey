<div align="center">
<a href="https://stop.voring.me/">
	<img src="./assets/title_float.svg" alt="Calckey logo" style="border-radius:50%" width="400"/>
</a>

**🌎 **[Calckey](https://stop.voring.me/)** is an open source, decentralized social media platform that's free forever! 🚀**

</div>

<div>

<img src="https://pool.jortage.com/voringme/misskey/e7cd2a17-8b23-4e1e-b5cf-709480c623e2.png" align="right" height="320px"/>

## ✨ Features
- **ActivityPub support**\
Not on Calckey? No problem! Not only can Calckey/Misskey instances talk to each other, but you can make friends with people on other networks like Mastodon and Pixelfed!
- **Reactions**\
You can add emoji reactions to any post! No longer are you bound by a like button, show everyone exactly how you feel with the tap of a button.
- **Drive**\
With Calckey's built in drive, you get cloud storage right in your social media, where you can upload any files, make folders, and find media from posts you've made!
- **Rich Web UI**\
	Calckey has a rich and easy to use Web UI!
	It is highly customizable, from changing the layout and adding widgets to making custom themes.
	Furthermore, plugins can be created using AiScript, an original programming language.
- And much more...

</div>

<div style="clear: both;"></div>

## 📝 Documentation

Misskey documentation can be found at [Misskey Hub](https://misskey-hub.net/).

## 🤔 What's different about Calckey?
Read [this](./CALCKEY.md) for current and future differences.

## 🛻 Migrating from Misskey to Calckey

You need at least 🐢 NodeJS v18.4.0 and *exactly* 🧶 Yarn v3.2.1!

```sh
corepack enable
git clone https://codeberg.org/thatonecalculator/calckey.git
cd calckey/
cp ../misskey/.config/default.yml ./.config/default.yml # or wherever misskey folder is
yarn --version # Check version is yarn 3.2.1!
yarn install
NODE_ENV=production npm run build && npm run migrate
# Edit service to point to calckey service and restart
```
