import {
  DEFAULT_TYPOGRAPHY,
  DOCUMENT_FONTS,
  documentTypographySchema,
  type DocumentTypography,
} from '../typography';

export function DocumentStyleControls({
  value,
  onChange,
}: {
  value: DocumentTypography;
  onChange(value: DocumentTypography): void;
}) {
  return (
    <fieldset className="mb-5 rounded-sm border bg-card p-4">
      <legend className="px-2 text-sm font-medium">整篇正文样式</legend>
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm">
          字体{' '}
          <select
            aria-label="正文字体"
            className="rounded-sm border bg-background p-2"
            value={value.font}
            onChange={(event) =>
              onChange(documentTypographySchema.parse({ ...value, font: event.target.value }))
            }
          >
            {Object.entries(DOCUMENT_FONTS).map(([id, font]) => (
              <option key={id} value={id}>
                {font.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          字号{' '}
          <select
            aria-label="正文字号"
            className="rounded-sm border bg-background p-2"
            value={value.size}
            onChange={(event) =>
              onChange(
                documentTypographySchema.parse({ ...value, size: Number(event.target.value) }),
              )
            }
          >
            <option value="10.5">五号 · 10.5 磅</option>
            <option value="12">小四 · 12 磅</option>
            <option value="14">四号 · 14 磅</option>
            <option value="16">三号 · 16 磅</option>
          </select>
        </label>
        <label className="text-sm">
          行距{' '}
          <select
            aria-label="正文行距"
            className="rounded-sm border bg-background p-2"
            value={value.lineHeight}
            onChange={(event) =>
              onChange(
                documentTypographySchema.parse({
                  ...value,
                  lineHeight: Number(event.target.value),
                }),
              )
            }
          >
            <option value="1.15">1.15 倍</option>
            <option value="1.5">1.5 倍</option>
            <option value="2">2 倍</option>
          </select>
        </label>
        <button
          type="button"
          className="text-sm text-accent underline"
          onClick={() => onChange({ ...DEFAULT_TYPOGRAPHY })}
        >
          讲义默认：宋体小四
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Word 保留所选字体；设备未安装时会替换。PDF 使用内置中文字体，保留字号和行距。
      </p>
    </fieldset>
  );
}
