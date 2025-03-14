interface TableOfContentsProps {
  headings: { id: string; text: string }[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  return (
    <nav>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-sm hover:text-primary transition-colors inline-block py-1"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
