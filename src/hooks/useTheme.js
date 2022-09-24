import { useColorMode, useCycleList } from "@vueuse/core"
import { computed } from "vue"


function useTheme() {
    

  const colorMode = useColorMode({
    emitAuto: true,
    modes: {
      // classic: "classic",
      // gray: "gray",
      // pink: "pink",
    },
  })

  const theme = [
    "dark", 
    "light", 
    // "classic", 
    // "gray",
    //  "pink"
  ]

  const { next:nextColor } = useCycleList(theme, { initialValue: colorMode })
  const isDark = computed(()=> colorMode.value === "dark");


  return {
    colorMode,
    isDark,
    nextColor
  };
}

export default useTheme;