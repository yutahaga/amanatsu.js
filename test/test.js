import Amanatsu from '../src/index.js'
import test from 'ava'

function tagToArray(text = "") {
  return text.split(/<.*?>(.*?)<\/.*?>/g).filter((word) => word)
}

test(t => {
  const amanatsu = new Amanatsu()
  const source = '常に最新、最高のモバイル。Androidを開発した同じチームから。'
  const expected = ['常に', '最新、', '最高の', 'モバイル。', 'Androidを', '開発した', '同じ', 'チームから。']

  const result = amanatsu.apply(source)

  t.deepEqual(tagToArray(result), expected)
  t.truthy(result.indexOf('<span style="display:inline-block" role="presentation">') > -1)
})

test(t => {
  const amanatsu = new Amanatsu({ className : 'wbr', style : 'font-weight:bold', role : 'debag' })
  const source = '私は好きにした。君たちも好きにしろ。'
  const result = amanatsu.apply(source)
  t.truthy(result.indexOf('class="wbr"') > -1)
  t.truthy(result.indexOf('style="font-weight:bold"') > -1)
  t.truthy(result.indexOf('role="debag"') > -1)
})

test(t => {
  const amanatsu = new Amanatsu({ className : '', style : '', role : '' })
  const source = 'え、蒲田に！？'
  const result = amanatsu.apply(source)
  t.truthy(result.indexOf('class=') <= -1)
  t.truthy(result.indexOf('style=') <= -1)
  t.truthy(result.indexOf('role=') <= -1)
})
