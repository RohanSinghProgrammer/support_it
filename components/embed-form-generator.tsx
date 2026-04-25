'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Code2, Copy, ExternalLink, Link2, MonitorSmartphone } from 'lucide-react'
import Select, { SingleValue } from 'react-select'
import { parseAsString, useQueryState } from 'nuqs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { platformOptions, PlatformOption } from '@/lib/platform-options'

function getEmbedPath(platform?: string) {
  if (!platform) {
    return '/embed/form'
  }

  return `/embed/form?platform=${encodeURIComponent(platform)}`
}

export function EmbedFormGenerator() {
  const [platform, setPlatform] = useQueryState('platform', parseAsString)
  const [origin, setOrigin] = useState('')
  const [copied, setCopied] = useState<'url' | 'code' | null>(null)

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const selectedPlatform = useMemo(
    () => platformOptions.find((option) => option.value === platform) ?? null,
    [platform]
  )

  const embedPath = getEmbedPath(selectedPlatform?.value)
  const embedUrl = origin ? `${origin}${embedPath}` : embedPath
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="760" style="border:0;border-radius:16px;overflow:hidden;" title="Support request form" loading="lazy"></iframe>`

  const copyToClipboard = async (value: string, type: 'url' | 'code') => {
    await navigator.clipboard.writeText(value)
    setCopied(type)
    window.setTimeout(() => {
      setCopied((current) => (current === type ? null : current))
    }, 1800)
  }

  const selectStyles = {
    control: (base: Record<string, unknown>, state: { isFocused: boolean }) => ({
      ...base,
      minHeight: '44px',
      borderRadius: '0.75rem',
      borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--border))',
      boxShadow: state.isFocused ? '0 0 0 3px hsl(var(--ring) / 0.15)' : 'none',
      backgroundColor: 'hsl(var(--background))',
      '&:hover': {
        borderColor: 'hsl(var(--ring))',
      },
    }),
    menu: (base: Record<string, unknown>) => ({
      ...base,
      borderRadius: '0.75rem',
      overflow: 'hidden',
      backgroundColor: 'hsl(var(--popover))',
      border: '1px solid hsl(var(--border))',
      boxShadow: '0 12px 32px hsl(var(--foreground) / 0.08)',
    }),
    option: (
      base: Record<string, unknown>,
      state: { isFocused: boolean; isSelected: boolean }
    ) => ({
      ...base,
      backgroundColor: state.isSelected
        ? 'hsl(var(--accent))'
        : state.isFocused
          ? 'hsl(var(--secondary))'
          : 'transparent',
      color: state.isSelected
        ? 'hsl(var(--accent-foreground))'
        : 'hsl(var(--foreground))',
      cursor: 'pointer',
    }),
    input: (base: Record<string, unknown>) => ({
      ...base,
      color: 'hsl(var(--foreground))',
    }),
    singleValue: (base: Record<string, unknown>) => ({
      ...base,
      color: 'hsl(var(--foreground))',
    }),
    placeholder: (base: Record<string, unknown>) => ({
      ...base,
      color: 'hsl(var(--muted-foreground))',
    }),
    menuPortal: (base: Record<string, unknown>) => ({
      ...base,
      zIndex: 60,
    }),
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,480px)]">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Code2 className="h-5 w-5 text-accent" />
            Embed Generator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pick a platform, preview the embeddable support form, and copy the URL or iframe
            snippet for client integration.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Platform</p>
            <Select<PlatformOption, false>
              inputId="platform-select"
              instanceId="platform-select"
              isClearable
              isSearchable
              options={platformOptions}
              value={selectedPlatform}
              onChange={(option: SingleValue<PlatformOption>) => {
                void setPlatform(option?.value ?? null)
              }}
              placeholder="Search and select a platform..."
              noOptionsMessage={({ inputValue }) =>
                inputValue ? `No platforms found for "${inputValue}"` : 'No platforms found'
              }
              styles={selectStyles}
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            />
            <p className="text-xs text-muted-foreground">
              The selected platform is passed into `/embed/form` through the URL query string.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-border/60 bg-muted/15 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Link2 className="h-4 w-4 text-accent" />
              Embed URL
            </div>
            <code className="block overflow-x-auto break-all rounded-lg bg-background px-3 py-2 text-sm text-foreground">
              {embedUrl}
            </code>
            <Button
              variant="outline"
              className="w-full gap-2 sm:w-auto"
              onClick={() => copyToClipboard(embedUrl, 'url')}
            >
              {copied === 'url' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied === 'url' ? 'URL Copied' : 'Copy Form URL'}
            </Button>
          </div>

          <div className="space-y-3 rounded-xl border border-border/60 bg-muted/15 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Code2 className="h-4 w-4 text-accent" />
              Embeddable iframe code
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-background p-3 text-xs text-foreground">
              <code>{embedCode}</code>
            </pre>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button
                className="w-full gap-2 sm:w-auto"
                onClick={() => copyToClipboard(embedCode, 'code')}
              >
                {copied === 'code' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === 'code' ? 'Code Copied' : 'Copy Embedded Code'}
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <a href={embedPath} target="_blank" rel="noreferrer" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Open Standalone Form
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/60 shadow-sm xl:sticky xl:top-24">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MonitorSmartphone className="h-5 w-5 text-accent" />
            Live Preview
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            This iframe renders the same `/embed/form` experience your clients would embed.
          </p>
        </CardHeader>
        <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
          <div className="mx-auto w-full max-w-sm rounded-2xl border border-border/60 bg-muted/20 p-2 sm:p-3 xl:max-w-none">
            <div className="overflow-hidden rounded-[1.25rem] border border-border/60 bg-background shadow-[inset_0_1px_0_hsl(var(--background)),0_20px_40px_hsl(var(--foreground)/0.08)] sm:rounded-[1.5rem]">
              <iframe
                key={embedUrl}
                src={embedPath}
                title="Embeddable support form preview"
                className="h-[620px] w-full bg-background sm:h-[700px] xl:h-[760px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
