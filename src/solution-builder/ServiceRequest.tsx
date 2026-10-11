import { useState } from "react";
import ServicePicker from "./ServicePicker";
import ServiceDetail from "./ServiceDetail";
import RequestList from "./RequestList";

type Props = {
  industry: string;
  task: string;
  sites: number;
};

const services = [
  { id: "predictive", title: "Predictive maintenance" },
  { id: "tracking", title: "Asset tracking" },
  { id: "energy", title: "Energy monitoring" },
];

export default function ServiceRequest({ industry, task, sites }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [requestedIds, setRequestedIds] = useState<string[]>([]);

  const selected = services.find((service) => service.id === selectedId);
  const brief = [industry, task, `${sites} sites`].join(" · ");

  function toggle(id: string) {
    setRequestedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  console.log(requestedIds);

  return (
    <section>
      <p>{brief}</p>
      <ServicePicker
        services={services}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <div className="service-request__columns">
        {selected ? (
          <>
            <ServiceDetail
              title={selected.title}
              id={selected.id}
              added={requestedIds.includes(selected.id)}
              onToggle={() => toggle(selected.id)}
            />
            <RequestList currentRequest={requestedIds} />
          </>
        ) : null}
      </div>
    </section>
  );
}
