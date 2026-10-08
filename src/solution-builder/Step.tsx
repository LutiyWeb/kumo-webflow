import { Option } from "./Option";

type StepProps = {
  items: object[] | { [key: string]: object[] } | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function Step({ items, onSelect, selectedId }: StepProps) {
  if (Array.isArray(items)) {
    return (
      <div className="sb-step">
        <h3 className="sb-step__question">{}</h3>
        <div className="sb-step__grid">
          {items.map((item: any) => (
            <Option
              key={item.id}
              data={item}
              onSelect={onSelect}
              selected={item.id === selectedId}
            />
          ))}
        </div>
      </div>
    );
  }
}
