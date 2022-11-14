import * as React from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

const PureSelect = React.forwardRef(({ label, id, options, ...props }, ref) => (
  <Select id={id} ref={ref} labelId={label ? `${id}-label` : undefined} fullWidth {...props}>
    {options.map(({ label: text, value }) => (
      <MenuItem key={value} value={value}>
        {text}
      </MenuItem>
    ))}
  </Select>
))

PureSelect.displayName = 'PureSelect'

PureSelect.defaultProps = {
  defaultValue: '',
  label: '',
}

PureSelect.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  autoComplete: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
}

export default PureSelect
