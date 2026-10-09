type Props = {
  step: number;
  total: number;
};

export function Progress({ step, total }: Props) {
  return (
    <div className="sb-progress">
      <span className="sb-progress__label">
        Step {step} / {total}
      </span>
      <div className="sb-progress__bar">
        <i style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  );
}
