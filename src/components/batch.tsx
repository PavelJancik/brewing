type BatchProps = {
  batch: {
    id: string;
    name: string;
  };
};

const Batch = ({ batch }: BatchProps) => {
  return (
    <div key={batch.id} className="beerBatch">
      <h2>{batch.name}</h2>
    </div>
  );
};

export default Batch;
