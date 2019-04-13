// custom typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import { getTheme, setTheme } from './src/utils/theme';

import './src/less/App.Dark.less'
import './src/less/App.Light.less'


setTheme(getTheme())