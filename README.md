# Amanatsu.js
Amanatsu.js は、 [mikan.js](https://github.com/trkbt10/mikan.js/) から派生したソフトウェアです。

正規表現を用いた簡易形態素解析による、単語の改行問題への解決策を提供します。

## Mikan.js からの主な変更点

* 助詞などのパターンをオプションで変更可能
* DOM 要素に簡単に適用可能
* ES2015 で書き直し
* その他、バグの修正等

## インストール
`npm install amanatsu`

## 使い方
`apply()` メソッドは引数に文字列と DOM 要素のどちらかを指定することが出来ます。
文字列を引数にするとHTML文字列が返ってきて、DOM 要素を引数にすると直接 DOM を操作します。

### Node.js で用いる場合

```js
const Amanatsu = require('amanatsu');
const amanatsu = new Amanatsu({
  style: false,
  className: 'nowrap'
})
console.log(amanatsu.apply('常に最新、最高のモバイル。Androidを開発した同じチームから。'));
/*
<span class="nowrap" role="presentation">常に</span>
<span class="nowrap" role="presentation">最新、</span>
<span class="nowrap" role="presentation">最高の</span>
<span class="nowrap" role="presentation">モバイル。</span>
<span class="nowrap" role="presentation">Androidを</span>
<span class="nowrap" role="presentation">開発した</span>
<span class="nowrap" role="presentation">同じ</span>
<span class="nowrap" role="presentation">チームから。</span>
*/

console.log(amanatsu.split('常に最新、最高のモバイル。Androidを開発した同じチームから。'));
// ['常に', '最新、', '最高の', 'モバイル。', 'Androidを', '開発した', '同じ', 'チームから。']
```

### Web で用いる場合

```html
<div>常に最新、最高のモバイル。<b>Android</b>を開発した同じチームから。</div>
<script src="amanatsu.js"></script>
<script>
  var amanatsu = new Amanatsu();
  window.addEventListener('load', function () {
    amanatsu.apply(document.body);
  }, false)
</script>
```

### Reactで用いる場合
```jsx
<div dangerouslySetInnerHTML={{__html : amanatsu.apply('常に最新、最高のモバイル。Androidを開発した同じチームから。')}} />
```

もしくは
```js
{amanatsu.split('常に最新、最高のモバイル。Androidを開発した同じチームから。').map(text => <span>{text}</span>)}
```
