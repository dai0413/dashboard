import { useParams } from "react-router-dom";
import { useTransfer } from "../context/transfer-context";
import { useEffect } from "react";

const TransferDetail = () => {
  const { id } = useParams();
  const { readTransfer, selectedTransfer } = useTransfer();

  useEffect(() => {
    if (id) {
      readTransfer(id);
    }
  }, [id, readTransfer]);

  if (!selectedTransfer) {
    return <div>Loading...</div>; // データがロードされるまでの表示
  }

  return (
    <div>
      <h2>移籍情報詳細</h2>
      <p>移籍日: {selectedTransfer.from_date}</p>
      <p>移籍元: {selectedTransfer.from_team}</p>
      <p>移籍先: {selectedTransfer.to_team}</p>
      <p>名前: {selectedTransfer.player}</p>
      {/* 他の詳細情報 */}
    </div>
  );
};

export default TransferDetail;
