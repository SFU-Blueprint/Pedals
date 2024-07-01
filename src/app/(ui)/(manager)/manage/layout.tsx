import ManageNavBar from "@/components/layouts/ManageNavBar";

export default function ManagerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ManageNavBar className="fixed left-20 top-20" />
      <div className="flex w-full justify-between bg-pedals-lightgrey px-20 pt-[100px]">
        <div className="flex gap-2 py-10">
          <button type="button" className="uppercase">
            Shifts
          </button>
          <button type="button" className="uppercase">
            People
          </button>
        </div>
        <div className="flex flex-grow items-center justify-end gap-2">
          <input type="text" placeholder="Search Name" />
          <select className="rounded-[3px] bg-white px-3 py-3 font-mono text-lg">
            <option value="month" className="min-w-[100px]">
              May
            </option>
          </select>
          <select className="rounded-[3px] bg-white px-3 py-3 font-mono text-lg">
            <option value="year" className="min-w-[100px]">
              2024
            </option>
          </select>
        </div>
      </div>
      <div className="flex w-full justify-between bg-pedals-lightgrey px-10">
        <div className="flex flex-grow gap-2 py-5 pr-10">
          <button type="button" className="min-w-[100px]">
            Shift
          </button>
          <button type="button" className="min-w-[100px] !bg-yellow-400">
            People
          </button>
        </div>
        <div className="flex flex-grow items-center justify-end gap-2">
          <input type="text" placeholder="Search Name" />
        </div>
      </div>
      <div className="flex w-full flex-col bg-pedals-lightgrey">
        <div className="flex w-full items-center">
          <hr
            className="flex-grow bg-gray-300"
            style={{ height: "3px", margin: "0 40px" }}
          />
        </div>
        <div className="flex w-full justify-between px-10 py-2">
          <div className="flex items-center gap-4">
            <label>
              <input
                type="radio"
                name="options"
                value="option1"
                className="mr-2"
              />
              Select All
            </label>
            <label>
              <input
                type="radio"
                name="options"
                value="option2"
                className="mr-2"
              />
              Inactive
            </label>
          </div>
          <button
            type="submit"
            className="min-w-[100px] rounded-[30px] bg-yellow-400"
          >
            Remove from database
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
