<!--
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-01 14:41:47
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-04 00:11:04
 * @FilePath: \IUI314\src\components\layout\inner-link.vue
 * @Description: 
-->
<script lang="ts" name="inner-link">
import { h } from 'vue'
import { useRoute } from 'vue-router'
export default {
  setup() {
    const route = useRoute()
    const link = route.meta.link
    if (link === '') {
      return '404'
    }
    let url = link
    const height = document.documentElement.clientHeight - 94.5 + 'px'
    const style = { height: height }

    // 返回渲染函数
    return () =>
      h(
        'div',
        {
          style: style,
        },
        h('iframe', {
          src: url,
          frameborder: 'no',
          width: '100%',
          height: '100%',
          scrolling: 'auto',
        })
      )
  },
}
</script>
