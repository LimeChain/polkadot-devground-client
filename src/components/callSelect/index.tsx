import type { ICallParam } from '@components/callParam';

export const CallSelect = ({
  calls,
  onCallSelect,
}: {
  calls: Omit<ICallParam, 'pallet' | 'onChange'>[];
  onCallSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
},
) => {
  return (
    <div>
      <label className="flex flex-col gap-2">
        <span className="pl-2">
          Call
        </span>
        <select
          name="call"
          onChange={onCallSelect}
          className="p-2"
        >
          {calls.map((call, index) => {
            return (
              <option
                key={`call-${call.name}`}
                value={index}
              >
                {call.name}
              </option>
            );
          })};
        </select>
      </label>
    </div>
  );

};
