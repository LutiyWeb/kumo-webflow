type Props = {
  currentRequest: string[];
};

export default function RequestList({ currentRequest }: Props) {
  return (
    <div className="request-list">
      {currentRequest.map((item) => (
        <p key={item}> {item}</p>
      ))}
    </div>
  );
}
