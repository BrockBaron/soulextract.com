import { rgba } from 'polished';
import iconURL from '../../images/favicon.png';

const styles = theme => ({
  root: {
    position: 'relative',
    display: 'block',
    margin: 0
  },
  lineTop: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    borderTop: '1px solid ' + rgba(theme.color.primary.dark, 0.25),
    width: ({ energy }) => energy.animate ? '0%' : '100%'
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    padding: [40, 20],
    transition: [
      'background 200ms ease-out',
      'color 200ms ease-out'
    ].join(','),

    '&:hover, &:focus': {
      backgroundColor: ({ energy }) => energy.entered && rgba(theme.color.secondary.main, 0.05)
    }
  },
  media: {
    display: 'flex',
    padding: [0, 0, 20, 0],
    width: '100%',
    height: 200
  },
  image: {
    flex: 1,
    backgroundColor: '#000',
    backgroundImage: `url(${iconURL})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  info: {
    flex: 1,
    color: theme.color.primary.main,
    wordBreak: 'break-word'
  },
  title: {
    fontSize: 20
  },
  message: {
    margin: 0
  },

  '@media screen and (min-width: 768px)': {
    link: {
      flexDirection: 'row',
      padding: 40
    },
    media: {
      padding: [0, 20, 0, 0],
      width: 180,
      height: 120
    }
  }
});

export { styles };