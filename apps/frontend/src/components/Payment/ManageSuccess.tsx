import PaymentModal from "./components/PaymentModal";

const ManageSuccess = () => {
  return (
    <div>
      <PaymentModal status="Successful" message="Your plan has been updated" />
    </div>
  );
};

export default ManageSuccess;
