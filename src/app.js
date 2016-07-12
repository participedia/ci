require('purecss')
require('./global.css')

import React from 'react'
import {render} from 'react-dom'
import BuildTable from './BuildTable'

render(<BuildTable />, document.getElementById('root'))
