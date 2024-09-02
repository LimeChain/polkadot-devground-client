import type { V14 } from '@polkadot-api/view-builder';

export const PalletSelect = ({
  pallets,
  onPalletSelect,
}: {
  pallets: V14['pallets'];
  onPalletSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
},
) => {
  return (
    <div>
      <label className="flex flex-col gap-2">
        <span className="pl-2">Pallet</span>
        <select
          name="pallet"
          onChange={onPalletSelect}
          className="w-full p-2"
        >
          {
            pallets?.map((ex, index) => {
              return (
                <option
                  key={`pallet-${ex.name}`}
                  id={ex.name}
                  value={index}
                >
                  {ex.name}
                </option>
              );
            })
          }
        </select>
      </label>
    </div>

  );
};
