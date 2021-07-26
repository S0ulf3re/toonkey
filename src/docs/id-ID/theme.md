# Tema

Kamu bisa mengubah tampilan klien Misskey dengan mengatur temanya.

## Pengaturan tema
Pengaturan > Tema

## Membuat tema
テーマコードはJSON5で記述されたテーマオブジェクトです。 テーマは以下のようなオブジェクトです。
``` js
{
    id: '17587283-dd92-4a2c-a22c-be0637c9e22a',

    name: 'Danboard',
    author: 'syuilo',

    base: 'light',

    props: {
        accent: 'rgb(218, 141, 49)',
        bg: 'rgb(218, 212, 190)',
        fg: 'rgb(115, 108, 92)',
        panel: 'rgb(236, 232, 220)',
        renote: 'rgb(100, 152, 106)',
        link: 'rgb(100, 152, 106)',
        mention: '@accent',
        hashtag: 'rgb(100, 152, 106)',
        header: 'rgba(239, 227, 213, 0.75)',
        navBg: 'rgb(216, 206, 182)',
        inputBorder: 'rgba(0, 0, 0, 0.1)',
    },
}

```

* `id` ... ID tema unik.Dianjurkan menggunakan UUID.
* `name` ... Nama tema
* `author` ... Pembuat tema
* `desc` ... Deskripsi tema (opsional)
* `base` ... Apakah tema cerah, ataukah tema gelap
    * Jika `light` maka akan terdaftar sebagai tema mode cerah, jika `dark` maka akan terdaftar sebagai tema mode gelap.
    * テーマはここで設定されたベーステーマを継承します。
* `props` ... Definisi gaya tema.Akan dijelaskan sebagai berikut.

### Definisi gaya tema
`props`下にはテーマのスタイルを定義します。 キーがCSSの変数名になり、バリューで中身を指定します。 なお、この`props`オブジェクトはベーステーマから継承されます。 ベーステーマは、このテーマの`base`が`light`なら[_light.json5](https://github.com/misskey-dev/misskey/blob/develop/src/client/themes/_light.json5)で、`dark`なら[_dark.json5](https://github.com/misskey-dev/misskey/blob/develop/src/client/themes/_dark.json5)です。 つまり、このテーマ内の`props`に`panel`というキーが無くても、そこにはベーステーマの`panel`があると見なされます。

#### バリューで使える構文
* 16進数で表された色
    * 例: `#00ff00`
* `rgb(r, g, b)`形式で表された色
    * 例: `rgb(0, 255, 0)`
* `rgb(r, g, b, a)`形式で表された透明度を含む色
    * 例: `rgba(0, 255, 0, 0.5)`
* 他のキーの値の参照
    * `@{キー名}`と書くと他のキーの値の参照になります。`{キー名}`は参照したいキーの名前に置き換えます。
    * 例: `@panel`
* 定数(後述)の参照
    * `${定数名}`と書くと定数の参照になります。`{定数名}`は参照したい定数の名前に置き換えます。
    * 例: `$main`
* 関数(後述)
    * `:{関数名}<{引数}<{色}`

#### Konstanta
「CSS変数として出力はしたくないが、他のCSS変数の値として使いまわしたい」値があるときは、定数を使うと便利です。 キー名を`$`で始めると、そのキーはCSS変数として出力されません。

#### Fungsi
wip
