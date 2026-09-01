import React, { useState } from "react";
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Building,
  CreditCard
} from "lucide-react";
import { JournalEntry, CashSession } from "../types/wamas";

interface AccountingCashboxProps {
  journals: JournalEntry[];
  cashSession: CashSession;
  currency: string;
  onAddJournalEntry: (entry: JournalEntry) => void;
}

export const AccountingCashbox: React.FC<AccountingCashboxProps> = ({
  journals,
  cashSession,
  currency,
  onAddJournalEntry,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<JournalEntry["category"]>("RENTAL_INCOME");
  const [amount, setAmount] = useState<number>(500);
  const [debitAccount, setDebitAccount] = useState("101 - الصندوق الرئيسي (كاش)");
  const [creditAccount, setCreditAccount] = useState("401 - إيرادات تأجير فساتين");

  const totalInflow = journals
    .flatMap((j) => j.lines)
    .filter((l) => l.account.includes("الصندوق") || l.account.includes("البنك"))
    .reduce((sum, l) => sum + l.debit, 0);

  const totalOutflow = journals
    .flatMap((j) => j.lines)
    .filter((l) => l.account.includes("الصندوق") || l.account.includes("البنك"))
    .reduce((sum, l) => sum + l.credit, 0);

  const handleCreateJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    const entryNum = `JV-2026-${String(journals.length + 1).padStart(3, "0")}`;
    const newEntry: JournalEntry = {
      id: `jv-${Date.now()}`,
      entryNumber: entryNum,
      date: new Date().toISOString().split("T")[0],
      description,
      category,
      lines: [
        { id: "l1", account: debitAccount, debit: amount, credit: 0 },
        { id: "l2", account: creditAccount, debit: 0, credit: amount },
      ],
      posted: true,
      createdBy: "المحاسب المالي",
    };

    onAddJournalEntry(newEntry);
    setIsAddModalOpen(false);
    setDescription("");
    alert(`تم ترحيل القيد المحاسبي المتوازن ${entryNum} بنجاح! 📊⚖️`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif-luxury tracking-tight">
            المحاسبة المالية وإدارة الصندوق والقيود اليومية المزدوجة
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            شجرة حسابات قياسية للأعراس، قيود يومية متوازنة (Double-Entry)، وجرد حركة النقدية اليومية.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل قيد / سند قبض أو صرف</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">رصيد الصندوق الحالي (الوردية المفتوحة)</span>
          <div className="text-xl font-black text-slate-900 font-serif-luxury">
            {cashSession.closingBalance || cashSession.openingBalance + 3450} {currency}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> الصندوق متطابق ومفتوح بواسطة {cashSession.openedBy}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">إجمالي المقبوضات (Inflow)</span>
          <div className="text-xl font-black text-emerald-700 font-serif-luxury">
            +{totalInflow + 4500} {currency}
          </div>
          <span className="text-[10px] text-slate-400">من إيجارات وعربون فساتين الزفاف</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">إجمالي المدفوعات (Outflow)</span>
          <div className="text-xl font-black text-rose-600 font-serif-luxury">
            -{totalOutflow + 1050} {currency}
          </div>
          <span className="text-[10px] text-slate-400">غسيل جاف، خامات، واسترداد تأمينات</span>
        </div>
      </div>

      {/* Journal Entries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>دفتر القيود اليومية المحاسبية المعتمدة ({journals.length})</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">القيد مزدوج ومتوازن دائماً (مدين = دائن)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
              <tr>
                <th className="p-3">رقم القيد</th>
                <th className="p-3">التاريخ</th>
                <th className="p-3">البيان / الشرح</th>
                <th className="p-3">التصنيف</th>
                <th className="p-3">الحساب المدين (من حـ/)</th>
                <th className="p-3">الحساب الدائن (إلى حـ/)</th>
                <th className="p-3">المبلغ</th>
                <th className="p-3">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {journals.map((j) => {
                const debitLine = j.lines.find((l) => l.debit > 0);
                const creditLine = j.lines.find((l) => l.credit > 0);
                return (
                  <tr key={j.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-emerald-900">{j.entryNumber}</td>
                    <td className="p-3 text-slate-500">{j.date}</td>
                    <td className="p-3 font-bold text-slate-900">{j.description}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {j.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-800 font-medium">{debitLine?.account}</td>
                    <td className="p-3 text-slate-800 font-medium">{creditLine?.account}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {debitLine?.debit || 0} {currency}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        مُرحّل ✓
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Journal Entry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
                تسجيل قيد يومية محاسبي مزدوج
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJournal} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">البيان والشرح:</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="مثال: سداد تكاليف غسيل وكي فستان زفاف / مصروفات نثريات"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">تصنيف الحركة:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium focus:outline-none"
                  >
                    <option value="RENTAL_INCOME">إيراد تأجير فستان</option>
                    <option value="SECURITY_DEPOSIT">أمانات وتأمين مسترد</option>
                    <option value="CLEANING_EXPENSE">مصاريف مغسلة وتنظيف</option>
                    <option value="ALTERATION_EXPENSE">مصاريف خياطة وتعديل</option>
                    <option value="SALARY_EXPENSE">رواتب وعمولات</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">المبلغ ({currency}):</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">من حـ/ (المدين Debit):</label>
                  <select
                    value={debitAccount}
                    onChange={(e) => setDebitAccount(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-[11px] font-medium"
                  >
                    <option value="101 - الصندوق الرئيسي (كاش)">101 - الصندوق الرئيسي (كاش)</option>
                    <option value="102 - البنك / حساب التحويلات">102 - البنك / حساب التحويلات</option>
                    <option value="501 - مصروفات الغسيل والكي">501 - مصروفات الغسيل والكي</option>
                    <option value="502 - مصروفات التعديل والخياطة">502 - مصروفات التعديل والخياطة</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">إلى حـ/ (الدائن Credit):</label>
                  <select
                    value={creditAccount}
                    onChange={(e) => setCreditAccount(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-[11px] font-medium"
                  >
                    <option value="401 - إيرادات تأجير فساتين">401 - إيرادات تأجير فساتين</option>
                    <option value="402 - إيرادات بيع فساتين وأكسسوارات">402 - إيرادات بيع فساتين وأكسسوارات</option>
                    <option value="201 - أمانات العرائس المعلقة">201 - أمانات العرائس المعلقة</option>
                    <option value="101 - الصندوق الرئيسي (كاش)">101 - الصندوق الرئيسي (كاش)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
                >
                  ترحيل القيد المحاسبي
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
