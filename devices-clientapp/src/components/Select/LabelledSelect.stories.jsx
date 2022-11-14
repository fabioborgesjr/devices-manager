import React from 'react'
import LabelledSelect from './LabelledSelect'

export default {
  title: 'Labelled Select',
  component: LabelledSelect,
}

function Template(args) {
  return <LabelledSelect {...args} />
}

export const NoLabelSelect = Template.bind({})

NoLabelSelect.args = {
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
  ],
  value: '',
  label: '',
}

export const SelectWithLabel = Template.bind({})

SelectWithLabel.args = {
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
  ],
  value: '2',
  label: '',
  leftLabel: 'Exampĺe left label:',
}
