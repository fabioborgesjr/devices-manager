import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { FormControl, Grid, Tooltip, Typography } from '@mui/material'
import PureSelect from './PureSelect'

function LabelledSelect({ leftLabel, id, name, autoComplete, options, value, onChange, multiple }) {
  const getToolTipText = useCallback(() => {
    return options
      .filter((option) => value.includes(option.value))
      .map((option) => option.label)
      .join(', ')
  }, [options, value])

  return (
    <Grid container direction='row' sx={{ display: 'flex', alignItems: 'center' }}>
      <Grid item>
        <Typography variant='body2'>{leftLabel}</Typography>
      </Grid>
      <Grid item>
        <Tooltip title={getToolTipText()} placement='top'>
          <FormControl fullWidth variant='standard' sx={{ m: 1, maxWidth: '30vh' }}>
            <PureSelect
              id={id}
              name={name}
              autoComplete={autoComplete}
              options={options}
              value={value}
              onChange={onChange}
              multiple={multiple}
              sx={{ fontSize: '0.875rem' }}
            />
          </FormControl>
        </Tooltip>
      </Grid>
    </Grid>
  )
}

LabelledSelect.propTypes = {
  leftLabel: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  autoComplete: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
}

LabelledSelect.defaultProps = {
  multiple: false,
  value: [],
}

export default LabelledSelect
