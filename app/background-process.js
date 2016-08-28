// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu } from 'electron'
import log from 'loglevel'
import env from './env'

import * as beakerBrowser from './background-process/browser'
import * as plugins from './background-process/plugins'
import * as beakerAPIs from './background-process/beaker-apis'
import * as webAPIs from './background-process/web-apis'
import * as windows from './background-process/ui/windows'
import buildWindowMenu from './background-process/ui/window-menu'
import registerContextMenu from './background-process/ui/context-menu'
import * as downloads from './background-process/ui/downloads'


import * as beakerProtocol from './background-process/protocols/beaker'
import * as beakerFaviconProtocol from './background-process/protocols/beaker-favicon'

// configure logging
log.setLevel('trace')

// load the installed protocols
plugins.registerStandardSchemes()

app.on('ready', function () {
  //databases
  beakerAPIs.setupAPIs()

  // base
  beakerBrowser.setup()
  
  
  // ui
  Menu.setApplicationMenu(Menu.buildFromTemplate(buildWindowMenu(env)))
  registerContextMenu()
  windows.setup()
  downloads.setup()

  // protocols
  beakerProtocol.setup()
  beakerFaviconProtocol.setup()
  plugins.setupProtocolHandlers()

  
  // web APIs
  plugins.setupWebAPIs()
  webAPIs.setup()
})

app.on('window-all-closed', function () {
  // it's normal for OSX apps to stay open, even if all windows are closed
  // but, since we have an uncloseable tabs bar, let's close when they're all gone
  app.quit()
})