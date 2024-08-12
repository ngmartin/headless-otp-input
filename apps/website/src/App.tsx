import { useState } from "react";
import * as OTPInput from "headless-otp-input";

function OTPInputField() {
  return (
    <OTPInput.Field className="border-b-2 outline-none border-pink-400 w-14 text-center text-2xl p-1 hover:border-pink-600 focus:border-pink-800" />
  );
}

function App() {
  const [value, setValue] = useState(["", "", "", "", "", ""]);

  return (
    <>
      <h1 className="text-center font-bold text-4xl my-4">
        headless-otp-input
      </h1>

      <OTPInput.Root
        className="flex justify-center items-center gap-4 my-8"
        autoFocus
        value={value}
        onChange={setValue}
        onCompleted={(value) => console.log("onCompleted:", value)}
      >
        <OTPInputField />
        <OTPInputField />
        <OTPInputField />
        <OTPInputField />
        <OTPInputField />
        <OTPInputField />
      </OTPInput.Root>
    </>
  );
}

export default App;
