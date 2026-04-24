interface Props {
  title: string;
  transparent?: boolean;
}

export function PageHeader({ title, transparent }: Props) {
  if (transparent) return null;
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40 px-4 py-3">
      <h1 className="text-lg font-semibold text-gray-900 text-center">{title}</h1>
    </header>
  );
}
