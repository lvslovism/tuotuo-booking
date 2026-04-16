import { cn } from '../../utils/cn';
import type { GroupDiscount } from '../../types';

interface Props {
  people: number;
  maxPeople: number;
  groupDiscount: GroupDiscount;
  terminology: { booking?: string };
  onChange: (people: number) => void;
}

export function PeopleSelector({ people, maxPeople, groupDiscount, terminology, onChange }: Props) {
  const options = Array.from({ length: Math.min(maxPeople, 4) }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-3">
      <h3 className="font-bold text-gray-800 mb-3">
        {terminology.booking || '預約'}人數
      </h3>

      <div className="flex gap-2">
        {options.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              'flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all',
              people === n
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 text-gray-500 hover:border-gray-300',
            )}
          >
            {n === 1 ? '1 人' : `${n} 人同行`}
          </button>
        ))}
      </div>

      {/* Discount description from config — not hardcoded */}
      {groupDiscount.description && people >= groupDiscount.min_people_or_sessions && (
        <p className="mt-2 text-sm text-accent bg-accent/5 rounded-lg px-3 py-2">
          {groupDiscount.description}
        </p>
      )}
    </div>
  );
}
