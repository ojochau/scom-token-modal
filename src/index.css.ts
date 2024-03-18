import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const tokenStyle = Styles.style({
  $nest: {
    '&:hover': {
      background: Theme.action.hoverBackground
    }
  }
})

export const tokenListStyle = Styles.style({
  $nest: {
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar': {
      width: '5px',
      height: '5px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: Theme.colors.primary.main,
      borderRadius: '5px'
    }
  }
})

export default Styles.style({
  $nest: {
    '.centered': {
      transform: 'translateY(-50%)'
    },
    '.pointer': {
      cursor: 'pointer'
    },
    '.common-token:hover': {
      border: `1px solid ${Theme.colors.primary.main}`
    }
  }
})
