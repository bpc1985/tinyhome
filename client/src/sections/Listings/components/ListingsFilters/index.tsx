import { Select } from "antd";
import { ListingsFilter } from "src/__generated__/graphql";

interface Props {
  filter: ListingsFilter;
  setFilter: (filter: ListingsFilter) => void;
}

const { Option } = Select;

export const ListingsFilters = ({ filter, setFilter }: Props) => {
  return (
    <div className="listings-filters">
      <span>Filter By</span>
      <Select
        value={filter}
        onChange={(filter: ListingsFilter) => setFilter(filter)}
      >
        <Option value={ListingsFilter.PriceLowToHigh}>
          Price: Low to High
        </Option>
        <Option value={ListingsFilter.PriceHighToLow}>
          Price: High to Low
        </Option>
      </Select>
    </div>
  );
};
