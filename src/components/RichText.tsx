import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-5">{children}</ul>,
  },
};

export function RichText({ value, className }: { value: PortableTextBlock[]; className?: string }) {
  if (value.length === 0) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
