'use client'

import { ExternalField } from '@puckeditor/core'
import { ImagePickerField } from '../components/ImagePickerField'

export const imagePickerField: ExternalField<string> = {
  type: 'external',
  render: ({ field, name, value, onChange }) => {
    return (
      <ImagePickerField
        label={field.label || name}
        value={value || ''}
        onChange={onChange}
        placeholder="Choose an image from your media library"
      />
    )
  },
}
