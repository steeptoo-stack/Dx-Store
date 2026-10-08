import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import { 
  X, 
  ShieldCheck, 
  Copy, 
  Check, 
  Truck, 
  AlertCircle, 
  ArrowRight, 
  Lock, 
  Info,
  DollarSign
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderPlaced
}) => {
  const { cart, cartSubtotal, settings, placeOrder, showNotification } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState<'Dhaka' | 'Outside Dhaka'>('Dhaka');
  const [thana, setThana] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(() => {
    if (settings.payment.bkashEnabled) return 'bkash';
    if (settings.payment.codEnabled) return 'cod';
    if (settings.payment.nagadEnabled) return 'nagad';
    return 'bkash';
  });

  // Manual payment inputs
  const [paymentPhoneNumber, setPaymentPhoneNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Copied state
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const currency = settings.store?.currencySymbol || '৳';
  const isInsideDhaka = district === 'Dhaka';
  let deliveryFee = isInsideDhaka
    ? settings.delivery.insideDhakaCharge
    : settings.delivery.outsideDhakaCharge;

  if (
    settings.delivery.freeDeliveryThreshold > 0 &&
    cartSubtotal >= settings.delivery.freeDeliveryThreshold
  ) {
    deliveryFee = 0;
  }

  const codCharge = (paymentMethod === 'cod' && settings.payment.codCharge > 0)
    ? settings.payment.codCharge
    : 0;

  const grandTotal = cartSubtotal + deliveryFee + codCharge;

  // Clipboard copy handler
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(label);
    showNotification(`Copied ${text} to clipboard`, 'success');
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};

    if (!customerName.trim()) {
      errors.customerName = 'Please enter your full name';
    }

    if (!phone.trim()) {
      errors.phone = 'Mobile phone number is required';
    } else {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 11) {
        errors.phone = 'Please enter a valid 11-digit Bangladesh phone number (e.g. 017xxxxxxxx)';
      }
    }

    if (!address.trim()) {
      errors.address = 'Detailed delivery address is required';
    }

    if (!thana.trim()) {
      errors.thana = 'Thana / Upazila is required';
    }

    // Payment validation
    if (paymentMethod === 'bkash') {
      if (!paymentPhoneNumber.trim()) {
        errors.paymentPhoneNumber = 'Sender bKash number is required';
      }
      if (!transactionId.trim()) {
        errors.transactionId = 'bKash Transaction ID (TrxID) is required';
      }
    }

    if (paymentMethod === 'nagad') {
      if (settings.payment.nagadNumber === 'Not configured') {
        errors.paymentMethod = 'Nagad is not configured yet. Please choose bKash or Cash on Delivery.';
      } else {
        if (!paymentPhoneNumber.trim()) {
          errors.paymentPhoneNumber = 'Sender Nagad number is required';
        }
        if (!transactionId.trim()) {
          errors.transactionId = 'Nagad Transaction ID (TrxID) is required';
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showNotification('Please fill all required checkout fields', 'error');
      return;
    }

    if (cart.length === 0) {
      showNotification('Your cart is empty', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await placeOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        district,
        thana: thana.trim(),
        notes: notes.trim(),
        paymentMethod,
        paymentPhoneNumber: paymentPhoneNumber.trim() || undefined,
        transactionId: transactionId.trim().toUpperCase() || undefined
      });

      onClose();
      onOrderPlaced(order.id);
    } catch (err) {
      showNotification('Failed to submit order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Complete Your Security Order
              </h2>
              <p className="text-xs text-slate-400">
                Authorized Genuine Hardware with 2-Year Warranty
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Customer & Shipping Details */}
            <div className="lg:col-span-7 space-y-5">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold flex items-center justify-center">1</span>
                  <span>Delivery Information</span>
                </h3>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="e.g. Engr. Tanvir Ahmed"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      formErrors.customerName ? 'border-red-500' : 'border-slate-800'
                    }`}
                  />
                  {formErrors.customerName && (
                    <p className="text-[11px] text-red-400 mt-1">{formErrors.customerName}</p>
                  )}
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone Number (BD) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono ${
                        formErrors.phone ? 'border-red-500' : 'border-slate-800'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-red-400 mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address <span className="text-slate-500">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                {/* District Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Delivery Region <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDistrict('Dhaka')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        district === 'Dhaka'
                          ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/40'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <p className="font-semibold text-xs">Inside Dhaka</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Fee: {currency}{settings.delivery.insideDhakaCharge}
                      </p>
                      <p className="text-[10px] text-cyan-400 mt-0.5 font-mono">
                        {settings.delivery.estimatedDeliveryInside}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDistrict('Outside Dhaka')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        district === 'Outside Dhaka'
                          ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/40'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <p className="font-semibold text-xs">Outside Dhaka (All 64 Dist.)</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Fee: {currency}{settings.delivery.outsideDhakaCharge}
                      </p>
                      <p className="text-[10px] text-cyan-400 mt-0.5 font-mono">
                        {settings.delivery.estimatedDeliveryOutside}
                      </p>
                    </button>
                  </div>
                </div>

                {/* Thana/Upazila */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Thana / Upazila <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={thana}
                    onChange={e => setThana(e.target.value)}
                    placeholder="e.g. Dhanmondi, Uttara, Panchlaish, Bogura Sadar"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      formErrors.thana ? 'border-red-500' : 'border-slate-800'
                    }`}
                  />
                  {formErrors.thana && (
                    <p className="text-[11px] text-red-400 mt-1">{formErrors.thana}</p>
                  )}
                </div>

                {/* Detailed Street Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Detailed Delivery Address <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="House / Flat / Road / Sector / Landmark"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      formErrors.address ? 'border-red-500' : 'border-slate-800'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-[11px] text-red-400 mt-1">{formErrors.address}</p>
                  )}
                </div>

                {/* Order Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Special Installation / Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Call before coming, urgent office installation"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Payment Method Selection & Order Review */}
            <div className="lg:col-span-5 space-y-5">
              {/* Items in Order with Product Images */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="uppercase tracking-wider">Order Items ({cart.length})</span>
                  <span className="text-cyan-400 font-mono">{currency}{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-2.5 text-xs bg-slate-900/50 p-2 rounded-xl border border-slate-850">
                      <img
                        src={product.mainImage || (product.images && product.images[0]) || './placeholder-security.svg'}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-800 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = './placeholder-security.svg';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white truncate text-xs">{product.name}</p>
                        <p className="text-[11px] text-slate-400">Qty: {quantity} × {currency}{(product.discountPrice ?? product.price).toLocaleString()}</p>
                      </div>
                      <span className="font-mono text-cyan-400 font-bold shrink-0">
                        {currency}{((product.discountPrice ?? product.price) * quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold flex items-center justify-center">2</span>
                  <span>Payment Method</span>
                </h3>
              </div>

              {/* Payment Methods Options */}
              <div className="space-y-2.5">
                {/* 1. Cash on Delivery */}
                {settings.payment.codEnabled && (
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-cyan-950/50 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-cyan-500 focus:ring-cyan-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm">Cash on Delivery (COD)</span>
                        <Truck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {settings.payment.codInstructions}
                      </p>
                      {settings.payment.codCharge > 0 && (
                        <p className="text-[10px] text-amber-400 mt-1 font-mono">
                          COD handling fee: {currency}{settings.payment.codCharge}
                        </p>
                      )}
                    </div>
                  </label>
                )}

                {/* 2. bKash Manual Payment */}
                {settings.payment.bkashEnabled && (
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'bkash'
                        ? 'bg-pink-950/40 border-pink-500 text-white shadow-lg shadow-pink-950/20'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="mt-1 text-pink-500 focus:ring-pink-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-pink-300">bKash</span>
                          <span className="text-[10px] bg-pink-900/60 text-pink-200 border border-pink-700/60 px-1.5 py-0.2 rounded font-mono">
                            {settings.payment.bkashType || "Send Money"}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-pink-400 bg-pink-950 px-2 py-0.5 rounded border border-pink-800">
                          {settings.payment.bkashNumber || '01761861680'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Send required bill amount to our bKash Personal Number and enter TrxID below.
                      </p>
                    </div>
                  </label>
                )}

                {/* 3. Nagad Manual Payment */}
                {settings.payment.nagadEnabled && (
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'nagad'
                        ? 'bg-orange-950/40 border-orange-500 text-white shadow-lg shadow-orange-950/20'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="nagad"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                      className="mt-1 text-orange-500 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-orange-300">Nagad</span>
                          <span className="text-[10px] bg-orange-900/60 text-orange-200 border border-orange-700/60 px-1.5 py-0.2 rounded font-mono">
                            {settings.payment.nagadType || "Send Money"}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          settings.payment.nagadNumber === 'Not configured'
                            ? 'text-slate-400 bg-slate-900 border-slate-800'
                            : 'text-orange-400 bg-orange-950 border-orange-800'
                        }`}>
                          {settings.payment.nagadNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {settings.payment.nagadNumber === 'Not configured'
                          ? 'Nagad account is currently not configured by the store.'
                          : 'Send Money to our Nagad account and provide Transaction ID.'}
                      </p>
                    </div>
                  </label>
                )}
              </div>

              {/* Dynamic Instructions Box for bKash */}
              {paymentMethod === 'bkash' && (
                <div className="p-4 rounded-2xl bg-pink-950/30 border border-pink-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-pink-300 uppercase tracking-wide">
                        bKash Personal / Payment Number
                      </p>
                      <p className="text-lg font-extrabold font-mono text-white mt-0.5">
                        {settings.payment.bkashNumber || '01761861680'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.payment.bkashNumber || '01761861680', 'bkash')}
                      className="px-3 py-1.5 rounded-lg bg-pink-900/60 hover:bg-pink-800 text-pink-200 text-xs font-semibold border border-pink-700 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedNumber === 'bkash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber === 'bkash' ? 'Copied!' : 'Copy Number'}</span>
                    </button>
                  </div>

                  {/* Payment Instructions */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-line leading-relaxed">
                    {settings.payment.bkashInstructions}
                  </div>

                  {/* Disclaimer notice */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Info className="w-3 h-3 text-pink-400 shrink-0" />
                    <span>Secure Manual Send Money. Transaction ID will be verified by DX Security before dispatch.</span>
                  </div>

                  {/* bKash Checkout Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-pink-200 mb-1">
                        Your bKash Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={paymentPhoneNumber}
                        onChange={e => setPaymentPhoneNumber(e.target.value)}
                        placeholder="01xxxxxxxxx"
                        className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-pink-500 ${
                          formErrors.paymentPhoneNumber ? 'border-red-500' : 'border-slate-800'
                        }`}
                      />
                      {formErrors.paymentPhoneNumber && (
                        <p className="text-[10px] text-red-400 mt-0.5">{formErrors.paymentPhoneNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-pink-200 mb-1">
                        Transaction ID (TrxID) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={e => setTransactionId(e.target.value.toUpperCase())}
                        placeholder="e.g. BK9X8291..."
                        className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:ring-1 focus:ring-pink-500 ${
                          formErrors.transactionId ? 'border-red-500' : 'border-slate-800'
                        }`}
                      />
                      {formErrors.transactionId && (
                        <p className="text-[10px] text-red-400 mt-0.5">{formErrors.transactionId}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Instructions Box for Nagad */}
              {paymentMethod === 'nagad' && (
                <div className="p-4 rounded-2xl bg-orange-950/30 border border-orange-500/40 space-y-3 animate-in fade-in">
                  {settings.payment.nagadNumber === 'Not configured' ? (
                    <div className="p-3 bg-amber-950/40 border border-amber-800 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>The store has not configured a Nagad number yet. Please switch to bKash or Cash on Delivery.</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-orange-300 uppercase tracking-wide">
                            Nagad Personal / Payment Number
                          </p>
                          <p className="text-lg font-extrabold font-mono text-white mt-0.5">
                            {settings.payment.nagadNumber}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(settings.payment.nagadNumber, 'nagad')}
                          className="px-3 py-1.5 rounded-lg bg-orange-900/60 hover:bg-orange-800 text-orange-200 text-xs font-semibold border border-orange-700 flex items-center gap-1.5 transition-colors"
                        >
                          {copiedNumber === 'nagad' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedNumber === 'nagad' ? 'Copied!' : 'Copy Number'}</span>
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-line leading-relaxed">
                        {settings.payment.nagadInstructions}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-xs font-semibold text-orange-200 mb-1">
                            Your Nagad Number <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="tel"
                            value={paymentPhoneNumber}
                            onChange={e => setPaymentPhoneNumber(e.target.value)}
                            placeholder="01xxxxxxxxx"
                            className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                              formErrors.paymentPhoneNumber ? 'border-red-500' : 'border-slate-800'
                            }`}
                          />
                          {formErrors.paymentPhoneNumber && (
                            <p className="text-[10px] text-red-400 mt-0.5">{formErrors.paymentPhoneNumber}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-orange-200 mb-1">
                            Transaction ID (TrxID) <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={transactionId}
                            onChange={e => setTransactionId(e.target.value.toUpperCase())}
                            placeholder="e.g. NG89X201..."
                            className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                              formErrors.transactionId ? 'border-red-500' : 'border-slate-800'
                            }`}
                          />
                          {formErrors.transactionId && (
                            <p className="text-[10px] text-red-400 mt-0.5">{formErrors.transactionId}</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Order Calculation Summary */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Items Subtotal ({cart.length} items)</span>
                  <span className="font-mono text-white font-semibold">
                    {currency}{cartSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Delivery Charge ({district})</span>
                  <span className="font-mono text-slate-200">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-semibold">FREE</span>
                    ) : (
                      `${currency}${deliveryFee}`
                    )}
                  </span>
                </div>

                {codCharge > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>COD Handling Fee</span>
                    <span className="font-mono text-slate-200">{currency}{codCharge}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-sm font-bold text-white">
                  <span>Grand Total Payable</span>
                  <span className="text-xl font-mono text-cyan-400">
                    {currency}{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Security Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Place Order ({currency}{grandTotal.toLocaleString()})</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                By placing an order, you agree to DX Security's Warranty, Terms & Delivery Policies.
              </p>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};
