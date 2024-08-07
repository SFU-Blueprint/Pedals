export default function Checkin() {
  return (
    <>
      <div className="flex w-full flex-col bg-pedals-lightgrey">
        <div className="flex w-full items-center px-10">
          <hr
            className="flex-grow bg-gray-300"
            style={{ height: "3px", margin: "0 40px" }}
          />
        </div>
        <div className="flex w-full justify-between px-20 py-2">
          <div className="flex items-center gap-4">
            <label className="font-mono uppercase" htmlFor="select-all">
              <input
                type="radio"
                name="options"
                value="option1"
                className="mr-2"
              />
              Select All
            </label>
            <label className="font-mono uppercase" htmlFor="inactive">
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
            className="rounded-[30px] bg-yellow-400 uppercase"
          >
            Remove from database
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between bg-pedals-grey px-16 py-2">
        <div className="text-center">Name</div>
        <div className="text-center">Username</div>
        <div className="text-center">Date of Birth</div>
        <div className="text-center">Last Seen</div>
        <div className="text-center">Total</div>
      </div>
    </>
  );
}
