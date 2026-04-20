import './CustomerForm.css'

const CustomerForm = ({ customerName, mobileNumber, setMobileNumber, setCustomerName }) => {
    return (
        <div className="p-3">
            <div className="mb-2">
                <div className="d-flex align-items-center gap-2">
                    <label htmlFor="customerName" className='col-4 text-light small'>
                        Customer <span className="text-muted">(optional)</span>
                    </label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        id="customerName"
                        placeholder="Walk-in Customer"
                        onChange={(e) => setCustomerName(e.target.value)}
                        value={customerName}
                    />
                </div>
            </div>
            <div className="mb-2">
                <div className="d-flex align-items-center gap-2">
                    <label htmlFor="mobileNumber" className='col-4 text-light small'>
                        Mobile <span className="text-muted">(optional)</span>
                    </label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        id="mobileNumber"
                        placeholder="0000000000"
                        onChange={(e) => setMobileNumber(e.target.value)}
                        value={mobileNumber}
                    />
                </div>
            </div>
        </div>
    )
}

export default CustomerForm;