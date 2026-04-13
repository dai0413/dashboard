import { Item } from "../types";
import { ItemCard } from "./ItemCard";

type Props = {
  title: string;
  items: Item[];
  onClick?: (item: Item) => void;
};

export const Section = ({ title, items, onClick }: Props) => (
  <section className="mb-10">
    <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-4">
      {title}
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <ItemCard
          key={item.model}
          item={item}
          onClick={() => onClick?.(item)}
        />
      ))}
    </div>
  </section>
);
