interface SchemaMarkupProps {
  id: string;
  schema: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function SchemaMarkup({ id, schema }: SchemaMarkupProps) {
  return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
