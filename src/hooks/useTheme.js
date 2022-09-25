import { useColorMode, useCycleList } from "@vueuse/core"
import { computed,watch } from "vue"

import useSettingsStore from "@/store/modules/settings"


function useTheme() {
    

  const colorMode = useColorMode();

  const theme = [
    "dark", 
    "light", 
    // "classic", 
    // "gray",
    //  "pink"
  ]

  const { next:nextColor } = useCycleList(theme, { initialValue: colorMode })
  const isDark = computed(()=> colorMode.value === "dark");


  watch(()=>colorMode.value,(val)=>{
    if(val==="dark"){
      useSettingsStore().setIsDark(true)
    }else{
      useSettingsStore().setIsDark(false)
    }
  })


  return {
    colorMode,
    isDark,
    nextColor
  };
}

export default useTheme;