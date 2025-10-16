import { Button } from "antd";
import RequirePerm from "../RequirePerm";
export default function SidebarPanel({
  tabs = [],
  activeTab,
  onTabChange,
  stats = [],
  totalLabel = "Total",
  showDate = false,
  buttonText,
  onButtonClick,
  buttonPerm, // optional permission name for the button
}) {
  // --- Compute total from stats ---
  const total_stats = stats.reduce(
    (sum, stat) => sum + Number(stat.value || 0),
    0,
  );

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ✅ define the button JSX once
  const ButtonContent = (
    <Button
      type="primary"
      block
      className="mt-2"
      onClick={onButtonClick} // ✅ correctly placed inside Button
    >
      {buttonText}
    </Button>
  );

  return (
    <div className="w-full max-w-[18rem] flex flex-col gap-y-5">
      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange && onTabChange(tab)}
              className={`flex-1 py-1 rounded-sm text-sm font-medium transition-all duration-200
                ${
                  activeTab === tab
                    ? "bg-neutral-900 text-white border border-neutral-900"
                    : "border border-neutral-700 text-neutral-400 hover:text-black hover:border-gray-500"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Total Stats */}
      <div className="h-[3.5rem] bg-neutral-950 rounded-sm flex justify-between items-center px-4">
        <h1 className="text-white text-xl font-semibold">{totalLabel}</h1>
        <div className="w-[3rem] bg-white h-[2rem] flex items-center justify-center rounded-sm">
          <span className="font-semibold">{total_stats}</span>
        </div>
      </div>

      {/* Current Date */}
      {showDate && (
        <span className="font-medium text-[#727272]">{currentDate}</span>
      )}

      {/* Individual Stats */}
      {stats.length > 0 && (
        <div className="flex flex-col gap-y-2">
          {stats.map(({ label, value }, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between h-[1.5rem]"
            >
              <span className="font-semibold">{label}</span>
              <div className="h-full w-[3rem] flex items-center justify-center bg-[#D4DBFF] rounded-sm">
                <span className="font-semibold">{value}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      {buttonText && onButtonClick && (
        <>
          {buttonPerm ? (
            <RequirePerm perm={buttonPerm}>{ButtonContent}</RequirePerm>
          ) : (
            ButtonContent
          )}
        </>
      )}
    </div>
  );
}
