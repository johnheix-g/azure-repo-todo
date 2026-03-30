import ModalComponent from "./ModalComponent";
import Header from "./Header";
import Body from "./Body";
import MemoDetailBody from "./MemoDetailBody";
import Footer from "./Footer";

export default function MemoDetail({ memo, onClose }) {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <ModalComponent
      open={!!memo}
      Header={<Header header="Memo Detail" onCancel={() => handleClose()} />}
      Body={
        <Body
          title={"Memo Detail: " + memo.title}
          message={<MemoDetailBody memo={memo} />}
        />
      }
      Footer={<Footer onCancel={() => handleClose()} cancelText="Close" />}
    />
  );
}
