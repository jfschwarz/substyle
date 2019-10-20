// @flow
import { createContext } from 'react'

import type { SubstyleT } from './types'

type HookContextT = (substyle: SubstyleT) => void

export const HookContext = createContext<?HookContextT>()
const HookProvider = HookContext.Provider

export default HookProvider
