import PropTypes from 'prop-types'
import theme from '../theme'

export const errorPropTypes = (...fields) => {
  const shape = fields.reduce((acc, fieldName) => {
    acc[fieldName] = PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ])
    return acc
  }, {})
  return PropTypes.shape(shape).isRequired
}

export const pageStatusPropTypes = {
  pageStatus: PropTypes.oneOf(['entering', 'entered', 'exiting', 'offscreen'])
    .isRequired
}

export const sizes = ({ size }) => ({
  fontSize: size ? theme.sizes[size] : undefined
})

sizes.propTypes = {
  size: PropTypes.oneOf(Object.keys(theme.sizes))
}

export const spacing = props => ({
  marginBottom: theme.spacing(props.m || props.mb || props.my || undefined),
  marginRight: theme.spacing(props.m || props.mr || props.mx || undefined),
  marginLeft: theme.spacing(props.m || props.ml || props.mx || undefined),
  marginTop: theme.spacing(props.m || props.mt || props.my || undefined),

  paddingBottom: theme.spacing(props.p || props.pb || props.py || undefined),
  paddingRight: theme.spacing(props.p || props.pr || props.px || undefined),
  paddingLeft: theme.spacing(props.p || props.pl || props.px || undefined),
  paddingTop: theme.spacing(props.p || props.pt || props.py || undefined)
})

spacing.propTypes = {
  m: PropTypes.number,
  mx: PropTypes.number,
  my: PropTypes.number,
  mt: PropTypes.number,
  mb: PropTypes.number,
  ml: PropTypes.number,
  mr: PropTypes.number,
  p: PropTypes.number,
  px: PropTypes.number,
  py: PropTypes.number,
  pt: PropTypes.number,
  pb: PropTypes.number,
  pl: PropTypes.number,
  pr: PropTypes.number
}
