// custom typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import { getTheme, setTheme } from './src/utils/theme'

import './src/less/Base.less'
import './src/less/App.Dark.less'
import './src/less/App.Light.less'

require('prismjs/themes/prism-tomorrow.css')
// require('prismjs/plugins/line-numbers/prism-line-numbers.css')

setTheme(getTheme())
