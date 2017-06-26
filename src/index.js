class Amanatsu {
  constructor (options) {
    this.defaultOptions = {
      joshi: /(でなければ|について|かしら|くらい|けれど|なのか|ばかり|ながら|ことよ|こそ|こと|さえ|しか|した|たり|だけ|だに|だの|つつ|ても|てよ|でも|とも|から|など|なり|ので|のに|ほど|まで|もの|やら|より|って|で|と|な|に|ね|の|も|は|ば|へ|や|わ|を|か|が|さ|し|ぞ|て)/g,
      keywords: /(&nbsp;|[a-zA-Z0-9]+\.[a-z]{2,}|[一-龠々〆ヵヶゝ]+|[ぁ-んゝ]+|[ァ-ヴー]+|[a-zA-Z0-9]+|[ａ-ｚＡ-Ｚ０-９]+)/g,
      periods: /([.,。、！!？?]+)$/g,
      bracketsBegin: /([(（「『【《])/g,
      bracketsEnd: /([)）」』】》])/g,
      style: 'display:inline-block',
      role: 'presentation',
      className: ''
    }

    this.setOptions(options)
  }

  setOptions (options) {
    if (options) {
      this._options = {}
      Object.keys(this.defaultOptions).forEach(key => {
        this._options[key] = (typeof options[key] === 'undefined')
          ? this.defaultOptions[key]
          : options[key]
      })
    } else {
      this._options = this.defaultOptions
    }

    this._attr = ''
    this._options.style && (this._attr += ` style="${this._options.style}"`)
    this._options.role && (this._attr += ` role="${this._options.role}"`)
    this._options.className && (this._attr += ` class="${this._options.className}"`)
  }

  apply (item) {
    if (typeof item === 'string') {
      return this._applyAsString(item)
    } else if (item instanceof Node) {
      return this._applyAsNode(item)
    }
    return item
  }

  split (str) {
    return this._stringToWords(str)
  }

  _applyAsString (str) {
    const words = this._stringToWords(str)
    return this._wordsToHtml(words)
  }

  _applyAsNode (node) {
    Array.prototype.slice.call(node.childNodes).forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent.trim()
        if (text.length === 0) {
          return
        }

        const helper = document.createElement('div')
        helper.innerHTML = this._applyAsString(text)
        while (helper.firstChild) {
          node.insertBefore(helper.firstChild, child)
        }

        node.removeChild(child)
      } else if (child.nodeType === Node.ELEMENT_NODE && child.childNodes.length > 0) {
        this._applyAsNode(child)
      }
    })
  }

  _wordsToHtml (words) {
    return words.map(word => {
      return `<span${this._attr}>${word.replace(/\s/g, '&nbsp;')}</span>`
    }).join('')
  }

  _stringToWords (str) {
    const base = str.trim().split(this._options.keywords)
    if (base.length < 2) {
      return base
    }
    const words = base.reduce((prev, word) => {
      return [].concat(prev, word.split(this._options.joshi))
    }).reduce((prev, word) => {
      return [].concat(prev, word.split(this._options.bracketsBegin))
    }).reduce((prev, word) => {
      return [].concat(prev, word.split(this._options.bracketsEnd))
    }).filter(word => {
      return word
    })

    const result = []
    let prevType = ''
    let prevWord = ''
    words.forEach(word => {
      const token = word.match(this._options.periods) || word.match(this._options.joshi)

      if (word.match(this._options.bracketsBegin)) {
        prevType = 'bracketBegin'
        prevWord = word
        return
      }

      if (word.match(this._options.bracketsEnd)) {
        result[result.length - 1] += word
        prevType = 'bracketEnd'
        prevWord = word
        return
      }

      if (prevType === 'bracketBegin') {
        word = prevWord + word
        prevWord = ''
        prevType = ''
      }

      // すでに文字が入っている上で助詞が続く場合は結合する
      if (result.length > 0 && token && prevType === '') {
        result[result.length - 1] += word
        prevType = 'keyword'
        prevWord = word
        return
      }

      // 単語のあとの文字がひらがななら結合する
      if (result.length > 0 && (token || (prevType === 'keyword' && word.match(/[ぁ-んゝ]+/g)))) {
        result[result.length - 1] += word
        prevType = ''
        prevWord = word
        return
      }

      result.push(word)
      prevType = 'keyword'
      prevWord = word
    })

    return result
  }
}

module.exports = Amanatsu
