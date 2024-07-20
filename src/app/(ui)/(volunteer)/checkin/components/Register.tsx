import React from "react";

import FormInput from "@/components/FormInput";

interface RegisterProps {
  // Define any props you need for the component
}

const Register: React.FC<RegisterProps> = () => {
  return (
    <div>
      <form className="grid grid-cols-5 justify-between gap-20 px-20 py-10">
        <div className="col-span-2 items-end">
          <FormInput
            className="w-[90%]"
            label="Full Name"
            type="text"
            placeholder="TYPE"
          />
        </div>
        <div className="col-span-2 items-end">
          <FormInput
            className="flex h-full"
            label="(If under 18) Date of Birth"
            type="text"
            placeholder="TYPE"
          >
            <div className="flex gap-2">
              <input type="text" className="w-1/2" placeholder="Day" />
              <input type="text" className="w-1/2" placeholder="Month" />
              <input type="text" className="w-1/2" placeholder="Year" />
            </div>
          </FormInput>
        </div>
        <div className="col-span-1"></div>
      </form>
    </div>
  );
};

export default Register;
