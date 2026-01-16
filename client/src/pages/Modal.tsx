import { Form, Detail } from "../components/modals";
import { FilterProvider } from "../context/filter-context";
import { ListViewProvider } from "../context/listView-context";
import { SortProvider } from "../context/sort-context";

const Modal = () => {
  return (
    <>
      <FilterProvider>
        <SortProvider>
          <ListViewProvider>
            <Form />
          </ListViewProvider>
        </SortProvider>
      </FilterProvider>
      <Detail />
    </>
  );
};

export default Modal;
