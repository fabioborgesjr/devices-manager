import React from 'react'
import PureSelect from './PureSelect'

export default {
  title: 'Pure Select',
  component: PureSelect,
}

function Template(args) {
  return <PureSelect {...args} />
}

export const SelectOptions = Template.bind({})

SelectOptions.args = {
  id: '',
  name: '',
  autoComplete: '',
  options: [
    {
      label: 'Option 1',
      value: '1',
    },
    {
      label: 'Option 2',
      value: '2',
    },
    {
      label: 'Option 3',
      value: '3',
    },
  ],
  defaultValue: '',
  label: '',
}

export const SelectDefaultValue = Template.bind({})

SelectDefaultValue.args = {
  id: '',
  name: '',
  autoComplete: '',
  options: [
    {
      label: 'Option 1',
      value: '1',
    },
    {
      label: 'Option 2',
      value: '2',
    },
    {
      label: 'Option 3',
      value: '3',
    },
  ],
  defaultValue: '2',
  label: '',
}
