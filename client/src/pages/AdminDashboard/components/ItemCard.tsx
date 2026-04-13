import { IconButton } from "../../../components/buttons";
import { Item } from "../types";

type Props = {
  item: Item;
  onClick?: () => void;
};

export const ItemCard = ({ item, onClick }: Props) => (
  <div onClick={onClick}>
    <div className="py-4 px-3 border-2 rounded-lg hover:border-green-500 hover:shadow transition">
      <IconButton icon={item.icon} />
      <h2 className="text-lg font-bold mb-2">{item.desc}</h2>
      <p className="text-gray-500 text-sm">{item.model}</p>
    </div>
  </div>
);
