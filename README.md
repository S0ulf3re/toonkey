<div align="center">

**🧨 [Toonkey](https://thetooniverse.xyz) is an open source fork on ThatOneCalculator's [Calckey](https://codeberg.org/thatonecalculator/calckey) that is Free Open Source Software (FOSS)**

</div>

<div>

<img src="https://i.redd.it/yr57inyv88o71.png" align="right" height="320px"/>

# ✨ About Toonkey

- Toonkey is based off of Calckey, a powerful microblogging server based on [Misskey](https://github.com/misskey-dev/misskey) With a few alterations
- Read **[this document](./CALCKEY.md)** all for current and future differences **in Calckey**.
- Notable differences:
    - None yet, but a few planned changes. See the project
</div>

<div style="clear: both;"></div>

# 🥂 Links

- 💸 Liberapay: https://liberapay.com/ThatOneCalculator
- 💁 Matrix support room: https://matrix.to/#/#calckey:matrix.fedibird.com
- 📜 Instance list: https://calckey.fediverse.observer/list
- 📖 JoinFediverse Wiki: https://joinfediverse.wiki/What_is_Calckey%3F

# 📝 Documentation

- Misskey documentation can be found on [Misskey Hub](https://misskey-hub.net/)
  - To make a new Calckey instance, read their documentation for building from source or using Docker, but replace their repo link (`https://github.com/misskey-dev/misskey.git`) with `https://codeberg.org/thatonecalculator/calckey.git`.
- API reference can be found on any Calckey instance's [API doc page](https://stop.voring.me/api-doc)

# 🚚 Migrating from Misskey to Calckey

You need at least NodeJS v16.15.0 (v18.4.0 recommended!) and *exactly* 🧶 Yarn v3.2.2!

> ⚠️ Please don't use NodeJS v18.6.0, as it's known to cause problems.

## Inital setup
Consider adding the Calckey or main Misskey repo as your remote upstream so that you can pull changes from it if need be
```
git add remote upstream https://codeberg.org/thatonecalculator/calckey
```

## Install dependencies

```sh
# nvm install 18.4.0 && nvm alias default 18.4.0 && nvm use 18.4.0
corepack enable
yarn set version berry
```

## Get folder ready

```sh
git clone https://codeberg.org/thatonecalculator/calckey.git
cd calckey/
# git checkout main # if you want only stable versions
cp ../misskey/.config/default.yml ./.config/default.yml # replace `../misskey/` with misskey path, replace `default.yml` with `docker.yml` if you use docker
# cp -r ../misskey/files . # if you don't use object storage
```

## 💅 Customize

- To add custom CSS for all users, edit `./custom/instance.css`.
- To add static assets (such as images for the splash screen), place them in the `./custom/` directory. They'll then be avaliable on `https://yourinstance.tld/static-assets/filename.ext`.

## 🚀 Build and launch!

### `git pull` and run these steps to update Calckey in the future!

```sh
# git pull
yarn install # prepend `YARN_CHECKSUM_BEHAVIOR=update` if it doesn't work
NODE_ENV=production yarn run build && yarn run migrate
# Edit service to point to calckey folder and restart!
```

### 🐳 Docker

```sh
# git pull
sudo docker-compose build
sudo docker-compose stop && sudo docker-compose up -d
```
