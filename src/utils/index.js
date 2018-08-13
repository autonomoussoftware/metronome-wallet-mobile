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

export const spacing = props => ({
  marginBottom: theme.spacing(props.m || props.mb || props.my || null),
  marginRight: theme.spacing(props.m || props.mr || props.mx || null),
  marginLeft: theme.spacing(props.m || props.ml || props.mx || null),
  marginTop: theme.spacing(props.m || props.mt || props.my || null),

  paddingBottom: theme.spacing(props.p || props.pb || props.py || null),
  paddingRight: theme.spacing(props.p || props.pr || props.px || null),
  paddingLeft: theme.spacing(props.p || props.pl || props.px || null),
  paddingTop: theme.spacing(props.p || props.pt || props.py || null)
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
