/* 完全叫GPT移植的L2D组件，Cubism 5 SDK for Web R5 */
/* 独立于Danbouru主题的组件，放在themes/danbouru/components/Live2DWidget.js中 */
/* 不依赖notion后台的宠物配置，直接在组件中控制是否加载 */
// import { isMobile } from '@/lib/utils'
import { useEffect } from 'react'

export default function Live2DWidget() {
  useEffect(() => {
    console.log('[Danbouru Live2D] component mounted')
/*
    const showPet = JSON.parse(siteConfig('WIDGET_PET'))

    console.log('[Danbouru Live2D] WIDGET_PET:', showPet)
    console.log('[Danbouru Live2D] isMobile:', isMobile())

    if (!showPet) {
      console.log('[Danbouru Live2D] disabled by WIDGET_PET')
      return
    }
*/
    // 小于 768px 的窗口不显示；平板和电脑显示
    if (window.innerWidth < 768) {
      return
    }
    /*
    if (isMobile()) {
      console.log('[Danbouru Live2D] mobile detected, skip loading')
      return
    }

    if (window.__danbouruLive2DLoaded) {
      console.log('[Danbouru Live2D] already loaded')
      return
    }
    */

    const loadWidget = () => {
      console.log('[Danbouru Live2D] Cubism Core ready')

      if (document.getElementById('danbouru-live2d-widget')) {
        console.log('[Danbouru Live2D] widget script already exists')
        return
      }

      const widgetScript = document.createElement('script')

      widgetScript.id = 'danbouru-live2d-widget'
      widgetScript.type = 'module'
      widgetScript.src = '/live2d/assets/live2d-widget.js'

      widgetScript.onload = () => {
        window.__danbouruLive2DLoaded = true
        console.log('[Danbouru Live2D] widget loaded successfully')
      }

      widgetScript.onerror = error => {
        console.error('[Danbouru Live2D] widget load failed', error)
      }

      document.body.appendChild(widgetScript)
    }

    if (window.Live2DCubismCore) {
      console.log('[Danbouru Live2D] Cubism Core already exists')
      loadWidget()
      return
    }

    const existingCore = document.getElementById('danbouru-live2d-core')

    if (existingCore) {
      console.log('[Danbouru Live2D] waiting for existing Cubism Core')

      existingCore.addEventListener('load', loadWidget, {
        once: true
      })

      return
    }

    console.log('[Danbouru Live2D] loading Cubism Core')

    const coreScript = document.createElement('script')

    coreScript.id = 'danbouru-live2d-core'
    coreScript.src = '/live2d/Core/live2dcubismcore.js'

    coreScript.onload = loadWidget

    coreScript.onerror = error => {
      console.error('[Danbouru Live2D] Cubism Core load failed', error)
    }

    document.body.appendChild(coreScript)
  }, [])

  return null
}