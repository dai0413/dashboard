import { Form, Detail } from "../components/modals";
import { ListViewProvider } from "../context/listView-context";

const Modal = () => {
  return (
    <>
      <ListViewProvider>
        <Form />
      </ListViewProvider>
      <Detail />
    </>
  );
};

export default Modal;
