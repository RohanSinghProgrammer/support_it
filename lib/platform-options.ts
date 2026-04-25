export interface PlatformOption {
  value: string
  label: string
  description: string
}

export const platformOptions: PlatformOption[] = [
  {
    value: 'Acme Corp Website',
    label: 'Acme Corp Website',
    description: 'Main customer support portal',
  },
  {
    value: 'Mobile App',
    label: 'Mobile App',
    description: 'iOS and Android app support',
  },
  {
    value: 'API Documentation',
    label: 'API Documentation',
    description: 'Developer support',
  },
]
