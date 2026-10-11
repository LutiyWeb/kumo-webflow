type Services = {
  id: string;
  title: string;
};

type Props = {
  services: Services[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function ServicePicker({
  services,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className="service-picker">
      {services.map((service) => (
        <button
          type="button"
          className={
            service.id === selectedId
              ? "service-card service-card--selected"
              : "service-card"
          }
          key={service.id}
          onClick={() => onSelect(service.id)}
        >
          {service.title}
        </button>
      ))}
    </div>
  );
}
