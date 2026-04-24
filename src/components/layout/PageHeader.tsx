interface Props {
  title: string;
}

export function PageHeader({ title }: Props) {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40 px-4 py-3">
      <h1 className="text-lg font-semibold text-gray-900 text-center">{title}</h1>
    </header>
  );
}
