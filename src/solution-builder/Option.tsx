type OptionData = {
  title: string;
  description: string;
  id: string;
};

type Props = {
  selected?: boolean;
  onSelect?: (id: string) => void;
  data: OptionData;
};

export function Option({ selected, onSelect, data }: Props) {
  return (
    <button
      type="button"
      className={"sb-option" + (selected ? " is-selected" : "")}
      onClick={() => onSelect?.(data.id)}
      aria-pressed={selected}
    >
      <span className="sb-option__dot" />
      <b className="sb-option__title">{data.title}</b>
      <span className="sb-option__desc">{data.description}</span>
    </button>
  );
}
