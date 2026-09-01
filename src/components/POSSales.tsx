import React, { useState } from "react";
import {
  ShoppingCart,
  Search,
  Printer,
  Trash2,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Receipt,
  Plus,
  Minus
} from "lucide-react";
import { PhysicalItem } from "../types/wamas";

interface POSSalesProps {
  dresses: PhysicalItem[];
  currency: string;
  onRecordSale: (saleData: any) => void;
}

interface CartItem {
  dress: PhysicalItem;
  quantity: number;
  salePrice: number;
}

export const POSSales: React.FC<POSSalesProps> = ({ dresses, currency, onRecordSale }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerName, setCustomerName] = useState("عميل مباشر (Walk-in)");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "TRANSFER">("CARD");
  const [lastReceipt, setLastReceipt] = useState<any | null>(null);

  const availableForSale = dresses.filter(
    (d) =>
      d.state === "AVAILABLE" &&
      (d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.barcode.includes(searchTerm))
  );

  const addToCart = (dress: PhysicalItem) => {
    // Check margin protection (BR-05 / SL-02: Sale price cannot be lower than cost)
    if (dress.salePrice < dress.acquisitionCost) {
      alert("تنبيه حماية هامش الربح (القاعدة SL-02): لا يمكن البيع بأقل من سعر التكلفة!");
      return;
    }

    const existingIndex = cart.findIndex((item) => item.dress.id === dress.id);
    if (existingIndex >= 0) {
      alert("هذه القطعة ذات رقم تسلسلي فريد وتمت إضافتها مسبقاً للسلة.");
      return;
    } else {
      setCart([...cart, { dress, quantity: 1, salePrice: dress.salePrice }]);
    }
  };

  const removeFromCart = (dressId: string) => {
    setCart(cart.filter((item) => item.dress.id !== dressId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Validate discount limit for normal staff (BR-07 / SL-03: Max 15% without admin override)
    if (discountPercent > 15) {
      alert("تنبيه صلاحيات الخصم: الخصم يتجاوز الحد المسموح للكاشير (15%). يتطلب اعتماد المدير العام.");
      return;
    }

    const invoiceNo = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptData = {
      invoiceNo,
      date: new Date().toLocaleString("ar-SA"),
      customerName,
      items: cart,
      subtotal,
      discountAmount,
      total,
      paymentMethod,
    };

    onRecordSale(receiptData);
    setLastReceipt(receiptData);
    setCart([]);
    alert(`تم إصدار فاتورة البيع رقم ${invoiceNo} وخصم القطع من المخزون بنجاح! 🧾🎉`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif-luxury tracking-tight">
            المبيعات المباشرة ونقطة البيع (POS & Direct Sales)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إصدار فواتير البيع النهائي، الخصم الفوري من المخزون، وحماية هامش الربح من البيع بأقل من التكلفة.
          </p>
        </div>

        <div className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold">
          حالة الصندوق: مفتوح 🟢
        </div>
      </div>

      {/* Grid: Products on Left (7 cols), Cart & Receipt on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Products Search & List */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-amber-600" />
              <span>القطع المتاحة للبيع الفوري ({availableForSale.length})</span>
            </h2>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="امسح الباركود أو ابحث برقم الصنف..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {availableForSale.map((dress) => (
              <div
                key={dress.id}
                onClick={() => addToCart(dress)}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 cursor-pointer transition-all text-xs"
              >
                <img
                  src={dress.imageUrl}
                  alt={dress.name}
                  className="w-14 h-14 rounded-lg object-cover object-top shrink-0 border border-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-mono font-bold text-[11px] text-amber-800">{dress.itemCode}</div>
                  <div className="font-bold text-slate-900 truncate">{dress.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-slate-500">مقاس: {dress.size}</span>
                    <span className="font-black text-emerald-700">{dress.salePrice} {currency}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart & Checkout */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-600" />
                <span>سلة المبيعات ({cart.length} أصناف)</span>
              </h2>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-[11px] text-rose-600 hover:underline font-bold"
                >
                  تفريغ السلة
                </button>
              )}
            </div>

            {/* Customer input */}
            <div className="text-xs">
              <label className="font-bold text-slate-700 block mb-1">اسم العميل / المشتري:</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
              />
            </div>

            {/* Cart Items list */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  السلة فارغة حالياً. اختر فستاناً أو امسح الباركود للإضافة.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.dress.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{item.dress.name}</div>
                      <div className="text-[11px] text-slate-500">{item.dress.itemCode}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-900">{item.salePrice} {currency}</span>
                      <button
                        onClick={() => removeFromCart(item.dress.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Discount & Payment Method */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
              <div>
                <label className="font-bold text-slate-700 block mb-1">نسبة الخصم (%):</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">طريقة الدفع:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none"
                >
                  <option value="CARD">بطاقة / شبكة POS</option>
                  <option value="CASH">نقد كاش</option>
                  <option value="TRANSFER">تحويل بنكي</option>
                </select>
              </div>
            </div>
          </div>

          {/* Totals & Checkout Button */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>المجموع قبل الخصم:</span>
                <span className="font-bold">{subtotal} {currency}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>قيمة الخصم ({discountPercent}%):</span>
                  <span>- {discountAmount} {currency}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>الإجمالي النهائي المطلوب:</span>
                <span className="text-base text-amber-900">{total} {currency}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                cart.length === 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20"
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>إتمام البيع وطباعة الفاتورة الضريبية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {lastReceipt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="border-b border-dashed border-slate-300 pb-3 text-center space-y-1">
              <div className="font-bold text-xs text-amber-800">الأسطورة لمستلزمات وفستانين الأعراس</div>
              <h3 className="text-sm font-black text-slate-900 font-mono">فاتورة بيع نقدي مبسطة</h3>
              <div className="text-[10px] text-slate-400 font-mono">{lastReceipt.invoiceNo} | {lastReceipt.date}</div>
            </div>

            <div className="text-right text-xs space-y-2 border-b border-dashed border-slate-300 pb-3">
              <div className="text-slate-600 font-medium">العميل: {lastReceipt.customerName}</div>
              <div className="space-y-1">
                {lastReceipt.items.map((it: CartItem, i: number) => (
                  <div key={i} className="flex justify-between font-mono">
                    <span className="truncate">{it.dress.name}</span>
                    <span className="font-bold">{it.salePrice} {currency}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-xs text-right font-mono font-bold">
              <div className="flex justify-between text-slate-600">
                <span>المجموع:</span>
                <span>{lastReceipt.subtotal} {currency}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>المدفوع ({lastReceipt.paymentMethod}):</span>
                <span>{lastReceipt.total} {currency}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                طباعة إيصال 80mm
              </button>
              <button
                onClick={() => setLastReceipt(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
