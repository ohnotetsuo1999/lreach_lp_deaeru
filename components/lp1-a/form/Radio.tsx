type Props = {
  name: string;
};

export function Radio({ name }: Props) {
  return (
    <div>
      <input name={name} type="radio" />
    </div>
  );
}
